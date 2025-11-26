'use client';

import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, Search, X, Loader2, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getEventPhotosForAI } from '@/app/lib/ai-actions';
import FramedImage from '../FramedImage';

interface Photo {
  id: string;
  url: string;
}

interface FaceFinderProps {
  slug: string;
  frameStyle?: 'none' | 'polaroid' | 'gradient' | 'minimal' | 'corners' | 'cinema' | 'vintage' | 'gold' | 'neon' | 'floral';
  watermarkText?: string | null;
}

export default function FaceFinder({ slug, frameStyle = 'none', watermarkText }: FaceFinderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] = useState<Float32Array | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [matches, setMatches] = useState<Photo[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  async function loadModels() {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('Yüz tanıma modelleri yüklenemedi.');
    }
  }

  async function handleReferenceUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setReferenceImage(imageUrl);
    setMatches([]);

    try {
      const img = await faceapi.fetchImage(imageUrl);
      const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error('Yüz algılanamadı. Lütfen daha net bir fotoğraf seçin.');
        setReferenceDescriptor(null);
        return;
      }

      setReferenceDescriptor(detection.descriptor);
      toast.success('Yüz algılandı! Taramaya başlayabilirsiniz.');
    } catch (error) {
      console.error(error);
      toast.error('Fotoğraf işlenirken hata oluştu.');
    }
  }

  async function startScanning() {
    if (!referenceDescriptor) return;

    setScanning(true);
    setMatches([]);
    
    try {
      // 1. Fetch all photos
      const res = await getEventPhotosForAI(slug);
      if (!res.success || !res.photos) {
        toast.error('Fotoğraflar alınamadı.');
        setScanning(false);
        return;
      }

      const photos = res.photos;
      setProgress({ current: 0, total: photos.length });

      const faceMatcher = new faceapi.FaceMatcher(referenceDescriptor, 0.6);
      const foundPhotos: Photo[] = [];

      // 2. Scan each photo
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        setProgress({ current: i + 1, total: photos.length });

        try {
          // Use proxy to avoid CORS issues
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(photo.url)}`;
          const img = await faceapi.fetchImage(proxyUrl);
          
          const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          const hasMatch = detections.some(d => {
            const bestMatch = faceMatcher.findBestMatch(d.descriptor);
            return bestMatch.label !== 'unknown';
          });

          if (hasMatch) {
            foundPhotos.push(photo);
            setMatches(prev => [...prev, photo]);
          }
        } catch (err) {
            console.warn(`Skipping photo ${photo.id} due to error`, err);
        }
      }

      if (foundPhotos.length === 0) {
        toast('Eşleşen fotoğraf bulunamadı.', { icon: '🤷‍♂️' });
      } else {
        toast.success(`${foundPhotos.length} fotoğraf bulundu!`);
      }

    } catch (error) {
      console.error(error);
      toast.error('Tarama sırasında hata oluştu.');
    } finally {
      setScanning(false);
    }
  }

  if (!modelsLoaded) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all z-40 flex items-center gap-2"
      >
        <UserCheck size={24} />
        <span className="font-medium">Beni Bul</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Search size={20} className="text-indigo-600" />
                Yapay Zeka ile Beni Bul
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Reference Upload */}
              <div className="mb-8 text-center">
                <div className="relative inline-block">
                  {referenceImage ? (
                    <img src={referenceImage} alt="Reference" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-indigo-100 mx-auto">
                      <UserCheck size={48} className="text-indigo-300" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
                    <Camera size={20} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleReferenceUpload} />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Seni bulabilmemiz için net bir selfie yükle.
                </p>
              </div>

              {/* Actions */}
              {referenceDescriptor && !scanning && (
                <button
                  onClick={startScanning}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mb-6"
                >
                  <Search size={20} />
                  Fotoğraflarımı Tara
                </button>
              )}

              {/* Progress */}
              {scanning && (
                <div className="mb-6 text-center">
                  <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Taranıyor... {progress.current} / {progress.total}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                        className="bg-indigo-600 h-full transition-all duration-300" 
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Results */}
              {matches.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {matches.map(photo => (
                    <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden border border-gray-100">
                        <FramedImage 
                            src={photo.url} 
                            alt="Match" 
                            frameStyle={frameStyle}
                            watermarkText={watermarkText}
                            className="w-full h-full" 
                            imageClassName="object-cover w-full h-full" 
                        />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
