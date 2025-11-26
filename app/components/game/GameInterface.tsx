'use client';

import { useState, useEffect } from 'react';
import { Camera, Check, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { uploadPhotos } from '@/app/lib/upload-action';

interface Mission {
  id: string;
  text: string;
  order: number;
}

export default function GameInterface({ event, missions }: { event: any, missions: Mission[] }) {
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    // Load progress from local storage
    const saved = localStorage.getItem(`game_progress_${event.id}`);
    if (saved) {
      setCompletedMissions(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, [event.id]);

  useEffect(() => {
    if (!isLoaded) return;
    
    // Save progress
    localStorage.setItem(`game_progress_${event.id}`, JSON.stringify(completedMissions));
    
    // Check for completion
    if (missions.length > 0 && completedMissions.length === missions.length) {
      fireConfetti();
    }
  }, [completedMissions, event.id, missions.length, isLoaded]);

  function fireConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedMission) return;

    setUploadingId(selectedMission.id);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', event.id);
    formData.append('slug', event.slug);
    formData.append('missionId', selectedMission.id);

    try {
      const res = await uploadPhotos(null, formData);
      if (res.success) {
        toast.success('Harika! Fotoğraf yüklendi.');
        if (!completedMissions.includes(selectedMission.id)) {
            setCompletedMissions(prev => [...prev, selectedMission.id]);
        }
        setSelectedMission(null); // Close modal
      } else {
        toast.error(res.message || 'Yükleme başarısız.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Bir hata oluştu.');
    } finally {
      setUploadingId(null);
    }
  }

  const progress = Math.round((completedMissions.length / missions.length) * 100) || 0;

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 sticky top-20 z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-gray-600">İlerleme Durumu</span>
          <span className="text-lg font-bold text-blue-600">{completedMissions.length} / {missions.length}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
            <div className="mt-2 text-center text-green-600 font-medium text-sm animate-bounce">
                🎉 Tebrikler! Tüm görevleri tamamladın!
            </div>
        )}
      </div>

      {/* Mission List */}
      <div className="space-y-4">
        {missions.map((mission) => {
          const isCompleted = completedMissions.includes(mission.id);
          return (
            <div 
              key={mission.id}
              onClick={() => !isCompleted && setSelectedMission(mission)}
              className={`
                relative overflow-hidden rounded-xl border-2 transition-all duration-200
                ${isCompleted 
                    ? 'bg-green-50 border-green-200 cursor-default' 
                    : 'bg-white border-gray-100 hover:border-blue-200 cursor-pointer shadow-sm hover:shadow-md'
                }
              `}
            >
              <div className="p-4 flex items-center gap-4">
                <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}
                `}>
                    {isCompleted ? <Check size={24} /> : <Camera size={24} />}
                </div>
                <div className="flex-1">
                    <h3 className={`font-medium ${isCompleted ? 'text-green-900 line-through opacity-70' : 'text-gray-900'}`}>
                        {mission.text}
                    </h3>
                    {!isCompleted && (
                        <p className="text-xs text-blue-500 mt-1 font-medium">Fotoğraf Yükle &rarr;</p>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-900">Görevi Tamamla</h3>
                <button 
                    onClick={() => setSelectedMission(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedMission.text}</h4>
                <p className="text-sm text-gray-500 mb-6">
                    Bu görev için bir fotoğraf çek veya galerinden seç.
                </p>

                <label className={`
                    block w-full py-3 px-4 rounded-xl font-medium text-white text-center cursor-pointer transition-colors
                    ${uploadingId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
                `}>
                    {uploadingId ? 'Yükleniyor...' : 'Fotoğraf Seç & Yükle'}
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={!!uploadingId}
                    />
                </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
