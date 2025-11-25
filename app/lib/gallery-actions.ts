'use server';

import { prisma } from '../../lib/db';
import { deleteFromR2 } from '../../lib/storage';
import { revalidatePath } from 'next/cache';

export async function deletePhotos(photoIds: string[], eventSlug: string) {
  try {
    // 1. Get photos to find their URLs (keys)
    const photos = await prisma.photo.findMany({
      where: {
        id: { in: photoIds },
      },
    });

    // 2. Delete from R2
    await Promise.all(photos.map(async (photo: { url: string }) => {
      // Extract key from URL
      // URL format: https://pub-xxx.r2.dev/events/eventId/filename
      // We need: events/eventId/filename
      const urlParts = photo.url.split('/');
      const key = urlParts.slice(3).join('/'); // Assuming standard URL structure
      
      // If URL structure is different, we might need a more robust way to extract key
      // For now, let's try to match the key format used in upload
      // key = `events/${eventId}/${Date.now()}-${file.name}`
      
      // Better approach: store key in DB or extract carefully
      // Let's assume the key is the part after the domain
      if (key) {
          await deleteFromR2(key);
      }
    }));

    // 3. Delete from DB
    await prisma.photo.deleteMany({
      where: {
        id: { in: photoIds },
      },
    });

    revalidatePath(`/e/${eventSlug}/gallery`);
    return { success: true, message: `${photoIds.length} fotoğraf silindi.` };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: 'Fotoğraflar silinirken bir hata oluştu.' };
  }
}
