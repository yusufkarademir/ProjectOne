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
      try {
        const url = new URL(photo.url);
        // The key is the pathname, but without the leading slash
        const key = url.pathname.substring(1);
        
        if (key) {
            await deleteFromR2(key);
        }
      } catch (e) {
        console.error('Error parsing URL for deletion:', photo.url, e);
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

export async function approvePhotos(photoIds: string[], eventSlug: string) {
  try {
    await prisma.photo.updateMany({
      where: {
        id: { in: photoIds },
      },
      data: {
        status: 'approved',
      },
    });

    revalidatePath(`/e/${eventSlug}/gallery`);
    revalidatePath(`/dashboard`); // Revalidate dashboard to update counts if any
    
    return { success: true, message: `${photoIds.length} fotoğraf onaylandı.` };
  } catch (error) {
    console.error('Approve error:', error);
    return { success: false, message: 'Fotoğraflar onaylanırken bir hata oluştu.' };
  }
}

import { unstable_noStore as noStore } from 'next/cache';

export async function getPendingPhotos(eventSlug: string) {
  noStore();
  try {
    const event = await prisma.event.findUnique({
      where: { slug: eventSlug },
      select: {
        photos: {
          where: { status: 'pending' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            url: true,
            type: true,
          }
        }
      }
    });

    return { success: true, photos: event?.photos || [] };
  } catch (error) {
    console.error('Get pending photos error:', error);
    return { success: false, photos: [] };
  }
}
