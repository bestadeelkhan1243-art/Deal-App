import { create } from 'zustand';
import { Offer } from './useOfferStore';

interface SavedState {
  savedOfferIds: string[];
  toggleSave: (offerId: string) => void;
  isSaved: (offerId: string) => boolean;
}

export const useSavedStore = create<SavedState>((set, get) => ({
  savedOfferIds: [],
  toggleSave: (offerId: string) => set((state) => {
    const isAlreadySaved = state.savedOfferIds.includes(offerId);
    return {
      savedOfferIds: isAlreadySaved 
        ? state.savedOfferIds.filter(id => id !== offerId)
        : [...state.savedOfferIds, offerId]
    };
  }),
  isSaved: (offerId: string) => get().savedOfferIds.includes(offerId),
}));
