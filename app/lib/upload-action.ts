'use server';

import { prisma } from '../../lib/db';
import { uploadToR2 } from '../../lib/storage';
import { revalidatePath } from 'next/cache';

export async function uploadPhotos(prevState: any, formData: FormData) {
  const files = formData.getAll('file') as File[];
  const eventId = formData.get('eventId') as string;
  const slug = formData.get('slug') as string;

  if (!files || files.length === 0 || !eventId || !slug) {
    return { message: 'Dosya veya etkinlik bilgisi eksik.', success: false };
  }

  // Fetch event settings
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { uploadConfig: true }
  });

  const config = (event?.uploadConfig as any) || {
    maxFileSize: 50, // Default 50MB to accommodate videos
    allowedTypes: ['image', 'video'], // Allow both by default for now
    maxFilesPerUpload: 10 // Default 10 files
  };

  if (files.length > config.maxFilesPerUpload) {
      return { message: `Tek seferde en fazla ${config.maxFilesPerUpload} dosya yükleyebilirsiniz.`, success: false };
  }

  const results = [];
  const errors = [];

  for (const file of files) {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      let isValidType = false;
      if (config.allowedTypes.includes('image') && isImage) isValidType = true;
      if (config.allowedTypes.includes('video') && isVideo) isValidType = true;

      if (!isValidType) {
          errors.push(`${file.name}: Desteklenmeyen dosya türü.`);
          continue;
      }

      // Validate file size
      if (file.size > config.maxFileSize * 1024 * 1024) {
          errors.push(`${file.name}: Dosya boyutu ${config.maxFileSize}MB'dan büyük olamaz.`);
          continue;
      }

      try {
        const key = `events/${eventId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const url = await uploadToR2(file, key, file.type);

        await prisma.photo.create({
          data: {
            url,
            eventId,
            type: isVideo ? 'video' : 'image',
            mimeType: file.type,
            status: 'approved',
          },
        });
        results.push(file.name);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        errors.push(`${file.name}: Yükleme hatası.`);
      }
  }

  revalidatePath(`/e/${slug}/gallery`);
  
  if (errors.length > 0) {
      return { 
          message: `${results.length} dosya yüklendi. Hatalar: ${errors.join(', ')}`, 
          success: results.length > 0 
      };
  }

  return { message: 'Tüm dosyalar başarıyla yüklendi.', success: true };
}
