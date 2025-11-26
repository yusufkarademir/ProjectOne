'use server';

import { prisma } from '../../lib/db';
import { uploadToR2 } from '../../lib/storage';
import { revalidatePath } from 'next/cache';

export async function uploadPhotos(prevState: any, formData: FormData) {
  try {
    const files = formData.getAll('file') as File[];
    const eventId = formData.get('eventId') as string;
    const slug = formData.get('slug') as string;
    const missionId = formData.get('missionId') as string | null;

    console.log('Upload request received:', { eventId, slug, missionId, fileCount: files.length });

    if (!files || files.length === 0 || !eventId || !slug) {
      return { message: 'Dosya veya etkinlik bilgisi eksik.', success: false };
    }

    // Fetch event settings (fetch all fields to be safe)
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
        console.error('Event not found:', eventId);
        return { message: 'Etkinlik bulunamadı.', success: false };
    }

    const config = (event.uploadConfig as any) || {
      maxFileSize: 50, // Default 50MB
      allowedTypes: ['image', 'video'],
      maxFilesPerUpload: 10
    };

    const privacyConfig = (event.privacyConfig as any) || {};
    const requireModeration = privacyConfig.requireModeration === true;
    const initialStatus = requireModeration ? 'pending' : 'approved';

    console.log('Upload config:', { config, requireModeration, initialStatus });

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
          console.log(`Uploading file: ${file.name}, size: ${file.size}`);
          const key = `events/${eventId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
          const url = await uploadToR2(file, key, file.type);
          console.log(`Uploaded to R2: ${url}`);

          await prisma.photo.create({
            data: {
              url,
              eventId,
              type: isVideo ? 'video' : 'image',
              mimeType: file.type,
              status: initialStatus,
              missionId: missionId || null,
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

    return { message: requireModeration ? 'Dosyalar yüklendi ve onay bekliyor.' : 'Tüm dosyalar başarıyla yüklendi.', success: true };
  } catch (error) {
    console.error('Critical upload error:', error);
    return { message: 'Sunucu hatası: Yükleme işlemi başarısız oldu.', success: false };
  }
}
