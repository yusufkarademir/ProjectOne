'use server';

import { auth } from '../../auth';
import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export async function saveQRConfig(eventId: string, config: any) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('User not found');

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error('Event not found');

  if (event.organizerId !== user.id) {
    throw new Error('Unauthorized');
  }

  // Merge with existing themeConfig
  const currentThemeConfig = (event.themeConfig as any) || {};
  const newThemeConfig = {
    ...currentThemeConfig,
    qr: config,
  };

  await prisma.event.update({
    where: { id: eventId },
    data: {
      themeConfig: newThemeConfig,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/events/${eventId}`);
}
