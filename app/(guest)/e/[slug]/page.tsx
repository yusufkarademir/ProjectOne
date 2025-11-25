import { prisma } from '../../../../lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EventWelcomePage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
  });

  if (!event) notFound();

  // Theme logic (simplified for now)
  const theme = (event.themeConfig as any)?.theme || 'default';
  
  let bgClass = 'bg-white';
  let textClass = 'text-gray-900';
  let buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white';

  if (theme === 'wedding') {
    bgClass = 'bg-pink-50';
    textClass = 'text-pink-900';
    buttonClass = 'bg-pink-600 hover:bg-pink-700 text-white';
  } else if (theme === 'corporate') {
    bgClass = 'bg-slate-100';
    textClass = 'text-slate-900';
    buttonClass = 'bg-slate-800 hover:bg-slate-900 text-white';
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgClass} ${textClass}`}>
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
          <p className="text-lg opacity-80">{new Date(event.date).toLocaleDateString('tr-TR')}</p>
        </div>

        <div className="space-y-4">
          <p className="text-xl">Hoşgeldiniz! Fotoğraflarınızı paylaşarak anı ölümsüzleştirin.</p>
          
          <Link 
            href={`/e/${event.slug}/upload`}
            className={`block w-full py-4 rounded-lg text-lg font-semibold shadow-lg transition-transform hover:scale-105 ${buttonClass}`}
          >
            Fotoğraf Yükle
          </Link>

          <Link 
            href={`/e/${event.slug}/gallery`}
            className="block w-full py-4 rounded-lg text-lg font-semibold border-2 border-current opacity-80 hover:opacity-100 transition-opacity"
          >
            Galeriyi Görüntüle
          </Link>
        </div>

        <footer className="mt-12 text-sm opacity-60">
          Powered by EtkinlikQR
        </footer>
      </div>
    </div>
  );
}
