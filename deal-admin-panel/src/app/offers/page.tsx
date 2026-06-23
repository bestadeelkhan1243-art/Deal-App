'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tag, PauseCircle, PlayCircle, Trash2, Image as ImageIcon } from 'lucide-react';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    try {
      const snapshot = await getDocs(collection(db, 'offers'));
      const offerData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOffers(offerData);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(offerId: string, currentStatus: string) {
    if (confirm(`Are you sure you want to ${currentStatus === 'Paused' ? 'activate' : 'pause'} this offer?`)) {
      try {
        await updateDoc(doc(db, 'offers', offerId), {
          status: currentStatus === 'Paused' ? 'Active' : 'Paused'
        });
        fetchOffers();
      } catch (error) {
        console.error("Error toggling offer status:", error);
        alert("Failed to update offer status.");
      }
    }
  }

  async function handleDeleteOffer(offerId: string) {
    if (confirm("WARNING: Are you sure you want to permanently delete this offer? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'offers', offerId));
        fetchOffers();
      } catch (error) {
        console.error("Error deleting offer:", error);
        alert("Failed to delete offer.");
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center mb-8 border-b border-gray-200 pb-5">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Live Offers</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Monitor, pause, or remove deals published by merchants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED1C24]"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
            <Tag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No offers found</h3>
            <p className="text-gray-500 mt-1">Vendors have not published any deals yet.</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className={`col-span-1 flex flex-col rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative ${offer.status === 'Paused' ? 'opacity-75 grayscale' : ''}`}>
              <div className="h-40 bg-gray-100 relative">
                {offer.imageUrl ? (
                  <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="h-10 w-10 opacity-50" />
                  </div>
                )}
                {offer.status === 'Paused' && (
                  <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md">PAUSED</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="text-xs font-bold text-[#ED1C24] mb-2 uppercase tracking-wide">{offer.store || 'Unknown Store'}</div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{offer.title || 'Untitled Offer'}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{offer.description || 'No description provided'}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium">Discount</span>
                    <span className="text-base font-black text-gray-900">{offer.discountPrice || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs text-gray-400 font-medium">Expires</span>
                    <span className="text-sm font-bold text-gray-700">{offer.expiry || 'No expiry'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleToggleStatus(offer.id, offer.status)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white transition-colors group"
                >
                  {offer.status === 'Paused' ? (
                    <PlayCircle className="h-5 w-5 text-green-500 group-hover:text-green-600 mb-1" />
                  ) : (
                    <PauseCircle className="h-5 w-5 text-orange-400 group-hover:text-orange-500 mb-1" />
                  )}
                  <span className={`text-[10px] font-bold uppercase ${offer.status === 'Paused' ? 'text-green-600' : 'text-orange-500'}`}>
                    {offer.status === 'Paused' ? 'Activate' : 'Pause'}
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteOffer(offer.id)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-red-50 transition-colors group"
                >
                  <Trash2 className="h-5 w-5 text-gray-400 group-hover:text-[#ED1C24] mb-1" />
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#ED1C24] uppercase">Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
