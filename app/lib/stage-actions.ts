'use server';

import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export interface StageConfig {
  isActive: boolean;
  mode: 'lounge' | 'hype' | 'cinema';
  title?: string;
  message?: string;
  showClock?: boolean;
  showQr?: boolean;
  musicEnabled?: boolean;
  musicType?: 'lofi' | 'upbeat' | 'jazz' | 'classical' | 'pop' | 'spotify' | 'custom';
  spotifyUrl?: string;
  countdownDuration?: number; // in minutes
  countdownTarget?: string; // ISO date string
  videoUrl?: string;
}

export async function updateStageMode(eventId: string, config: Partial<StageConfig>) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      // @ts-ignore: Schema mismatch workaround
      select: { stageConfig: true }
    });

    if (!event) {
      return { success: false, message: 'Etkinlik bulunamadı' };
    }

    const currentConfig = (event as any).stageConfig || {};
    const newConfig = { ...currentConfig, ...config };

    await prisma.event.update({
      where: { id: eventId },
      // @ts-ignore: Schema mismatch workaround
      data: {
        stageConfig: newConfig
      }
    });

    revalidatePath(`/e/${eventId}/social-live`);
    return { success: true, message: 'Sahne modu güncellendi' };
  } catch (error) {
    console.error('Error updating stage mode:', error);
    return { success: false, message: 'Bir hata oluştu' };
  }
}

export async function toggleStageMode(eventId: string, isActive: boolean) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      // @ts-ignore: Schema mismatch workaround
      select: { stageConfig: true }
    });

    if (!event) {
      return { success: false, message: 'Etkinlik bulunamadı' };
    }

    const currentConfig = (event as any).stageConfig || {};
    
    await prisma.event.update({
      where: { id: eventId },
      // @ts-ignore: Schema mismatch workaround
      data: {
        stageConfig: {
          ...currentConfig,
          isActive
        }
      }
    });

    revalidatePath(`/e/${eventId}/social-live`);
    return { success: true, message: isActive ? 'Sahne modu aktif' : 'Sahne modu kapatıldı' };
  } catch (error) {
    console.error('Error toggling stage mode:', error);
    return { success: false, message: 'Bir hata oluştu' };
  }
}
