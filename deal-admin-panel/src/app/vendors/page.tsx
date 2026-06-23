'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, Store, ShieldBan, Trash2, MapPin } from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      // Only fetch merchants
      const q = query(collection(db, 'users'), where('role', '==', 'merchant'));
      const snapshot = await getDocs(q);
      const vendorData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVendors(vendorData);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBanVendor(userId: string, currentStatus: string) {
    if (confirm(`Are you sure you want to ${currentStatus === 'banned' ? 'unban' : 'ban'} this vendor? They will not be able to log in.`)) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          status: currentStatus === 'banned' ? 'active' : 'banned'
        });
        fetchVendors();
      } catch (error) {
        console.error("Error banning vendor:", error);
        alert("Failed to update vendor status.");
      }
    }
  }

  async function handleDeleteVendor(userId: string) {
    if (confirm("WARNING: Are you sure you want to permanently delete this vendor? All their data will be lost.")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchVendors();
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Failed to delete vendor.");
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center mb-8 border-b border-gray-200 pb-5">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Merchants & Vendors</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Manage business accounts that publish deals on Look Deal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED1C24]"></div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
            <Store className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No merchants found</h3>
            <p className="text-gray-500 mt-1">There are no approved businesses yet.</p>
          </div>
        ) : (
          vendors.map((vendor) => (
            <div key={vendor.id} className={`col-span-1 flex flex-col rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative ${vendor.status === 'banned' ? 'opacity-75 grayscale' : ''}`}>
              {vendor.status === 'banned' && (
                <div className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">BANNED</div>
              )}
              <div className="flex flex-1 flex-col p-8 items-center text-center">
                <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <Store className="h-10 w-10 text-[#ED1C24]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{vendor.businessName || vendor.name || 'Unnamed Store'}</h3>
                
                {vendor.country && (
                  <div className="flex items-center text-xs text-gray-500 mt-2 font-medium">
                    <MapPin className="h-3 w-3 mr-1" />
                    {vendor.country}
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-2">{vendor.email || 'No email provided'}</p>
                
                <div className="mt-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  {vendor.businessType || 'Retail Partner'}
                </div>
              </div>
              <div className="bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-3 gap-2">
                <a
                  href={`mailto:${vendor.email}`}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white transition-colors group"
                >
                  <Mail className="h-5 w-5 text-gray-400 group-hover:text-gray-600 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Email</span>
                </a>
                <button
                  onClick={() => handleBanVendor(vendor.id, vendor.status)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white transition-colors group"
                >
                  <ShieldBan className={`h-5 w-5 mb-1 ${vendor.status === 'banned' ? 'text-green-500' : 'text-orange-400 group-hover:text-orange-500'}`} />
                  <span className={`text-[10px] font-bold uppercase ${vendor.status === 'banned' ? 'text-green-600' : 'text-orange-500'}`}>
                    {vendor.status === 'banned' ? 'Unban' : 'Ban'}
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
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
