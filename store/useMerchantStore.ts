import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

interface MerchantState {
  profile: MerchantProfile;
  updateProfile: (updates: Partial<MerchantProfile>) => void;
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
  businessEmail: ''
};

export const useMerchantStore = create<MerchantState>()(
  persist(
    (set) => ({
      profile: initialProfile,
      updateProfile: (updates) => set((state) => ({ 
        profile: { ...state.profile, ...updates } 
      })),
    }),
    {
      name: 'merchant-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
