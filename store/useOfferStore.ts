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
  imageUrls?: string[];
  status: 'Active' | 'Paused';
  startDate?: string;
  endDate?: string;
  claimedCount?: number;
  store: string;
  distance: string;
  requiresCoupon?: boolean;
  couponCode?: string;
  merchantId?: string;
  category?: string;
}

interface OfferState {
  offers: Offer[];
  isLoading: boolean;
  addOffer: (offer: Omit<Offer, 'id' | 'store' | 'distance'>) => Promise<boolean>;
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<void>;
  toggleOfferStatus: (id: string) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  claimOffer: (offerId: string) => Promise<{ success: boolean; message: string }>;
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
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    claimedCount: 15,
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
    startDate: '2026-06-01',
    endDate: '2026-06-02',
    claimedCount: 40,
    store: "Brew & Co. Coffee",
    distance: '0.5 km',
    requiresCoupon: false
  },
];

export const useOfferStore = create<OfferState>((set, get) => {
  let unsubscribe: (() => void) | undefined;

  return {
    offers: [], // Start empty, fetch real data from DB
    isLoading: true,

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
                startDate: data.startDate || '',
                endDate: data.endDate || '',
                claimedCount: data.claimedCount || 0,
                store: data.store || 'Local Store',
                distance: data.distance || '0.1 km',
                requiresCoupon: data.requiresCoupon || false,
                couponCode: data.couponCode || '',
                merchantId: data.merchantId,
                category: data.category || 'Other',
                imageUrl: data.imageUrl || '',
                imageUrls: data.imageUrls || []
              });
            });
            set({ offers: dbOffers, isLoading: false });
          }, (error) => {
            console.error("Firestore Offers listener error:", error);
          });
        } catch (e) {
          console.warn("Failed to attach Firestore Offers listener:", e);
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
      return unsubscribe;
    },

        addOffer: async (offer) => {
          if (isFirebaseInitialized && db && auth.currentUser) {
            try {
              const merchantName = useMerchantStore.getState().profile.businessName || "Unnamed Store";
              const merchantCategory = useMerchantStore.getState().profile.businessType || "Other";
              
              const payload: any = {
                ...offer,
                store: merchantName,
                merchantId: auth.currentUser.uid,
                category: merchantCategory,
                distance: '1 Km', // Placeholder until GPS is implemented
              };

              // Firestore strictly forbids undefined values, so we delete them
              Object.keys(payload).forEach(key => {
                if (payload[key] === undefined) {
                  delete payload[key];
                }
              });

              await addDoc(collection(db, 'offers'), payload);
              return true;
            } catch (error) {
              console.error("Error adding offer to Firestore:", error);
              return false;
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
            return true;
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

    claimOffer: async (offerId) => {
      if (!isFirebaseInitialized || !db || !auth.currentUser) {
        return { success: false, message: "You must be logged in to claim offers." };
      }

      try {
        const customerId = auth.currentUser.uid;
        
        // Check if already claimed
        const claimsRef = collection(db, 'claims');
        const q = query(claimsRef, where('offerId', '==', offerId), where('customerId', '==', customerId));
        const { getDocs } = await import('firebase/firestore');
        const existingClaims = await getDocs(q);
        
        if (!existingClaims.empty) {
          return { success: false, message: "You have already claimed this offer!" };
        }

        // Get the current offer to check limits
        const { getDoc, increment } = await import('firebase/firestore');
        const offerRef = doc(db, 'offers', offerId);
        const offerSnap = await getDoc(offerRef);
        
        if (!offerSnap.exists()) {
          return { success: false, message: "Offer not found." };
        }

        const offerData = offerSnap.data();
        
        // Check dates
        const now = new Date().toISOString();
        if (offerData.endDate && now > offerData.endDate) {
          return { success: false, message: "This offer has expired." };
        }

        // Check limits
        const currentClaimCount = offerData.claimedCount || 0;
        if (offerData.limitType === 'Limited' && offerData.limitCount && currentClaimCount >= offerData.limitCount) {
          return { success: false, message: "This offer is sold out!" };
        }

        // Record the claim
        await addDoc(claimsRef, {
          offerId,
          customerId,
          claimedAt: new Date().toISOString(),
          status: 'Active'
        });

        // Increment the claimed count on the offer
        await updateDoc(offerRef, {
          claimedCount: increment(1)
        });

        return { success: true, message: "Offer claimed successfully!" };
      } catch (error) {
        console.error("Error claiming offer:", error);
        return { success: false, message: "A network error occurred while claiming." };
      }
    }
  };
});
