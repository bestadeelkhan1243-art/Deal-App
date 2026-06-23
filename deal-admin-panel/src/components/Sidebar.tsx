'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Store, Settings, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Vendors', href: '/vendors', icon: Store },
  { name: 'Offers', href: '/offers', icon: Tag },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-gray-100 mb-4">
        <span className="text-2xl font-black text-[#ED1C24] tracking-tight">LOOK DEAL<span className="text-gray-900 ml-1 text-base font-medium">Admin</span></span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={twMerge(
                        clsx(
                          isActive
                            ? 'bg-[#ED1C24]/10 text-[#ED1C24]'
                            : 'text-gray-600 hover:text-[#ED1C24] hover:bg-[#ED1C24]/5',
                          'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-bold transition-all duration-200'
                        )
                      )}
                    >
                      <item.icon
                        className={twMerge(
                          clsx(
                            isActive ? 'text-[#ED1C24]' : 'text-gray-400 group-hover:text-[#ED1C24]',
                            'h-6 w-6 shrink-0 transition-colors duration-200'
                          )
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
