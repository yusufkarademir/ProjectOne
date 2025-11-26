'use server';

import { auth } from '../../auth';
import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleGameStatus(eventId: string, isEnabled: boolean) {
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
      data: { isGameEnabled: isEnabled },
    });

    revalidatePath(`/dashboard/events/${eventId}`);
    revalidatePath(`/e/${event.slug}`);
    return { success: true, message: `Fotoğraf Avı ${isEnabled ? 'aktif edildi' : 'kapatıldı'}.` };
  } catch (error) {
    console.error('Toggle game status error:', error);
    return { success: false, message: 'Durum güncellenirken bir hata oluştu.' };
  }
}

export async function createMission(eventId: string, text: string) {
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

    // Get current mission count for ordering
    const count = await prisma.mission.count({ where: { eventId } });

    const mission = await prisma.mission.create({
      data: {
        text,
        eventId,
        order: count,
      },
    });

    revalidatePath(`/dashboard/events/${eventId}`);
    return { success: true, mission };
  } catch (error) {
    console.error('Create mission error:', error);
    return { success: false, message: 'Görev oluşturulurken bir hata oluştu.' };
  }
}

export async function updateMission(missionId: string, text: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Oturum açmanız gerekiyor.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    const mission = await prisma.mission.findUnique({ 
      where: { id: missionId },
      include: { event: true }
    });

    if (!mission || mission.event.organizerId !== user.id) {
      return { success: false, message: 'Bu görevi düzenleme yetkiniz yok.' };
    }

    await prisma.mission.update({
      where: { id: missionId },
      data: { text },
    });

    revalidatePath(`/dashboard/events/${mission.eventId}`);
    return { success: true, message: 'Görev güncellendi.' };
  } catch (error) {
    console.error('Update mission error:', error);
    return { success: false, message: 'Görev güncellenirken bir hata oluştu.' };
  }
}

export async function deleteMission(missionId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Oturum açmanız gerekiyor.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    const mission = await prisma.mission.findUnique({ 
      where: { id: missionId },
      include: { event: true }
    });

    if (!mission || mission.event.organizerId !== user.id) {
      return { success: false, message: 'Bu görevi silme yetkiniz yok.' };
    }

    await prisma.mission.delete({
      where: { id: missionId },
    });

    revalidatePath(`/dashboard/events/${mission.eventId}`);
    return { success: true, message: 'Görev silindi.' };
  } catch (error) {
    console.error('Delete mission error:', error);
    return { success: false, message: 'Görev silinirken bir hata oluştu.' };
  }
}

export async function getMissions(eventId: string) {
  try {
    const missions = await prisma.mission.findMany({
      where: { eventId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { photos: true }
        }
      }
    });
    return { success: true, missions };
  } catch (error) {
    console.error('Get missions error:', error);
    return { success: false, missions: [] };
  }
}
