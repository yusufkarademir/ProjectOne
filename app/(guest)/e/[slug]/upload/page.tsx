import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import UploadForm from './upload-form';
import Link from 'next/link';
import { Home, ChevronRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default async function UploadPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) notFound();

  const theme = (event.themeConfig as any)?.theme || 'default';
  const font = (event.themeConfig as any)?.font || 'inter';

  // Theme styles mapping (Same as welcome page for consistency)
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          card: 'bg-gray-800 border-gray-700',
          text: 'text-white',
          textMuted: 'text-gray-400',
          iconBg: 'bg-gray-700',
          iconColor: 'text-white',
          breadcrumb: 'text-gray-500 hover:text-gray-300',
          breadcrumbActive: 'text-white',
        };
      case 'wedding':
        return {
          bg: 'bg-[#fdfbf7]',
          card: 'bg-white border-[#e6dcc8]',
          text: 'text-gray-800',
          textMuted: 'text-[#8c8577]',
          iconBg: 'bg-[#f4efe6]',
          iconColor: 'text-[#d4af37]',
          breadcrumb: 'text-[#8c8577] hover:text-[#d4af37]',
          breadcrumbActive: 'text-[#d4af37]',
        };
      case 'party':
        return {
          bg: 'bg-[#110022]',
          card: 'bg-[#2a0a4a] border-[#4d1a85]',
          text: 'text-white',
          textMuted: 'text-purple-200',
          iconBg: 'bg-[#3d0f6b]',
          iconColor: 'text-[#ff00ff]',
          breadcrumb: 'text-purple-400 hover:text-[#ff00ff]',
          breadcrumbActive: 'text-[#ff00ff]',
        };
      default:
        return {
          bg: 'bg-gray-50',
          card: 'bg-white border-gray-100',
          text: 'text-gray-900',
          textMuted: 'text-gray-500',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          breadcrumb: 'text-gray-500 hover:text-gray-900',
          breadcrumbActive: 'text-gray-900',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`min-h-screen p-4 font-${font} ${styles.bg} transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className={`mb-6 flex items-center gap-2 text-sm ${styles.breadcrumb}`}>
          <Link href={`/e/${event.slug}`} className="flex items-center gap-1 transition-colors">
            <Home size={16} />
            <span>Etkinlik</span>
          </Link>
          <ChevronRight size={14} />
          <span className={`font-medium ${styles.breadcrumbActive}`}>Fotoğraf Yükle</span>
        </div>

        <div className={`rounded-xl shadow-sm border p-8 ${styles.card}`}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.iconBg}`}>
              <ImageIcon className={styles.iconColor} size={32} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${styles.text}`}>Fotoğraf & Video Yükle</h1>
            <p className={styles.textMuted}>{event.name} - En güzel anılarınızı paylaşın</p>
          </div>
          
          <UploadForm 
            eventId={event.id} 
            slug={event.slug} 
            isAiModerationEnabled={(event as any).isAiModerationEnabled !== false} 
          />

          <div className={`mt-6 pt-6 border-t flex justify-center gap-3 ${theme === 'dark' || theme === 'party' ? 'border-gray-700' : 'border-gray-100'}`}>
            <Link 
              href={`/e/${event.slug}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${styles.textMuted} hover:${styles.text} hover:bg-gray-100/10`}
            >
              <ArrowLeft size={18} />
              Geri Dön
            </Link>
            <Link 
              href={`/e/${event.slug}/gallery`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${styles.iconColor} hover:bg-gray-100/10`}
            >
              <ImageIcon size={18} />
              Galeriye Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
