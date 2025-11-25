'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadPhotos } from '../../../../lib/upload-action';
import { Upload, FileImage, FileVideo } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Yükleniyor...</span>
        </>
      ) : (
        <>
          <Upload size={20} />
          <span>Dosyaları Yükle</span>
        </>
      )}
    </button>
  );
}

export default function UploadForm({ eventId, slug }: { eventId: string, slug: string }) {
  const initialState = { message: '', success: false };
  const [state, dispatch] = useActionState(uploadPhotos, initialState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        setSelectedFiles([]);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="eventId" value={eventId} />
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
        <input 
          type="file" 
          name="file" 
          accept="image/*,video/*" 
          multiple
          required 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
      
      <SubmitButton />
    </form>
  );
}
