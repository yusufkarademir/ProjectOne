import { notFound, redirect } from 'next/navigation';
import { prisma } from '../../../../../lib/db';
import GameInterface from '@/app/components/game/GameInterface';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
        missions: {
            orderBy: { order: 'asc' }
        }
    }
  });

  if (!event) {
    notFound();
  }

  if (!event.isGameEnabled) {
    redirect(`/e/${slug}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/e/${slug}`} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-semibold text-gray-900">Fotoğraf Avı</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-20">
        <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Görevleri Tamamla!</h2>
            <p className="text-gray-600">
                Aşağıdaki anları yakala ve fotoğrafını yükle. Hepsini tamamlayabilecek misin?
            </p>
        </div>

        <GameInterface event={event} missions={event.missions} />
      </main>
    </div>
  );
}
