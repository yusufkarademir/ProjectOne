import { auth } from '../../../auth';
import { prisma } from '../../../lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { events: true },
  });

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Hoşgeldin, {user.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 text-sm">Toplam Etkinlik</h3>
          <p className="text-3xl font-bold">{user.events.length}</p>
        </div>
        {/* Add more stats here */}
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Etkinliklerin</h2>
          <Link href="/events/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Yeni Etkinlik
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {user.events.length === 0 ? (
            <li className="p-6 text-center text-gray-500">Henüz bir etkinlik oluşturmadınız.</li>
          ) : (
            user.events.map((event) => (
              <li key={event.id} className="p-6 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString('tr-TR')}</p>
                </div>
                <Link href={`/events/${event.id}`} className="text-blue-600 hover:underline">
                  Yönet
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
