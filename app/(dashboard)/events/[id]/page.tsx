import { auth } from '../../../../auth';
import { prisma } from '../../../../lib/db';
import { generateQRCode } from '../../../../lib/qr';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EventPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { photos: true },
  });

  if (!event) notFound();

  // Verify ownership
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (event.organizerId !== user?.id) return <div>Unauthorized</div>;

  const qrCodeDataUrl = await generateQRCode(event.qrCodeUrl || '');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <Link href="/dashboard" className="text-gray-600 hover:underline">
          &larr; Geri Dön
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <div className="bg-white p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Etkinlik QR Kodu</h2>
          {event.qrCodeUrl ? (
            <>
              <img src={qrCodeDataUrl} alt="Event QR Code" className="w-64 h-64 mb-4" />
              <p className="text-sm text-gray-500 mb-4 text-center break-all">
                {event.qrCodeUrl}
              </p>
              <a
                href={qrCodeDataUrl}
                download={`${event.slug}-qr.png`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                QR Kodu İndir
              </a>
            </>
          ) : (
            <p className="text-red-500">QR Kod URL'si bulunamadı.</p>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">İstatistikler</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-500 text-sm">Toplam Fotoğraf</p>
              <p className="text-2xl font-bold">{event.photos.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-500 text-sm">Tarih</p>
              <p className="text-lg font-medium">{new Date(event.date).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Tema</h3>
            <p className="capitalize text-gray-700">
              {(event.themeConfig as any)?.theme || 'Varsayılan'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Gallery Preview (Placeholder) */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Son Yüklenen Fotoğraflar</h2>
        {event.photos.length === 0 ? (
          <p className="text-gray-500">Henüz fotoğraf yüklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.photos.slice(0, 4).map((photo) => (
              <div key={photo.id} className="aspect-square bg-gray-200 rounded overflow-hidden relative">
                 {/* We will implement image rendering later */}
                 <img 
                  src={photo.url} 
                  alt="Recent upload" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-center">
            <Link href={`/events/${event.id}/gallery`} className="text-blue-600 hover:underline">
                Tüm Galeriyi Yönet &rarr;
            </Link>
        </div>
      </div>
    </div>
  );
}
