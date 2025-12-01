'use server';
// Force rebuild

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

    // 1. Get all photos to delete from R2
    const photos = await prisma.photo.findMany({
      where: { eventId },
      select: { url: true }
    });

    // 2. Delete photos from R2
    const { deleteFromR2 } = await import('../../lib/storage');
    const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

    for (const photo of photos) {
      if (photo.url && photo.url.startsWith(R2_PUBLIC_URL)) {
        const key = photo.url.replace(`${R2_PUBLIC_URL}/`, '');
        try {
          await deleteFromR2(key);
        } catch (e) {
          console.error(`Failed to delete photo from R2: ${key}`, e);
        }
      }
    }

    // 3. Delete cover image from R2 if exists
    if (event.coverImage && event.coverImage.startsWith(R2_PUBLIC_URL)) {
      const key = event.coverImage.replace(`${R2_PUBLIC_URL}/`, '');
      try {
        await deleteFromR2(key);
      } catch (e) {
        console.error(`Failed to delete cover image from R2: ${key}`, e);
      }
    }

    // 4. Delete all photos from DB (cascade delete should handle this, but being explicit is safer)
    await prisma.photo.deleteMany({ where: { eventId } });
    
    // 5. Delete event
    await prisma.event.delete({ where: { id: eventId } });

    revalidatePath('/dashboard');
    return { success: true, message: 'Etkinlik ve tüm dosyalar başarıyla silindi.' };
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
        mission: {
          select: {
            text: true
          }
        }
      }
    });

    return { success: true, photos };
  } catch (error) {
    console.error('Get latest photos error:', error);
    return { success: false, photos: [] };
  }
}

export async function updateEventPrivacySettings(eventId: string, privacyConfig: any) {
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

    // Extract top-level fields
    const { isAiModerationEnabled, isWatermarkEnabled, isPasswordProtected, guestPin, ...restPrivacyConfig } = privacyConfig;

    const updateData: any = {
      privacyConfig: restPrivacyConfig,
    };

    if (typeof isAiModerationEnabled !== 'undefined') updateData.isAiModerationEnabled = isAiModerationEnabled;
    if (typeof isWatermarkEnabled !== 'undefined') updateData.isWatermarkEnabled = isWatermarkEnabled;
    if (typeof isPasswordProtected !== 'undefined') updateData.isPasswordProtected = isPasswordProtected;
    if (typeof guestPin !== 'undefined') updateData.guestPin = guestPin;

    await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: 'Gizlilik ayarları güncellendi.' };
  } catch (error) {
    console.error('Update privacy settings error:', error);
    return { success: false, message: `Güncelleme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` };
  }
}

export async function verifyGuestPin(slug: string, pin: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true, guestPin: true, isPasswordProtected: true }
    });

    if (!event) {
      return { success: false, message: 'Etkinlik bulunamadı.' };
    }

    if (!event.isPasswordProtected) {
      return { success: true, message: 'Şifre koruması yok.' };
    }

    if (event.guestPin === pin) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      cookieStore.set(`event_access_${event.id}`, 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      return { success: true, message: 'Giriş başarılı.' };
    } else {
      return { success: false, message: 'Hatalı PIN.' };
    }
  } catch (error) {
    console.error('Verify PIN error:', error);
    return { success: false, message: 'Doğrulama hatası.' };
  }
}
