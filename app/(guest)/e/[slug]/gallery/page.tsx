import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function GalleryPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      photos: {
        where: { status: 'approved' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <p className="text-gray-500">Galeri</p>
          </div>
          <Link 
            href={`/e/${event.slug}/upload`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Fotoğraf Yükle
          </Link>
        </div>

        {event.photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Henüz fotoğraf yüklenmemiş.</p>
            <p className="text-gray-400">İlk fotoğrafı siz yükleyin!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {event.photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={photo.url} 
                  alt="Event photo" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
