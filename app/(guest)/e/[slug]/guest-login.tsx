'use client';

import { useState } from 'react';
import { verifyGuestPin } from '@/app/lib/event-actions';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GuestLogin({ slug, eventName, coverImage }: { slug: string, eventName: string, coverImage?: string | null }) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      toast.error('Lütfen geçerli bir PIN girin.');
      return;
    }

    setIsLoading(true);
    const result = await verifyGuestPin(slug, pin);
    
    if (result.success) {
      toast.success('Giriş başarılı!');
      router.refresh();
    } else {
      toast.error(result.message || 'Hatalı PIN.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background Image with Overlay */}
      {coverImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={coverImage} 
            alt="Event Cover" 
            className="w-full h-full object-cover opacity-30 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-2">{eventName}</h1>
            <p className="text-gray-300 text-center text-sm">Bu galeri şifre ile korunmaktadır.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="PIN Giriniz"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                autoFocus
                inputMode="numeric"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  Galeriye Gir
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-8">
          &copy; {new Date().getFullYear()} EtkinlikQR. Güvenli Galeri Erişimi.
        </p>
      </div>
    </div>
  );
}
