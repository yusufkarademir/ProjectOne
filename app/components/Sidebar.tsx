'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, LogOut, Settings, Image as ImageIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = [
  {
    title: 'Genel Bakış',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Şablon Yöneticisi',
    href: '/templates',
    icon: ImageIcon,
  },
  {
    title: 'Ayarlar',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wider">EtkinlikQR</h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
        
        {/* Placeholder for future links */}
        <div className="pt-4 mt-4 border-t border-slate-800">
             {/* Add more items if needed */}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
