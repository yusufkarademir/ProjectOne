'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { Plus, Trash2, Edit2, Save, X, Camera, Trophy, GripVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { toggleGameStatus, createMission, updateMission, deleteMission, getMissions } from '@/app/lib/mission-actions';

interface Mission {
  id: string;
  text: string;
  order: number;
  _count?: {
    photos: number;
  };
}

export default function PhotoHuntSettings({ event }: { event: any }) {
  const [isEnabled, setIsEnabled] = useState(event.isGameEnabled);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMissionText, setNewMissionText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadMissions();
  }, [event.id]);

  async function loadMissions() {
    const res = await getMissions(event.id);
    if (res.success && res.missions) {
      setMissions(res.missions);
    }
    setLoading(false);
  }

  async function handleToggle(checked: boolean) {
    // Optimistic update
    setIsEnabled(checked);
    const res = await toggleGameStatus(event.id, checked);
    if (!res.success) {
      setIsEnabled(!checked); // Revert on error
      toast.error(res.message || 'Bir hata oluştu');
    } else {
      toast.success(res.message || 'İşlem başarılı');
    }
  }

  async function handleAddMission(e: React.FormEvent) {
    e.preventDefault();
    if (!newMissionText.trim()) return;

    const tempId = 'temp-' + Date.now();
    const tempMission = { id: tempId, text: newMissionText, order: missions.length };
    
    // Optimistic add
    setMissions([...missions, tempMission]);
    setNewMissionText('');

    const res = await createMission(event.id, tempMission.text);
    if (res.success && res.mission) {
      // Replace temp with real
      setMissions(prev => prev.map(m => m.id === tempId ? res.mission! : m));
      toast.success('Görev eklendi');
    } else {
      setMissions(prev => prev.filter(m => m.id !== tempId));
      toast.error(res.message || 'Bir hata oluştu');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu görevi silmek istediğinize emin misiniz?')) return;

    const oldMissions = [...missions];
    setMissions(missions.filter(m => m.id !== id));

    const res = await deleteMission(id);
    if (!res.success) {
      setMissions(oldMissions);
      toast.error(res.message || 'Bir hata oluştu');
    } else {
      toast.success('Görev silindi');
    }
  }

  async function startEditing(mission: Mission) {
    setEditingId(mission.id);
    setEditText(mission.text);
  }

  async function saveEdit() {
    if (!editingId || !editText.trim()) return;

    const oldMissions = [...missions];
    setMissions(missions.map(m => m.id === editingId ? { ...m, text: editText } : m));
    setEditingId(null);

    const res = await updateMission(editingId, editText);
    if (!res.success) {
      setMissions(oldMissions);
      toast.error(res.message || 'Bir hata oluştu');
    } else {
      toast.success('Görev güncellendi');
    }
  }

  return (
    <div className="space-y-8">
      {/* Enable/Disable Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Fotoğraf Avı Özelliği</h3>
            <p className="text-sm text-gray-500">
              Etkinleştirildiğinde misafirleriniz için eğlenceli fotoğraf görevleri açılır.
            </p>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onChange={handleToggle}
          className={`${
            isEnabled ? 'bg-green-500' : 'bg-gray-200'
          } relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {isEnabled && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Görev Listesi</h3>
            <span className="text-sm text-gray-500">{missions.length} Görev</span>
          </div>

          {/* Add Mission Form */}
          <form onSubmit={handleAddMission} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newMissionText}
              onChange={(e) => setNewMissionText(e.target.value)}
              placeholder="Yeni görev ekle (Örn: Gelinle Selfie)"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMissionText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={18} />
              Ekle
            </button>
          </form>

          {/* Mission List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
            ) : missions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">Henüz hiç görev eklenmemiş.</p>
                <p className="text-sm text-gray-400">Yukarıdan yeni bir görev ekleyerek başlayın.</p>
              </div>
            ) : (
              missions.map((mission) => (
                <div
                  key={mission.id}
                  className="group flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
                >
                  <div className="cursor-move text-gray-300 hover:text-gray-500">
                    <GripVertical size={20} />
                  </div>
                  
                  <div className="flex-1">
                    {editingId === mission.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{mission.text}</span>
                        {mission._count?.photos ? (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                {mission._count.photos} Fotoğraf
                            </span>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {editingId !== mission.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(mission)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(mission.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
