'use client';

import { useState } from 'react';
import { updateEventDetails } from '../../lib/event-actions';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function ScheduleSettings({ event }: { event: any }) {
  const [schedule, setSchedule] = useState<any[]>(Array.isArray(event.schedule) ? event.schedule : []);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setSchedule([...schedule, { time: '', title: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateEventDetails(event.id, { schedule });
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
        <h3 className="text-lg font-medium">Etkinlik Programı</h3>
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Ekle
        </button>
      </div>

      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border group">
            <div className="w-32">
              <input
                type="time"
                value={item.time}
                onChange={(e) => updateItem(index, 'time', e.target.value)}
                className="w-full p-2 border rounded bg-white text-sm"
                placeholder="Saat"
              />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="w-full p-2 border rounded bg-white text-sm font-medium"
                placeholder="Başlık (Örn: Kokteyl)"
              />
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="w-full p-2 border rounded bg-white text-sm text-gray-600"
                placeholder="Açıklama (Opsiyonel)"
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

        {schedule.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
            Henüz program eklenmemiş.
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Kaydediliyor...' : 'Programı Kaydet'}
        </button>
      </div>
    </div>
  );
}
