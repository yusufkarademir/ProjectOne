'use client';

import { useState } from 'react';
import { uploadPhotos } from '../../../../lib/upload-action';
import { Upload, FileImage, FileVideo, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function UploadForm({ eventId, slug }: { eventId: string, slug: string }) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setSelectedFiles(files);
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
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileChange}
        />
        <div className="pointer-events-none space-y-3">
          <div className="flex justify-center gap-2">
            <FileImage className="text-blue-500" size={32} />
            <FileVideo className="text-purple-500" size={32} />
          </div>
          <p className="text-gray-700 font-medium">Fotoğraf veya video seçmek için tıklayın</p>
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
