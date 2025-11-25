import { auth } from '../../../../../auth';
import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function OrganizerGalleryPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!event) notFound();

  // Verify ownership
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (event.organizerId !== user?.id) return <div>Unauthorized</div>;

  async function deletePhoto(formData: FormData) {
    'use server';
    const photoId = formData.get('photoId') as string;
    if (!photoId) return;

    // In a real app, we should also delete from R2 here.
    // For now, just deleting from DB.
    await prisma.photo.delete({ where: { id: photoId } });
    revalidatePath(`/events/${params.id}/gallery`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold">{event.name}</h1>
           <p className="text-gray-500">Galeri Yönetimi</p>
        </div>
        <Link href={`/events/${event.id}`} className="text-gray-600 hover:underline">
          &larr; Etkinliğe Dön
        </Link>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Toplam {event.photos.length} Fotoğraf</h2>
            <a 
                href={`/e/${event.slug}/gallery`} 
                target="_blank" 
                className="text-blue-600 hover:underline text-sm"
            >
                Misafir Görünümü &rarr;
            </a>
        </div>
        
        {event.photos.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Henüz fotoğraf yüklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square bg-gray-200 rounded overflow-hidden">
                <img 
                  src={photo.url} 
                  alt="Event photo" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                        <a 
                            href={photo.url} 
                            download 
                            target="_blank"
                            className="bg-white text-gray-800 p-2 rounded hover:bg-gray-100"
                            title="İndir"
                        >
                            ⬇
                        </a>
                        <form action={deletePhoto}>
                            <input type="hidden" name="photoId" value={photo.id} />
                            <button 
                                type="submit"
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                                title="Sil"
                                onClick={(e) => {
                                    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                🗑
                            </button>
                        </form>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
