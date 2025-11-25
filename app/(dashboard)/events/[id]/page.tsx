import { auth } from '../../../../auth';
import { prisma } from '../../../../lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EventManager from '@/app/components/EventManager';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) return null;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!event) notFound();

  // Verify ownership
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (event.organizerId !== user?.id) return <div>Unauthorized</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-500 mt-1">Etkinlik Yönetim Paneli</p>
        </div>
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          &larr; Dashboard'a Dön
        </Link>
      </div>

      <EventManager event={event} />
    </div>
  );
}
