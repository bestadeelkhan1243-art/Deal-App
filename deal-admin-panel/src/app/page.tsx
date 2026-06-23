'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Store, Tag } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, vendors: 0, deals: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const storesSnapshot = await getDocs(collection(db, 'stores'));
        const offersSnapshot = await getDocs(collection(db, 'offers'));

        setStats({
          users: usersSnapshot.size,
          vendors: storesSnapshot.size,
          deals: offersSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Vendors', value: stats.vendors, icon: Store, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Deals', value: stats.deals, icon: Tag, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md ${item.bg} p-3`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">
                      {loading ? '...' : item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
