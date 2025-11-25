'use client';

import { useState } from 'react';
import { uploadPhoto } from '../../../../lib/upload-action';

export default function UploadForm({ eventId, slug }: { eventId: string, slug: string }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  return (
     <form action={async (formData) => {
           setUploading(true);
           setMessage('');
           const result = await uploadPhoto(formData);
           if (result?.message) {
             setMessage(result.message);
             setUploading(false);
           }
         }}>
           <input type="hidden" name="slug" value={slug} />
           <input type="hidden" name="eventId" value={eventId} />
           <input type="file" name="file" accept="image/*" required className="block w-full text-sm text-gray-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100
             mb-4
           " />
           
           <button 
             type="submit" 
             disabled={uploading}
             className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
           >
             {uploading ? 'Yükleniyor...' : 'Fotoğrafı Gönder'}
           </button>
           {message && <p className="mt-4 text-red-500">{message}</p>}
         </form>
  );
}
