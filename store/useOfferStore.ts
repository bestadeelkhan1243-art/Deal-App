import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, isFirebaseInitialized } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: string;
  discountPrice: string;
  discountType?: 'Percentage' | 'Price';
  discountValue?: string;
  limitType?: 'Unlimited' | 'Limited';
  limitCount?: number;
  branchType?: 'All Branches' | 'Specific Location';
  specificBranchName?: string;
  imageUrl?: string;
  status: 'Active' | 'Paused';
  expiry: string;
  store: string;
  distance: string;
  requiresCoupon?: boolean;
  couponCode?: string;
}

interface OfferState {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id' | 'store' | 'distance'>) => Promise<void>;
  toggleOfferStatus: (id: string) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  subscribeToOffers: () => (() => void) | undefined;
}

const initialMockOffers: Offer[] = [
  { 
    id: '1', 
    title: '50% Off Artisan Pizza', 
    description: 'Hand-tossed wood-fired pizza with fresh mozzarella and basil.',
    originalPrice: '$20',
    discountPrice: '$10',
    status: 'Active', 
    expiry: 'Tomorrow',
    store: "Luigi's Pizzeria",
    distance: '1.2 km',
    requiresCoupon: true,
    couponCode: 'LOOK-PIZZA-50'
  },
  { 
    id: '2', 
    title: 'Buy 1 Get 1 Free Latte', 
    description: 'Any medium or large espresso beverage.',
    originalPrice: '$6',
    discountPrice: '$3',
    status: 'Active', 
    expiry: 'In 2 hours',
    store: "Brew & Co. Coffee",
    distance: '0.5 km',
    requiresCoupon: false
  },
];

export const useOfferStore = create<OfferState>()(
  persist(
    (set, get) => {
      let unsubscribe: (() => void) | undefined;
      
      if (isFirebaseInitialized && db) {
        try {
          const q = query(collection(db, 'offers'));
          unsubscribe = onSnapshot(q, (snapshot) => {
            const dbOffers: Offer[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              dbOffers.push({
                id: doc.id,
                title: data.title || '',
                description: data.description || '',
                originalPrice: data.originalPrice || '',
                discountPrice: data.discountPrice || '',
                status: data.status || 'Active',
                expiry: data.expiry || 'No Expiry',
                store: data.store || 'Local Store',
                distance: data.distance || '0.1 km',
                requiresCoupon: data.requiresCoupon || false,
                couponCode: data.couponCode || ''
              });
            });
            set({ offers: dbOffers.length > 0 ? dbOffers : initialMockOffers });
          });
        } catch (e) {
          console.warn("Failed to attach Firestore listeners:", e);
        }
      }

      return {
        offers: initialMockOffers,

        addOffer: async (offer) => {
          if (isFirebaseInitialized && db) {
            try {
              await addDoc(collection(db, 'offers'), {
                ...offer,
                store: 'My Store', // Mock merchant store name
                distance: '0.1 km'
              });
            } catch (error) {
              console.error("Error adding offer to Firestore:", error);
            }
          } else {
            // Fallback for Demo Mode
            set((state) => ({
              offers: [{ 
                ...offer, 
                id: Math.random().toString(36).substring(2, 9),
                store: 'My Store',
                distance: '0.1 km'
              }, ...state.offers]
            }));
          }
        },

        toggleOfferStatus: async (id) => {
          const offerToToggle = get().offers.find(o => o.id === id);
          if (!offerToToggle) return;

          if (isFirebaseInitialized && db) {
            try {
              const newStatus = offerToToggle.status === 'Active' ? 'Paused' : 'Active';
              await updateDoc(doc(db, 'offers', id), {
                status: newStatus
              });
            } catch (error) {
              console.error("Error updating offer status in Firestore:", error);
            }
          } else {
            // Fallback for Demo Mode
            set((state) => ({
              offers: state.offers.map(o => 
                o.id === id ? { ...o, status: o.status === 'Active' ? 'Paused' : 'Active' } : o
              )
            }));
          }
        },

        deleteOffer: async (id) => {
          if (isFirebaseInitialized && db) {
            try {
              await deleteDoc(doc(db, 'offers', id));
            } catch (error) {
              console.error("Error deleting offer from Firestore:", error);
            }
          } else {
            // Fallback for Demo Mode
            set((state) => ({
              offers: state.offers.filter(o => o.id !== id)
            }));
          }
        },

        subscribeToOffers: () => unsubscribe
      };
    },
    {
      name: 'offer-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ offers: state.offers }), // Persist only offers
    }
  )
);
