'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, UserCircle, ShieldBan, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      // Only fetch customers
      const q = query(collection(db, 'users'), where('role', '==', 'customer'));
      const snapshot = await getDocs(q);
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBanUser(userId: string, currentStatus: string) {
    if (confirm(`Are you sure you want to ${currentStatus === 'banned' ? 'unban' : 'ban'} this user?`)) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          status: currentStatus === 'banned' ? 'active' : 'banned'
        });
        fetchUsers();
      } catch (error) {
        console.error("Error banning user:", error);
        alert("Failed to update user status.");
      }
    }
  }

  async function handleDeleteUser(userId: string) {
    if (confirm("WARNING: Are you sure you want to permanently delete this user? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center mb-8 border-b border-gray-200 pb-5">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Shoppers</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Manage all registered customers on the Look Deal platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED1C24]"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
            <UserCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No shoppers found</h3>
            <p className="text-gray-500 mt-1">There are no customers registered yet.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className={`col-span-1 flex flex-col rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative ${user.status === 'banned' ? 'opacity-75 grayscale' : ''}`}>
              {user.status === 'banned' && (
                <div className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">BANNED</div>
              )}
              <div className="flex flex-1 flex-col p-8 items-center text-center">
                <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <UserCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{user.name || 'Anonymous User'}</h3>
                <p className="text-sm text-gray-500 mt-1">{user.email || 'No email provided'}</p>
                <div className="mt-4 inline-flex items-center rounded-full bg-[#ED1C24]/10 px-3 py-1 text-xs font-bold text-[#ED1C24]">
                  Shopper
                </div>
              </div>
              <div className="bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-3 gap-2">
                <a
                  href={`mailto:${user.email}`}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white transition-colors group"
                >
                  <Mail className="h-5 w-5 text-gray-400 group-hover:text-gray-600 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Email</span>
                </a>
                <button
                  onClick={() => handleBanUser(user.id, user.status)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white transition-colors group"
                >
                  <ShieldBan className={`h-5 w-5 mb-1 ${user.status === 'banned' ? 'text-green-500' : 'text-orange-400 group-hover:text-orange-500'}`} />
                  <span className={`text-[10px] font-bold uppercase ${user.status === 'banned' ? 'text-green-600' : 'text-orange-500'}`}>
                    {user.status === 'banned' ? 'Unban' : 'Ban'}
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
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
