'use client';

import { useState, useEffect } from 'react';
import { uploadPhotos } from '../../../../lib/upload-action';
import { Upload, FileImage, FileVideo, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import * as nsfwjs from 'nsfwjs';

export default function UploadForm({ eventId, slug, isAiModerationEnabled = true }: { eventId: string, slug: string, isAiModerationEnabled?: boolean }) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [model, setModel] = useState<nsfwjs.NSFWJS | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  // Load NSFW model
  // Load NSFW model
  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      // If moderation is disabled, stop loading
      if (isAiModerationEnabled === false) {
        if (isMounted) setIsModelLoading(false);
        return;
      }

      try {
        // Load from local public directory to avoid CDN/CORS issues
        // We need to make sure the model files are in public/models/nsfwjs/
        // If not, we fallback to CDN but with explicit error handling
        
        // Try local first
        try {
            const _model = await nsfwjs.load('/models/nsfwjs/');
            if (isMounted) {
                setModel(_model);
                console.log('NSFW Model loaded from local');
                setIsModelLoading(false);
                return;
            }
        } catch (localErr) {
            console.warn('Local model load failed, trying CDN...', localErr);
        }

        // Fallback to CDN
        const _model = await nsfwjs.load();
        if (isMounted) {
            setModel(_model);
            console.log('NSFW Model loaded from CDN');
        }
      } catch (err) {
        console.error('Failed to load NSFW model', err);
        if (isMounted) toast.error('AI Modeli yüklenemedi, manuel moderasyon aktif.');
      } finally {
        if (isMounted) setIsModelLoading(false);
      }
    };

    loadModel();

    return () => {
        isMounted = false;
    };
  }, [isAiModerationEnabled]);

  const checkContent = async (file: File): Promise<boolean> => {
    // If moderation is disabled, allow everything
    if (isAiModerationEnabled === false) return true;
    
    // If model failed to load but moderation is enabled, we should probably allow upload 
    // but warn user or maybe block? For now, let's allow but log error.
    // Ideally we should have a fallback server-side check or block upload if client-side fails.
    if (!model) {
        console.warn('AI Model not loaded, skipping check');
        return true; 
    }

    if (!file.type.startsWith('image/')) return true;

    try {
      const img = document.createElement('img');
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const predictions = await model.classify(img);
      URL.revokeObjectURL(objectUrl);

      // Stricter checks
      const isUnsafe = predictions.some(p => 
        (p.className === 'Porn' && p.probability > 0.4) ||     // Lower threshold for Porn
        (p.className === 'Hentai' && p.probability > 0.5) ||   // Standard for Hentai
        (p.className === 'Sexy' && p.probability > 0.8)        // Block very explicit/bikini content
      );

      if (isUnsafe) {
        console.warn(`Blocked ${file.name} due to NSFW content`, predictions);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking content:', error);
      return true; // Allow on error to not block user
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      if (files.length > 10) {
        toast.error('En fazla 10 dosya seçebilirsiniz.');
        return;
      }

      const invalidFiles = files.filter(file => file.size > 500 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        toast.error('Bazı dosyalar 500MB sınırını aşıyor.');
        return;
      }

      // AI Content Check
      if (model) {
        setIsChecking(true);
        const safeFiles: File[] = [];
        let blockedCount = 0;

        for (const file of files) {
            const isSafe = await checkContent(file);
            if (isSafe) {
                safeFiles.push(file);
            } else {
                blockedCount++;
            }
        }

        setIsChecking(false);

        if (blockedCount > 0) {
            toast.error(`${blockedCount} dosya uygunsuz içerik nedeniyle engellendi.`);
        }

        if (safeFiles.length === 0 && files.length > 0) {
            e.target.value = ''; // Reset input
            return;
        }

        setSelectedFiles(safeFiles);
      } else {
        setSelectedFiles(files);
      }

      // Reset states
      setResults({ success: 0, failed: 0 });
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setProgress({ current: 0, total: selectedFiles.length });
    let successCount = 0;
    let failCount = 0;

    // Upload files sequentially to avoid body size limits and timeouts
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventId', eventId);
        formData.append('slug', slug);

        try {
            // Call server action directly
            const result = await uploadPhotos(null, formData);
            
            if (result.success) {
                successCount++;
            } else {
                failCount++;
                console.error(`Failed to upload ${file.name}:`, result.message);
                toast.error(`${file.name}: ${result.message}`);
            }
        } catch (error) {
            failCount++;
            console.error(`Error uploading ${file.name}:`, error);
            toast.error(`${file.name}: Yükleme hatası`);
        }

        setProgress({ current: i + 1, total: selectedFiles.length });
    }

    setIsUploading(false);
    setResults({ success: successCount, failed: failCount });
    setSelectedFiles([]);

    if (successCount > 0) {
        if (failCount === 0) {
            toast.success('Tüm dosyalar başarıyla yüklendi!');
        } else {
            toast.success(`${successCount} dosya yüklendi, ${failCount} dosya başarısız.`);
        }
        router.refresh();
    } else if (failCount > 0) {
        toast.error('Yükleme başarısız oldu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
        <input 
          type="file" 
          name="file" 
          accept="image/*,video/*" 
          multiple
          required 
          disabled={isUploading || isChecking || isModelLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileChange}
        />
        <div className="pointer-events-none space-y-3">
          <div className="flex justify-center gap-2">
            {isChecking || isModelLoading ? (
                <Loader2 className="text-blue-500 animate-spin" size={32} />
            ) : (
                <>
                    <FileImage className="text-blue-500" size={32} />
                    <FileVideo className="text-purple-500" size={32} />
                </>
            )}
          </div>
          <p className="text-gray-700 font-medium">
            {isModelLoading ? 'AI Modeli Yükleniyor...' : 
             isChecking ? 'İçerik kontrol ediliyor...' : 
             'Fotoğraf veya video seçmek için tıklayın'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, MOV (Tek seferde 10 dosyaya kadar)</p>
          
          {selectedFiles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {selectedFiles.length} dosya seçildi:
              </p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="text-xs text-gray-600 flex items-center justify-between bg-white px-3 py-1.5 rounded">
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-gray-400 ml-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isUploading || selectedFiles.length === 0}
        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Yükleniyor ({progress.current}/{progress.total})...</span>
          </>
        ) : (
          <>
            <Upload size={20} />
            <span>Dosyaları Yükle</span>
          </>
        )}
      </button>

      {results.success > 0 && !isUploading && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={20} />
              <div>
                  <p className="font-medium">Yükleme Tamamlandı</p>
                  <p className="text-sm">{results.success} dosya başarıyla yüklendi.</p>
              </div>
          </div>
      )}
    </form>
  );
}
