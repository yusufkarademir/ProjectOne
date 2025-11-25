import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import UploadForm from './upload-form';

export default async function UploadPageWrapper({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
  });

  if (!event) notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
       <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
         <h1 className="text-2xl font-bold mb-6">Fotoğraf Yükle</h1>
         <p className="mb-6 text-gray-600">En güzel anılarınızı paylaşın.</p>
         
         <UploadForm eventId={event.id} slug={event.slug} />
       </div>
    </div>
  );
}
