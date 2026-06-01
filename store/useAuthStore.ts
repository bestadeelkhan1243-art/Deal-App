import { create } from 'zustand';
import { auth, isFirebaseInitialized } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

type UserRole = 'customer' | 'merchant' | 'admin' | null;

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  user: FirebaseUser | null;
  isLoading: boolean;
  loginAs: (role: UserRole) => void;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Subscribe to real-time auth changes if Firebase is connected
  if (isFirebaseInitialized && auth) {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Safe role resolution for the pitch:
        // If email contains "merchant", log in as merchant, otherwise customer.
        const role: UserRole = firebaseUser.email?.includes('merchant') ? 'merchant' : 'customer';
        set({ isLoggedIn: true, user: firebaseUser, role, isLoading: false });
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
        return { success: true };
      }
      set({ isLoading: true });
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
      } catch (error: any) {
        set({ isLoading: false });
        return { success: false, error: error.message || "Failed to sign in." };
      }
    },

    signUpWithEmail: async (email, password, role) => {
      if (!isFirebaseInitialized) {
        // Fallback for Demo Mode
        set({ isLoggedIn: true, role, user: null });
        return { success: true };
      }
      set({ isLoading: true });
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        return { success: true };
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
