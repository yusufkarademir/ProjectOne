'use server';

import { prisma } from '../../lib/db';

export async function getEventPhotosForAI(slug: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!event) return { success: false, photos: [] };

    const photos = await prisma.photo.findMany({
      where: {
        eventId: event.id,
        status: 'approved',
        type: 'image',
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
      }
    });

    return { success: true, photos };
  } catch (error) {
    console.error('Get event photos for AI error:', error);
    return { success: false, photos: [] };
  }
}
