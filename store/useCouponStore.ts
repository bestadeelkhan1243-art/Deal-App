import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ClaimedCoupon {
  id: string; // Unique claim ID
  offerId: string;
  title: string;
  store: string;
  code: string;
  expiry: string;
  claimedAt: string;
  status: 'Active' | 'Redeemed' | 'Cancelled';
  customerName?: string;
}

interface CouponState {
  claimedCoupons: ClaimedCoupon[];
  claimCoupon: (coupon: Omit<ClaimedCoupon, 'id' | 'claimedAt' | 'status'>) => void;
  hasClaimedOffer: (offerId: string) => boolean;
  redeemCoupon: (code: string) => boolean;
  redeemById: (id: string) => void;
  cancelCoupon: (id: string) => void;
  nudgeCustomer: (id: string) => void;
}

const initialCoupons: ClaimedCoupon[] = [
  {
    id: 'c1',
    offerId: 'mock-1',
    title: '50% Off Artisan Pizza',
    store: "Luigi's Pizzeria",
    code: "LOOK-PIZZA-50",
    expiry: 'Expires tomorrow',
    claimedAt: new Date().toISOString(),
    status: 'Active',
    customerName: 'Alex Carter'
  },
  {
    id: 'c2',
    offerId: 'mock-2',
    title: 'Buy 1 Get 1 Free Latte',
    store: "Brew & Co. Coffee",
    code: "LOOK-COFFEE-BOGO",
    expiry: 'Expires in 2 hours',
    claimedAt: new Date().toISOString(),
    status: 'Active',
    customerName: 'Sam Taylor'
  }
];

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      claimedCoupons: initialCoupons,
      
      claimCoupon: (coupon) => {
        set((state) => ({
          claimedCoupons: [
            {
              ...coupon,
              id: Math.random().toString(36).substring(2, 9),
              claimedAt: new Date().toISOString(),
              status: 'Active',
              customerName: ['Alex Carter', 'Sam Taylor', 'Jordan Lee', 'Casey Smith'][Math.floor(Math.random() * 4)] // Auto-generate mock name for demo
            },
            ...state.claimedCoupons
          ]
        }));
      },

      hasClaimedOffer: (offerId: string) => {
        return get().claimedCoupons.some(c => c.offerId === offerId);
      },

      redeemCoupon: (code: string) => {
        const coupons = get().claimedCoupons;
        const targetIndex = coupons.findIndex(c => c.code === code && c.status === 'Active');
        
        if (targetIndex === -1) {
          return false; // Not found or already redeemed
        }

        const updated = [...coupons];
        updated[targetIndex] = { ...updated[targetIndex], status: 'Redeemed' };
        
        set({ claimedCoupons: updated });
        return true;
      },

      redeemById: (id: string) => {
        set((state) => ({
          claimedCoupons: state.claimedCoupons.map(c => 
            c.id === id ? { ...c, status: 'Redeemed' } : c
          )
        }));
      },

      cancelCoupon: (id: string) => {
        set((state) => ({
          claimedCoupons: state.claimedCoupons.map(c => 
            c.id === id ? { ...c, status: 'Cancelled' } : c
          )
        }));
      },

      nudgeCustomer: (id: string) => {
        // In a real app, this would trigger a push notification via Firebase Cloud Messaging
        console.log(`Nudge notification sent to customer for claim ID: ${id}`);
      }
    }),
    {
      name: 'coupon-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
