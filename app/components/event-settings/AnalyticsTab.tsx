'use client';

import { useEffect, useState } from 'react';
import { getEventAnalytics } from '../../lib/analytics-actions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Download, Image as ImageIcon, TrendingUp, Loader2 } from 'lucide-react';
import FramedImage from '../FramedImage';

export default function AnalyticsTab({ event }: { event: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const result = await getEventAnalytics(event.id);
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [event.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Veri yüklenemedi.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Toplam Görüntülenme</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.totalViews}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Toplam Fotoğraf</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.totalPhotos}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Download size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Toplam İndirme</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.totalDownloads}</h3>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-gray-400" size={20} />
          <h3 className="font-semibold text-gray-900">Saatlik Yükleme Aktivitesi</h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
                interval={3}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
              />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="uploads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Photos */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-6">En Çok İndirilen Fotoğraflar</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.topPhotos.map((photo: any, index: number) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-gray-100">
                <FramedImage 
                    src={photo.url} 
                    alt={`Top ${index + 1}`} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="text-white font-bold flex items-center gap-1">
                        <Download size={16} />
                        {photo.downloads}
                    </span>
                </div>
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-black text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    #{index + 1}
                </div>
              </div>
            </div>
          ))}
          {data.topPhotos.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                Henüz indirilmiş fotoğraf yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
