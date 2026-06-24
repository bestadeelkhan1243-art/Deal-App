import { create } from 'zustand';
import { auth, isFirebaseInitialized } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useOfferStore } from './useOfferStore';
import { useMerchantStore } from './useMerchantStore';

type UserRole = 'customer' | 'merchant' | 'admin' | null;

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  user: FirebaseUser | null;
  isLoading: boolean;
  loginAs: (role: UserRole) => void;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signUpWithEmail: (email: string, password: string, role: UserRole, extraData?: { profilePic?: string, businessName?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Subscribe to real-time auth changes if Firebase is connected
  if (isFirebaseInitialized && auth) {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let resolvedRole: UserRole = 'customer'; // Default
        
        // Fetch role from Firestore
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              resolvedRole = userDoc.data().role as UserRole;
            }
          } catch (error) {
            console.warn("Failed to fetch user role from Firestore:", error);
          }
        }
        
        set({ isLoggedIn: true, user: firebaseUser, role: resolvedRole, isLoading: false });
        
        // Start listening to live offers now that we are authenticated
        useOfferStore.getState().initOffersListener();

        if (resolvedRole === 'merchant') {
          useMerchantStore.getState().fetchProfile();
        }
      } else {
        set({ isLoggedIn: false, user: null, role: null, isLoading: false });
      }
    });
  }

  return {
    isLoggedIn: false,
    role: null,
    user: null,
    isLoading: false,

    // Bypass/Demo Mode login action
    loginAs: (role) => set({ isLoggedIn: true, role, user: null }),

    loginWithEmail: async (email, password) => {
      if (!isFirebaseInitialized) {
        // Fallback for Demo Mode
        const role: UserRole = email.toLowerCase().includes('merchant') ? 'merchant' : 'customer';
        set({ isLoggedIn: true, role, user: null });
        return { success: true, role };
      }
      set({ isLoading: true });
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        let resolvedRole: UserRole = 'customer';
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            if (userDoc.exists()) {
              resolvedRole = userDoc.data().role as UserRole;
            }
          } catch (e) {
            console.warn("Failed to fetch role during login:", e);
          }
        }
        return { success: true, role: resolvedRole };
      } catch (error: any) {
        set({ isLoading: false });
        return { success: false, error: error.message || "Failed to sign in." };
      }
    },

    signUpWithEmail: async (email, password, role, extraData) => {
      if (!isFirebaseInitialized || !db) {
        // Fallback for Demo Mode
        set({ isLoggedIn: true, role, user: null });
        return { success: true, role };
      }
      set({ isLoading: true });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user role and details to Firestore
        const userData: any = {
          email: user.email,
          role: role,
          createdAt: new Date().toISOString()
        };

        if (extraData?.profilePic) userData.profilePic = extraData.profilePic;
        if (extraData?.businessName) userData.businessName = extraData.businessName;

        await setDoc(doc(db, 'users', user.uid), userData);
        
        return { success: true, role };
      } catch (error: any) {
        set({ isLoading: false });
        return { success: false, error: error.message || "Failed to register." };
      }
    },

    logout: async () => {
      if (isFirebaseInitialized && auth) {
        try {
          await signOut(auth);
        } catch (error) {
          console.warn("Firebase SignOut error:", error);
        }
      }
      set({ isLoggedIn: false, role: null, user: null });
    },

    setLoading: (isLoading) => set({ isLoading }),
  };
});
