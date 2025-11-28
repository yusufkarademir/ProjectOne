'use server';

import { auth } from '../../auth';
import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';

export async function incrementViewCount(slug: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!event) return { success: false };

    await prisma.event.update({
      where: { id: event.id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Increment view count error:', error);
    return { success: false };
  }
}

export async function incrementDownloadCount(photoId: string) {
  try {
    await prisma.photo.update({
      where: { id: photoId },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Increment download count error:', error);
    return { success: false };
  }
}

export async function getEventAnalytics(eventId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        viewCount: true,
        photos: {
          select: {
            id: true,
            url: true,
            downloadCount: true,
            createdAt: true,
            type: true,
          }
        }
      }
    });

    if (!event) return { success: false, message: 'Event not found' };

    // Calculate stats
    const totalViews = event.viewCount;
    const totalPhotos = event.photos.length;
    const totalDownloads = event.photos.reduce((acc, photo) => acc + photo.downloadCount, 0);

    // Calculate hourly upload activity
    const uploadsByHour = new Array(24).fill(0);
    event.photos.forEach(photo => {
      // Convert to Turkey Time (UTC+3)
      const hour = (new Date(photo.createdAt).getUTCHours() + 3) % 24;
      uploadsByHour[hour]++;
    });

    const activityData = uploadsByHour.map((count, hour) => ({
      hour: `${hour}:00`,
      uploads: count
    }));

    // Get top downloaded photos
    const topPhotos = [...event.photos]
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, 5)
      .map(photo => ({
        id: photo.id,
        url: photo.url,
        downloads: photo.downloadCount,
        type: photo.type
      }));

    return {
      success: true,
      data: {
        totalViews,
        totalPhotos,
        totalDownloads,
        activityData,
        topPhotos
      }
    };
  } catch (error) {
    console.error('Get analytics error:', error);
    return { success: false, message: 'Failed to fetch analytics' };
  }
}
