import { signOut } from '../../auth';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">EtkinlikQR</h1>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">
            Genel Bakış
          </Link>
          <Link href="/events/create" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">
            Yeni Etkinlik
          </Link>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button className="w-full text-left px-6 py-2 text-red-600 hover:bg-gray-100">
              Çıkış Yap
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
