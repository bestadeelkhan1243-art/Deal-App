'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, UserCircle } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
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

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users on the platform, including both customers and merchants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div className="flex flex-1 flex-col p-8 text-center">
                <UserCircle className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-6 text-sm font-medium text-gray-900">{user.name || 'Anonymous User'}</h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Role</dt>
                  <dd className="text-sm text-gray-500">{user.role || 'customer'}</dd>
                  <dt className="sr-only">Email</dt>
                  <dd className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {user.email || 'No email provided'}
                    </span>
                  </dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <a
                      href={`mailto:${user.email}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
