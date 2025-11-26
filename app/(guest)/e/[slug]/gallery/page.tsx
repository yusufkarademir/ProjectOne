import { prisma } from '../../../../../lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GalleryGrid from '../../../../components/GalleryGrid';
import { Home, ChevronRight, Upload, ArrowLeft } from 'lucide-react';

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      photos: {
        where: { status: 'approved' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          type: true,
          mimeType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!event) notFound();

  const themeConfig = (event.themeConfig as any) || {};
  const privacyConfig = (event.privacyConfig as any) || {};
  const theme = themeConfig.theme || 'default';
  const font = themeConfig.font || 'inter';
  const frameStyle = themeConfig.frame || 'none';
  
  const isGalleryPublic = privacyConfig.isGalleryPublic !== false; // Default true
  const allowDownload = privacyConfig.allowDownload !== false;     // Default true

  // Theme styles mapping
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          textMuted: 'text-gray-400',
          breadcrumb: 'text-gray-500 hover:text-gray-300',
          breadcrumbActive: 'text-white',
          buttonPrimary: 'bg-white text-black hover:bg-gray-200',
          buttonSecondary: 'bg-gray-800 text-white hover:bg-gray-700',
          emptyState: 'bg-gray-800 border-gray-700',
        };
      case 'wedding':
        return {
          bg: 'bg-[#fdfbf7]',
          text: 'text-gray-800',
          textMuted: 'text-[#8c8577]',
          breadcrumb: 'text-[#8c8577] hover:text-[#d4af37]',
          breadcrumbActive: 'text-[#d4af37]',
          buttonPrimary: 'bg-[#d4af37] text-white hover:bg-[#c5a028]',
          buttonSecondary: 'bg-white text-[#d4af37] border border-[#d4af37] hover:bg-[#f9f4e8]',
          emptyState: 'bg-white border-[#e6dcc8]',
        };
      case 'party':
        return {
          bg: 'bg-[#110022]',
          text: 'text-white',
          textMuted: 'text-purple-200',
          breadcrumb: 'text-purple-400 hover:text-[#ff00ff]',
          breadcrumbActive: 'text-[#ff00ff]',
          buttonPrimary: 'bg-[#ff00ff] text-white hover:bg-[#d900d9]',
          buttonSecondary: 'bg-[#2a0a4a] text-[#ff00ff] border border-[#ff00ff] hover:bg-[#3d0f6b]',
          emptyState: 'bg-[#2a0a4a] border-[#4d1a85]',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          textMuted: 'text-gray-500',
          breadcrumb: 'text-gray-500 hover:text-gray-900',
          breadcrumbActive: 'text-gray-900',
          buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
          buttonSecondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          emptyState: 'bg-white border-gray-100',
        };
    }
  };

  const styles = getThemeStyles();

  if (!isGalleryPublic) {
    return (
      <div className={`min-h-screen p-4 font-${font} ${styles.bg} flex items-center justify-center`}>
        <div className={`max-w-md w-full text-center p-8 rounded-2xl border ${styles.emptyState}`}>
          <div className="w-20 h-20 bg-gray-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className={styles.textMuted} size={40} />
          </div>
          <h1 className={`text-2xl font-bold mb-3 ${styles.text}`}>Galeri Erişime Kapalı</h1>
          <p className={`mb-8 ${styles.textMuted}`}>
            Bu etkinliğin galerisi misafir erişimine kapatılmıştır. Sadece fotoğraf yükleyebilirsiniz.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href={`/e/${event.slug}/upload`}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${styles.buttonPrimary}`}
            >
              <Upload size={20} />
              Fotoğraf Yükle
            </Link>
            <Link 
              href={`/e/${event.slug}`}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${styles.buttonSecondary}`}
            >
              <ArrowLeft size={20} />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 font-${font} ${styles.bg} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className={`mb-6 flex items-center gap-2 text-sm ${styles.breadcrumb}`}>
          <Link href={`/e/${event.slug}`} className="flex items-center gap-1 transition-colors">
            <Home size={16} />
            <span>Etkinlik</span>
          </Link>
          <ChevronRight size={14} />
          <span className={`font-medium ${styles.breadcrumbActive}`}>Galeri</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${styles.text}`}>{event.name}</h1>
            <p className={`mt-1 ${styles.textMuted}`}>Galeri - {event.photos.length} içerik</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href={`/e/${event.slug}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium ${styles.buttonSecondary}`}
            >
              <ArrowLeft size={18} />
              Geri Dön
            </Link>
            <Link 
              href={`/e/${event.slug}/upload`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium ${styles.buttonPrimary}`}
            >
              <Upload size={18} />
              Fotoğraf Yükle
            </Link>
          </div>
        </div>

        {event.photos.length === 0 ? (
          <div className={`rounded-xl shadow-sm border p-12 text-center ${styles.emptyState}`}>
            <div className="w-16 h-16 bg-gray-100/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className={styles.textMuted} size={32} />
            </div>
            <p className={`text-lg font-semibold mb-2 ${styles.text}`}>Henüz içerik yüklenmemiş</p>
            <p className={`mb-6 ${styles.textMuted}`}>İlk fotoğrafı veya videoyu siz yükleyin!</p>
            <Link 
              href={`/e/${event.slug}/upload`}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${styles.buttonPrimary}`}
            >
              <Upload size={18} />
              Hemen Yükle
            </Link>
          </div>
        ) : (
          <GalleryGrid 
            photos={event.photos} 
            eventSlug={event.slug} 
            canDelete={false} 
            frameStyle={frameStyle}
            allowDownload={allowDownload}
            watermarkText={(event as any).isWatermarkEnabled ? event.name : null}
          />
        )}
      </div>
    </div>
  );
}
