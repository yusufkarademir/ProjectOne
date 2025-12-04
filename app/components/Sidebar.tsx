'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, LogOut, Settings, Image as ImageIcon, ChevronRight, Calendar, User as UserIcon, X, HelpCircle, Home } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import DeveloperCreditsModal from './ui/DeveloperCreditsModal';
import Logo from './ui/Logo';

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  recentEvents?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    title: 'Etkinliklerim',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Ayarlar',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Yardım / Rehber',
    href: '/dashboard/moderator-guide',
    icon: HelpCircle,
  },
  {
    title: 'Ana Sayfaya Dön',
    href: '/',
    icon: Home,
  },
];

export default function Sidebar({ user, recentEvents = [], isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [showCredits, setShowCredits] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Logo variant="light" />
            {/* Mobile Close Button */}
            <button 
                onClick={onClose}
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
                <X size={20} />
            </button>
        </div>

      {/* User Profile - Compact */}
      <div className="px-4 py-6 bg-slate-800/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner border border-white/10 overflow-hidden relative">
                {user?.image ? (
                    <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                    user?.name?.[0]?.toUpperCase() || <UserIcon size={16} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Kullanıcı'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto py-4 custom-scrollbar">
        {/* Main Menu */}
        <div className="space-y-1">
            <div className="px-4 mb-4">
                <Link 
                    href="/templates"
                    onClick={() => onClose?.()}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20 group"
                >
                    <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Yeni Etkinlik Oluştur</span>
                </Link>
            </div>

            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menü</p>
            {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} />
                <span className="font-medium">{item.title}</span>
                {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </Link>
            );
            })}
        </div>

        {/* Recent Events */}
        {recentEvents.length > 0 && (
            <div className="space-y-1">
                <div className="flex items-center justify-between px-4 mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Etkinlikler</p>
                    <Link href="/dashboard" className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Tümü</Link>
                </div>
                {recentEvents.map((event) => (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        onClick={() => onClose?.()}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                             pathname.includes(event.id)
                                ? 'bg-slate-800 text-white border border-slate-700'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${pathname.includes(event.id) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600 group-hover:bg-slate-500'}`} />
                        <span className="text-sm font-medium truncate">{event.name}</span>
                    </Link>
                ))}
                <Link 
                    href="/templates"
                    onClick={() => onClose?.()}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors mt-2 group"
                >
                    <PlusCircle size={14} className="group-hover:scale-110 transition-transform" />
                    Yeni Etkinlik Oluştur
                </Link>
            </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-900/20 hover:text-red-400 text-slate-400 py-3 rounded-xl transition-all font-medium border border-slate-700 hover:border-red-900/50 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Çıkış Yap
        </button>

        <button 
            onClick={() => setShowCredits(true)}
            className="w-full text-center text-[10px] text-slate-600 hover:text-slate-400 mt-4 transition-colors font-medium tracking-wider uppercase"
        >
            Developed by Yusuf KARADEMİR
        </button>
      </div>
      </aside>

      <DeveloperCreditsModal 
        isOpen={showCredits} 
        onClose={() => setShowCredits(false)} 
      />
    </>
  );
}
