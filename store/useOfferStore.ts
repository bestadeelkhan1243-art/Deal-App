import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from './safeStorage';
import { db, isFirebaseInitialized } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { useMerchantStore } from './useMerchantStore';

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
  merchantId?: string;
}

interface OfferState {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id' | 'store' | 'distance'>) => Promise<void>;
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<void>;
  toggleOfferStatus: (id: string) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  initOffersListener: () => (() => void) | undefined;
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

export const useOfferStore = create<OfferState>((set, get) => {
  let unsubscribe: (() => void) | undefined;

  return {
    offers: [], // Start empty, fetch real data from DB

    initOffersListener: () => {
      if (unsubscribe) return unsubscribe; // Already listening

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
                couponCode: data.couponCode || '',
                merchantId: data.merchantId
              });
            });
            set({ offers: dbOffers });
          }, (error) => {
            console.error("Firestore Offers listener error:", error);
          });
        } catch (e) {
          console.warn("Failed to attach Firestore Offers listener:", e);
        }
      }
      return unsubscribe;
    },

        addOffer: async (offer) => {
          if (isFirebaseInitialized && db && auth.currentUser) {
            try {
              const merchantName = useMerchantStore.getState().profile.businessName || "Unnamed Store";
              
              const payload: any = {
                ...offer,
                store: merchantName,
                merchantId: auth.currentUser.uid,
                distance: '1 Km', // Placeholder until GPS is implemented
              };

              // Firestore strictly forbids undefined values, so we delete them
              Object.keys(payload).forEach(key => {
                if (payload[key] === undefined) {
                  delete payload[key];
                }
              });

              await addDoc(collection(db, 'offers'), payload);
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
                distance: '1 Km'
              }, ...state.offers]
            }));
          }
        },

        updateOffer: async (id, updates) => {
          if (isFirebaseInitialized && db) {
            try {
              await updateDoc(doc(db, 'offers', id), updates);
            } catch (error) {
              console.error("Error updating offer in Firestore:", error);
            }
          } else {
            // Fallback for Demo Mode
            set((state) => ({
              offers: state.offers.map(o => 
                o.id === id ? { ...o, ...updates } : o
              )
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

    initOffersListener: () => get().initOffersListener() // This is defined above
  };
});
