'use server';

import { auth } from '../../auth';
import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Oturum açmanız gerekiyor.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    // Verify ownership
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) {
      return { success: false, message: 'Bu etkinliği silme yetkiniz yok.' };
    }

    // Delete all photos first (cascade delete should handle this, but being explicit)
    await prisma.photo.deleteMany({ where: { eventId } });
    
    // Delete event
    await prisma.event.delete({ where: { id: eventId } });

    revalidatePath('/dashboard');
    return { success: true, message: 'Etkinlik başarıyla silindi.' };
  } catch (error) {
    console.error('Delete event error:', error);
    return { success: false, message: 'Etkinlik silinirken bir hata oluştu.' };
  }
}

export async function duplicateEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Oturum açmanız gerekiyor.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    // Get original event
    const originalEvent = await prisma.event.findUnique({ where: { id: eventId } });
    if (!originalEvent || originalEvent.organizerId !== user.id) {
      return { success: false, message: 'Bu etkinliği kopyalama yetkiniz yok.' };
    }

    // Create duplicate with modified name and slug
    const newSlug = `${originalEvent.slug}-kopya-${Date.now()}`;
    const newEvent = await prisma.event.create({
      data: {
        name: `${originalEvent.name} (Kopya)`,
        slug: newSlug,
        date: originalEvent.date,
        themeConfig: originalEvent.themeConfig as any,
        uploadConfig: originalEvent.uploadConfig as any,
        organizerId: user.id,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Etkinlik başarıyla kopyalandı.', eventId: newEvent.id };
  } catch (error) {
    console.error('Duplicate event error:', error);
    return { success: false, message: 'Etkinlik kopyalanırken bir hata oluştu.' };
  }
}

export async function updateEventQRSettings(eventId: string, qrSettings: any) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Oturum açmanız gerekiyor.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) {
      return { success: false, message: 'Bu etkinliği düzenleme yetkiniz yok.' };
    }

    // Merge with existing themeConfig
    const currentThemeConfig = (event.themeConfig as any) || {};
    const updatedThemeConfig = {
      ...currentThemeConfig,
      qr: qrSettings,
    };

    await prisma.event.update({
      where: { id: eventId },
      data: {
        themeConfig: updatedThemeConfig,
      },
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: 'QR kod ayarları güncellendi.' };
  } catch (error) {
    console.error('Update QR settings error:', error);
    return { success: false, message: 'Ayarlar güncellenirken bir hata oluştu.' };
  }
}

export async function updateEventDetails(eventId: string, data: any) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Oturum açmanız gerekiyor.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) {
      return { success: false, message: 'Bu etkinliği düzenleme yetkiniz yok.' };
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        name: data.name,
        date: data.date ? new Date(data.date) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        location: data.location,
        description: data.description,
        schedule: data.schedule,
        announcements: data.announcements,
        themeConfig: data.themeConfig,
      },
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: 'Etkinlik bilgileri güncellendi.' };
  } catch (error) {
    console.error('Update event details error:', error);
    return { success: false, message: 'Güncelleme sırasında bir hata oluştu.' };
  }
}

import { uploadToR2 } from '../../lib/storage';

export async function uploadCoverImage(eventId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Oturum açmanız gerekiyor.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) {
      return { success: false, message: 'Bu etkinliği düzenleme yetkiniz yok.' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, message: 'Dosya seçilmedi.' };
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, message: 'Sadece resim dosyaları yüklenebilir.' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { success: false, message: 'Dosya boyutu 5MB\'dan büyük olamaz.' };
    }

    const key = `covers/${eventId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const url = await uploadToR2(file, key, file.type);

    await prisma.event.update({
      where: { id: eventId },
      data: { coverImage: url },
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: 'Kapak görseli güncellendi.', url };
  } catch (error) {
    console.error('Upload cover image error:', error);
    return { success: false, message: 'Yükleme sırasında bir hata oluştu.' };
  }
}

export async function getLatestPhotos(slug: string, after?: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!event) return { success: false, photos: [] };

    const where: any = {
      eventId: event.id,
      status: 'approved',
      type: 'image', // Only images for now
    };

    if (after) {
      where.createdAt = { gt: new Date(after) };
    }

    const photos = await prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to prevent overload
      select: {
        id: true,
        url: true,
        createdAt: true,
      }
    });

    return { success: true, photos };
  } catch (error) {
    console.error('Get latest photos error:', error);
    return { success: false, photos: [] };
  }
}
