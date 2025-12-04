import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Heart, Github, Linkedin, ExternalLink, Instagram, Globe, Facebook } from 'lucide-react';

interface DeveloperCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperCreditsModal({ isOpen, onClose }: DeveloperCreditsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10 backdrop-blur-md"
            >
              <X size={20} />
            </button>

            <div className="relative p-8 flex flex-col items-center text-center">
              {/* Avatar / Logo Area */}
              <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px] shadow-xl shadow-blue-500/20">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative group">
                    <img 
                        src="/yusuf-profile.png" 
                        alt="Yusuf KARADEMİR" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Name & Title */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                  Yusuf KARADEMİR
                </h2>
                <p className="text-blue-400 font-medium text-sm uppercase tracking-wider mb-6">
                  Bilgisayar Mühendisi
                </p>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xs"
              >
                Bu proje, modern web teknolojileri kullanılarak titizlikle tasarlanmış ve geliştirilmiştir.
              </motion.p>

              {/* Social Links */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mb-8"
              >
                <a 
                    href="https://www.linkedin.com/in/yusufkarademir/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded-xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                    title="LinkedIn"
                >
                    <Linkedin size={20} />
                </a>
                <a 
                    href="https://www.instagram.com/yusufkarademir" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800 text-slate-400 hover:text-pink-500 hover:bg-slate-700 rounded-xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
                    title="Instagram"
                >
                    <Instagram size={20} />
                </a>
                <a 
                    href="https://www.facebook.com/yusufkarademir" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-slate-700 rounded-xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-600/20"
                    title="Facebook"
                >
                    <Facebook size={20} />
                </a>
                <a 
                    href="https://yusuff.dev" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20"
                    title="Website"
                >
                    <Globe size={20} />
                </a>
              </motion.div>

              {/* Footer Signature */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 text-xs text-slate-500"
              >
                <span>Made with</span>
                <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
                <span>in 2025</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
