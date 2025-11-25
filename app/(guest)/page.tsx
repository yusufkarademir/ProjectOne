import Link from 'next/link';
import { Camera, QrCode, Share2, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              Anılarınızı Ölümsüzleştirin
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
              Düğün, nişan, doğum günü veya kurumsal etkinlikleriniz için QR kodlu fotoğraf paylaşım platformu.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/register" 
                className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Hemen Başla
              </Link>
              <Link 
                href="/login" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden EtkinlikQR?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Etkinliğinizdeki herkesin fotoğrafçınız olmasına izin verin. Tek bir QR kod ile tüm anıları toplayın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <QrCode size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Kolay Erişim</h3>
              <p className="text-gray-600">
                Misafirleriniz uygulama indirmeden, sadece QR kodu okutarak fotoğraf yükleyebilir.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Anlık Paylaşım</h3>
              <p className="text-gray-600">
                Yüklenen fotoğraflar anında canlı galeriye düşer. Herkes anın tadını çıkarır.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Güvenli Depolama</h3>
              <p className="text-gray-600">
                Tüm anılarınız yüksek güvenlikli sunucularda saklanır ve istediğiniz zaman indirilebilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-6">Nasıl Çalışır?</h2>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Hesap Oluşturun</h3>
                                <p className="text-gray-600">Hızlıca üye olun ve etkinliğinizi planlamaya başlayın.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">QR Kodunuzu Alın</h3>
                                <p className="text-gray-600">Etkinliğiniz için özel oluşturulan QR kodu indirin ve masalara yerleştirin.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Anıların Tadını Çıkarın</h3>
                                <p className="text-gray-600">Misafirleriniz fotoğraf yükledikçe galeriniz dolsun.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-3xl p-8 h-96 flex items-center justify-center">
                    {/* Placeholder for an illustration */}
                    <Camera size={64} className="text-gray-300" />
                </div>
            </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} EtkinlikQR. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
