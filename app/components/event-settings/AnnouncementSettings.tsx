'use client';

import { useState } from 'react';
import { updateEventDetails } from '../../lib/event-actions';
import toast from 'react-hot-toast';
import { Plus, Trash2, Megaphone } from 'lucide-react';

export default function AnnouncementSettings({ event }: { event: any }) {
  const [announcements, setAnnouncements] = useState<any[]>(Array.isArray(event.announcements) ? event.announcements : []);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setAnnouncements([...announcements, { 
      id: crypto.randomUUID(),
      title: '', 
      content: '', 
      date: new Date().toISOString() 
    }]);
  };

  const removeItem = (index: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...announcements];
    newItems[index] = { ...newItems[index], [field]: value };
    setAnnouncements(newItems);
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateEventDetails(event.id, { announcements });
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Duyurular</h3>
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Duyuru Ekle
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((item, index) => (
          <div key={item.id} className="flex gap-4 items-start bg-yellow-50/50 p-4 rounded-lg border border-yellow-100 group">
            <div className="mt-2 text-yellow-600">
                <Megaphone size={20} />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="w-full p-2 border rounded bg-white text-sm font-medium"
                placeholder="Duyuru Başlığı"
              />
              <textarea
                value={item.content}
                onChange={(e) => updateItem(index, 'content', e.target.value)}
                className="w-full p-2 border rounded bg-white text-sm text-gray-600"
                placeholder="Duyuru İçeriği"
                rows={2}
              />
            </div>
            <button
              onClick={() => removeItem(index)}
              className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
            Henüz duyuru eklenmemiş.
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Kaydediliyor...' : 'Duyuruları Kaydet'}
        </button>
      </div>
    </div>
  );
}
