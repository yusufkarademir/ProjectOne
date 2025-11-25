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
        themeConfig: originalEvent.themeConfig,
        uploadConfig: originalEvent.uploadConfig,
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
