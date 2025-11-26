import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import GuestLogin from './guest-login';

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { 
        id: true, 
        name: true, 
        coverImage: true, 
        isPasswordProtected: true 
    }
  });

  if (!event) notFound();

  if (event.isPasswordProtected) {
    const cookieStore = await cookies();
    const hasAccess = cookieStore.get(`event_access_${event.id}`);

    if (!hasAccess) {
      return (
        <GuestLogin 
            slug={slug} 
            eventName={event.name} 
            coverImage={event.coverImage} 
        />
      );
    }
  }

  return <>{children}</>;
}
