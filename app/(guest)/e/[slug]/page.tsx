import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/db';
import Link from 'next/link';
import { Camera, Images } from 'lucide-react';

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md text-center relative z-10 border border-white/50">
        <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                Hoş Geldiniz
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            {event.name}
            </h1>
            <p className="text-gray-500 font-medium">
            {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
        </div>

        <div className="space-y-4">
          <Link
            href={`/e/${slug}/upload`}
            className="group flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
          >
            <Camera className="w-6 h-6" />
            <span>Fotoğraf Yükle</span>
          </Link>

          <Link
            href={`/e/${slug}/gallery`}
            className="group flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl border border-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Images className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
            <span>Galeriye Git</span>
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium">
                Powered by <span className="text-blue-600">EtkinlikQR</span>
            </p>
        </div>
      </div>
    </div>
  );
}
