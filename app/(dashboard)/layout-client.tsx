'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  recentEvents: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function DashboardLayoutClient({ children, user, recentEvents }: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-lg">EtkinlikQR</span>
        </div>
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
            <Menu size={24} />
        </button>
      </div>

      <Sidebar 
        user={user} 
        recentEvents={recentEvents} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'blur-sm md:blur-0' : ''} md:ml-72 p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
        </div>
      </main>
    </div>
  );
}
