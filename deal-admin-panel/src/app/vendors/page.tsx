'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      const snapshot = await getDocs(collection(db, 'stores'));
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

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const vendorRef = doc(db, 'stores', id);
      await updateDoc(vendorRef, {
        isApproved: !currentStatus
      });
      // Refresh list locally
      setVendors(vendors.map(v => v.id === id ? { ...v, isApproved: !currentStatus } : v));
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4">Vendors</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all registered vendors including their store name, category, and approval status.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Store Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Approve</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">Loading...</td></tr>
                  ) : vendors.length === 0 ? (
                    <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">No vendors found</td></tr>
                  ) : (
                    vendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {vendor.name || 'Unnamed Store'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vendor.category || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vendor.isApproved ? (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => toggleApproval(vendor.id, !!vendor.isApproved)}
                            className={`flex items-center gap-1 ${vendor.isApproved ? 'text-red-600 hover:text-red-900' : 'text-blue-600 hover:text-blue-900'}`}
                          >
                            {vendor.isApproved ? (
                              <><XCircle className="w-4 h-4" /> Revoke</>
                            ) : (
                              <><CheckCircle className="w-4 h-4" /> Approve</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
