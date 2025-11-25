'use server';

import { prisma } from '../../lib/db';
import { uploadToR2 } from '../../lib/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function uploadPhoto(formData: FormData) {
  const file = formData.get('file') as File;
  const eventId = formData.get('eventId') as string;
  const slug = formData.get('slug') as string;

  if (!file || !eventId || !slug) {
    return { message: 'Dosya veya etkinlik bilgisi eksik.' };
  }

  // Basic validation
  if (!file.type.startsWith('image/')) {
    return { message: 'Sadece resim dosyaları yüklenebilir.' };
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return { message: 'Dosya boyutu 10MB\'dan küçük olmalıdır.' };
  }

  try {
    const key = `events/${eventId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const url = await uploadToR2(file, key, file.type);

    await prisma.photo.create({
      data: {
        url,
        eventId,
        status: 'approved', // Auto-approve for now, can change to pending later
      },
    });

    revalidatePath(`/e/${slug}/gallery`);
  } catch (error) {
    console.error('Upload error:', error);
    return { message: 'Fotoğraf yüklenirken bir hata oluştu.' };
  }

  redirect(`/e/${slug}/gallery`);
}
