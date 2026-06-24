import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from './safeStorage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth, isFirebaseInitialized } from '../config/firebase';

export interface MerchantProfile {
  firstName: string;
  lastName: string;
  birth: string;
  privatePhone: string;
  businessName: string;
  businessType: string;
  country: string;
  businessPhone: string;
  businessAddress: string;
  businessEmail: string;
  profilePic?: string;
}

interface MerchantState {
  profile: MerchantProfile;
  updateProfile: (updates: Partial<MerchantProfile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const initialProfile: MerchantProfile = {
  firstName: '',
  lastName: '',
  birth: '',
  privatePhone: '',
  businessName: '',
  businessType: '',
  country: '',
  businessPhone: '',
  businessAddress: '',
  businessEmail: '',
  profilePic: ''
};

export const useMerchantStore = create<MerchantState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      updateProfile: async (updates) => {
        const currentUser = auth?.currentUser;
        const newProfile = { ...get().profile, ...updates };
        
        set({ profile: newProfile });

        if (isFirebaseInitialized && db && currentUser) {
          try {
            await setDoc(doc(db, 'users', currentUser.uid), {
              ...newProfile,
              name: newProfile.businessName || "Unnamed Store",
              category: newProfile.businessType || "Retail",
              // We do not overwrite isApproved if it exists, use merge
            }, { merge: true });
          } catch (error) {
            console.error("Error saving merchant profile to Firestore:", error);
          }
        }
      },
      fetchProfile: async () => {
        const currentUser = auth?.currentUser;
        if (isFirebaseInitialized && db && currentUser) {
          try {
            const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
            if (docSnap.exists()) {
              set({ profile: { ...initialProfile, ...docSnap.data() } as MerchantProfile });
            }
          } catch (error) {
            console.error("Error fetching merchant profile:", error);
          }
        }
      },
    }),
    {
      name: 'merchant-profile-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
