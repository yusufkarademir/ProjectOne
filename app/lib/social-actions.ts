'use server';

import { auth } from '../../auth';
import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- Helper: Get Anonymous ID ---
async function getAnonymousId() {
  const cookieStore = await cookies();
  let anonId = cookieStore.get('anon_user_id')?.value;
  
  if (!anonId) {
    // Generate a simple random ID if not exists (in a real app, use UUID)
    anonId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    // Note: We can't set cookies here in a server action easily without returning a response
    // For now, we assume the client handles cookie generation or we accept it as a parameter
    // But for better security, we should handle it here.
    // Let's rely on the client passing a device ID or handle it via middleware.
    // For simplicity in this phase, we'll generate one but it won't persist across requests 
    // if not stored. Ideally, this should be read from a cookie set by middleware.
  }
  return anonId;
}

// --- Social Settings ---

export async function updateSocialSettings(eventId: string, settings: any) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, message: 'User not found' };

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) return { success: false, message: 'Unauthorized' };

    await prisma.event.update({
      where: { id: eventId },
      // @ts-ignore: Schema mismatch workaround
      data: { socialSettings: settings }
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/e/${event.slug}`);
    return { success: true, message: 'Social settings updated' };
  } catch (error) {
    console.error('Update social settings error:', error);
    return { success: false, message: 'Failed to update settings' };
  }
}

// --- Comments ---

// --- Bad Words Filter (Advanced++) ---
const BAD_WORDS = [
  // Türkçe
  'küfür', 'kufur',
  'aptal', 'salak', 'gerizekalı', 'gerizekali', 'mal', 'öküz', 'okuz', 'davur', 'davar',
  'yavşak', 'yavsak', 'piç', 'pic', 'göt', 'got', 'popo',
  'siktir', 'sik', 'sık', 'amk', 'aq', 'amcık', 'amcik', 'yarrak', 'yarak', 'yarram',
  'oç', 'oc', 'orospu', 'kahpe', 'fahişe', 'fahise', 'kaşar', 'kasar',
  'sürtük', 'surtuk', 'ibne', 'puşt', 'pust',
  'ananı', 'anani', 'bacını', 'bacini', 'sokayım', 'sokayim', 'koyayım', 'koyayim',
  
  // İngilizce
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'bastard', 'whore', 'slut', 'cunt',
  'cock', 'sucker', 'motherfucker'
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/(.)\1+/g, '$1'); // Remove repeated chars (e.g. "aaaptal" -> "aptal")
}

function filterBadWords(text: string): string {
  let filteredText = text;
  const normalizedText = normalizeText(text);
  
  BAD_WORDS.forEach(word => {
    // Check against normalized text
    if (normalizedText.includes(word)) {
      // If found, we need to mask the original text. 
      // Since mapping back is hard, we'll do a simple aggressive mask if the word is found anywhere.
      // A better approach would be to find the index and mask, but for now:
      
      // Simple Regex on Original Text (Case Insensitive)
      const regex = new RegExp(word.split('').join('+'), 'gi'); // "p+i+c" matches "p.i.c" or "piic"
      filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
      
      // Fallback: If regex didn't catch it but normalized did (e.g. leet speak), 
      // we might want to mask the whole word or sentence. 
      // For this MVP, let's try to be smart with the regex above.
      // If "p1c" is found (normalized to "pic"), the regex "p+i+c" won't match "p1c".
      // So we need a leet-aware regex.
    }
  });

  // Leet-aware masking loop
  BAD_WORDS.forEach(word => {
     // Create a pattern that matches the word even with leet replacements
     // e.g. "pic" -> "[p][i1][c]"
     const pattern = word.split('').map(char => {
        if (char === 'i') return '[i1lİı]';
        if (char === 'o') return '[o0öÖ]';
        if (char === 'a') return '[a4@]';
        if (char === 'e') return '[e3]';
        if (char === 's') return '[s5$şŞ]';
        if (char === 't') return '[t7]';
        if (char === 'c') return '[cçÇ]';
        if (char === 'g') return '[gğĞ]';
        if (char === 'u') return '[uüÜ]';
        return char;
     }).join('+'); // Allow repeated chars
     
     const regex = new RegExp(pattern, 'gi');
     filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });

  return filteredText;
}

export async function addComment(photoId: string, content: string, anonId: string) {
  try {
    // 1. Check if comments are enabled for this event
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      // @ts-ignore: Schema mismatch workaround
      include: { event: { select: { socialSettings: true, slug: true } } }
    });

    if (!photo) return { success: false, message: 'Photo not found' };

    // Cast photo to any to avoid type errors with stale client
    const photoAny = photo as any;
    const settings = photoAny.event?.socialSettings as any;
    
    if (!settings?.enabled || !settings?.features?.comments) {
      return { success: false, message: 'Comments are disabled' };
    }

    // 2. Filter Content
    const filteredContent = filterBadWords(content);

    // 3. Check Approval Settings
    const requireApproval = settings?.requireApproval || false;
    const status = requireApproval ? 'pending' : 'approved';

    // 4. Create comment
    // Cast prisma to any to access 'comment' model if types are stale
    const comment = await (prisma as any).comment.create({
      data: {
        content: filteredContent,
        photoId,
        authorId: anonId,
        status
      }
    });

    revalidatePath(`/e/${photoAny.event.slug}/social`);
    return { success: true, comment, status };
  } catch (error) {
    console.error('Add comment error:', error);
    return { success: false, message: 'Failed to add comment' };
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    // Verify ownership (Organizer can delete any comment)
    // Cast prisma to any to access 'comment' model
    const comment = await (prisma as any).comment.findUnique({
      where: { id: commentId },
      include: { photo: { include: { event: true } } }
    });

    if (!comment) return { success: false, message: 'Comment not found' };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || comment.photo.event.organizerId !== user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    await (prisma as any).comment.delete({ where: { id: commentId } });

    revalidatePath(`/e/${comment.photo.event.slug}/social`);
    return { success: true, message: 'Comment deleted' };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, message: 'Failed to delete comment' };
  }
}

export async function approveComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    const comment = await (prisma as any).comment.findUnique({
      where: { id: commentId },
      include: { photo: { include: { event: true } } }
    });

    if (!comment) return { success: false, message: 'Comment not found' };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || comment.photo.event.organizerId !== user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    await (prisma as any).comment.update({
      where: { id: commentId },
      data: { 
        status: 'approved',
        createdAt: new Date() // Update creation time to now so it appears as new in the feed
      }
    });

    revalidatePath(`/e/${comment.photo.event.slug}/social`);
    return { success: true, message: 'Comment approved' };
  } catch (error) {
    console.error('Approve comment error:', error);
    return { success: false, message: 'Failed to approve comment' };
  }
}

export async function rejectComment(commentId: string) {
  return deleteComment(commentId);
}

export async function getPendingItems(eventId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, items: [] };

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, items: [] };

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) return { success: false, items: [] };

    // Get pending comments
    const comments = await (prisma as any).comment.findMany({
      where: {
        photo: { eventId: eventId },
        status: 'pending'
      },
      include: {
        photo: { select: { url: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get pending photos
    const photos = await prisma.photo.findMany({
      where: {
        eventId: eventId,
        status: 'pending'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Combine and sort
    const items = [
      ...comments.map((c: any) => ({ type: 'comment', data: c, createdAt: c.createdAt })),
      ...photos.map((p: any) => ({ type: 'photo', data: p, createdAt: p.createdAt }))
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { success: true, items };
  } catch (error) {
    console.error('Get pending items error:', error);
    return { success: false, items: [] };
  }
}

// Keep this for backward compatibility if needed, or deprecate
export async function getPendingComments(eventId: string) {
    const result = await getPendingItems(eventId);
    if (!result.success) return { success: false, comments: [] };
    return { success: true, comments: result.items.filter((i: any) => i.type === 'comment').map((i: any) => i.data) };
}

export async function approvePhoto(photoId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { event: true }
    });

    if (!photo) return { success: false, message: 'Photo not found' };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || photo.event.organizerId !== user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.photo.update({
      where: { id: photoId },
      data: { 
        status: 'approved',
        updatedAt: new Date() // Force update timestamp
      }
    });

    revalidatePath(`/e/${photo.event.slug}/social`);
    return { success: true, message: 'Photo approved' };
  } catch (error) {
    return { success: false, message: 'Failed to approve photo' };
  }
}

export async function rejectPhoto(photoId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { event: true }
    });

    if (!photo) return { success: false, message: 'Photo not found' };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || photo.event.organizerId !== user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.photo.update({
      where: { id: photoId },
      data: { status: 'rejected' }
    });

    revalidatePath(`/e/${photo.event.slug}/social`);
    return { success: true, message: 'Photo rejected' };
  } catch (error) {
    return { success: false, message: 'Failed to reject photo' };
  }
}

export async function toggleReaction(photoId: string, type: string, anonId: string) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      // @ts-ignore: Schema mismatch workaround
      include: { event: { select: { socialSettings: true, slug: true } } }
    });

    if (!photo) return { success: false, message: 'Photo not found' };

    const photoAny = photo as any;
    const settings = photoAny.event?.socialSettings as any;

    if (!settings?.enabled || !settings?.features?.reactions) {
      return { success: false, message: 'Reactions are disabled' };
    }

    // Check if reaction exists
    const existingReaction = await (prisma as any).reaction.findFirst({
      where: {
        photoId,
        authorId: anonId,
        type
      }
    });

    if (existingReaction) {
      // Remove reaction
      await (prisma as any).reaction.delete({ where: { id: existingReaction.id } });
    } else {
      // Add reaction
      await (prisma as any).reaction.create({
        data: {
          photoId,
          type,
          authorId: anonId
        }
      });
    }

    revalidatePath(`/e/${photoAny.event.slug}/social`);
    return { success: true };
  } catch (error) {
    console.error('Toggle reaction error:', error);
    return { success: false, message: 'Failed to toggle reaction' };
  }
}

// --- Ratings ---

export async function ratePhoto(photoId: string, ratingValue: number, anonId: string) {
  return { success: false, message: 'Rating system requires Rating model' };
}

// --- Pinning ---

export async function togglePin(photoId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { event: true }
    });

    if (!photo) return { success: false, message: 'Photo not found' };

    const photoAny = photo as any;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || photoAny.event.organizerId !== user.id) {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.photo.update({
      where: { id: photoId },
      // @ts-ignore: Schema mismatch workaround
      data: { isPinned: !photoAny.isPinned }
    });

    revalidatePath(`/e/${photoAny.event.slug}/social`);
    return { success: true, isPinned: !photoAny.isPinned };
  } catch (error) {
    return { success: false, message: 'Failed to toggle pin' };
  }
}

// --- Panic Mode ---

export async function togglePanicMode(eventId: string, isPanic: boolean) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, message: 'User not found' };

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) return { success: false, message: 'Unauthorized' };

    const currentSettings = ((event as any).socialSettings as any) || {};
    const newSettings = {
      ...currentSettings,
      panicMode: isPanic
    };

    await prisma.event.update({
      where: { id: eventId },
      // @ts-ignore
      data: { socialSettings: newSettings }
    });

    revalidatePath(`/e/${event.slug}/social`);
    return { success: true, panicMode: isPanic };
  } catch (error) {
    return { success: false, message: 'Failed to toggle panic mode' };
  }
}

// --- Social Feed (Live) ---

export async function getSocialFeed(slug: string, after?: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      // @ts-ignore: Schema mismatch workaround
      select: { id: true, socialSettings: true, stageConfig: true }
    });

    if (!event) return { success: false, feed: [] };

    const settings = (event as any).socialSettings as any;
    const stageConfig = (event as any).stageConfig as any;
    
    // Panic mode check (Legacy support, but stageConfig takes precedence if active)
    if (settings?.panicMode && !stageConfig?.isActive) {
      return { success: true, feed: [], panicMode: true, stageConfig };
    }

    const since = after ? new Date(after) : new Date(Date.now() - 1000 * 60 * 30); // Default last 30 mins

    // 1. Get new/updated photos (Approved ones)
    // We check updatedAt to catch newly approved photos even if they were uploaded earlier
    const photos = await prisma.photo.findMany({
      where: {
        eventId: event.id,
        status: 'approved',
        OR: [
            { createdAt: { gt: since } },
            { updatedAt: { gt: since } }
        ]
      },
      select: {
        id: true,
        url: true,
        createdAt: true,
        updatedAt: true,
        mission: { select: { text: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // 2. Get new/updated comments
    const comments = await (prisma as any).comment.findMany({
      where: {
        photo: { eventId: event.id },
        status: 'approved',
        createdAt: { gt: since }
      },
      include: {
        photo: { select: { url: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Get new reactions (Reactions usually don't have approval, so createdAt is fine)
    const reactions = await (prisma as any).reaction.findMany({
      where: {
        photo: { eventId: event.id },
        createdAt: { gt: since }
      },
      include: {
        photo: { select: { url: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Combine and sort by the relevant timestamp (updatedAt for approved items, createdAt for reactions)
    const feed = [
      ...photos.map(p => ({ type: 'photo', data: p, timestamp: p.updatedAt || p.createdAt })),
      ...comments.map((c: any) => ({ type: 'comment', data: c, timestamp: c.createdAt })),
      ...reactions.map((r: any) => ({ type: 'reaction', data: r, timestamp: r.createdAt }))
    ].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { success: true, feed, panicMode: false, stageConfig };
  } catch (error) {
    console.error('Get social feed error:', error);
    return { success: false, feed: [] };
  }
}

// --- Reset Data ---

export async function resetSocialData(eventId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, message: 'Unauthorized' };

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, message: 'User not found' };

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== user.id) return { success: false, message: 'Unauthorized' };

    // Delete all comments
    await (prisma as any).comment.deleteMany({
      where: { photo: { eventId: eventId } }
    });

    // Delete all reactions
    await (prisma as any).reaction.deleteMany({
      where: { photo: { eventId: eventId } }
    });

    revalidatePath(`/e/${event.slug}/social`);
    return { success: true, message: 'All social data reset' };
  } catch (error) {
    console.error('Reset data error:', error);
    return { success: false, message: 'Failed to reset data' };
  }
}

export async function getSocialStats(slug: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!event) return { success: false };

    const [photoCount, commentCount, reactionCount, topLikedPhotos, topCommentedPhotos] = await Promise.all([
      prisma.photo.count({ where: { eventId: event.id, status: 'approved' } }),
      (prisma as any).comment.count({ where: { photo: { eventId: event.id }, status: 'approved' } }),
      (prisma as any).reaction.count({ where: { photo: { eventId: event.id } } }),
      // Top Liked
      prisma.photo.findMany({
        where: { eventId: event.id, status: 'approved', reactions: { some: {} } },
        orderBy: { reactions: { _count: 'desc' } },
        take: 1,
        select: {
          id: true,
          url: true,
          _count: { select: { reactions: true } }
        }
      }),
      // Top Commented
      prisma.photo.findMany({
        where: { eventId: event.id, status: 'approved', comments: { some: {} } },
        orderBy: { comments: { _count: 'desc' } },
        take: 1,
        select: {
          id: true,
          url: true,
          _count: { select: { comments: true } }
        }
      })
    ]);

    return {
      success: true,
      stats: {
        photos: photoCount,
        comments: commentCount,
        reactions: reactionCount,
        topLiked: topLikedPhotos[0] || null,
        topCommented: topCommentedPhotos[0] || null
      }
    };
  } catch (error) {
    console.error('Get stats error:', error);
    return { success: false };
  }
}
