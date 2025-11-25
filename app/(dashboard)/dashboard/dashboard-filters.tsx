'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';

export default function DashboardFilters() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`/dashboard?${params.toString()}`);
  }, 300);

  const handleSort = (sortOrder: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sortOrder);
    replace(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Etkinliklerde ara..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none"
                onChange={(e) => handleSort(e.target.value)}
                defaultValue={searchParams.get('sort')?.toString() || 'desc'}
            >
                <option value="desc">Sırala: En Yeni</option>
                <option value="asc">Sırala: En Eski</option>
            </select>
            <Link 
                href="/events/create" 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
                <Plus size={20} />
                Yeni Etkinlik Oluştur
            </Link>
        </div>
    </div>
  );
}
