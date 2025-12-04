import React from 'react';
import { QrCode } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark' }) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Container */}
      <div className="relative w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
        <QrCode className="text-white w-6 h-6" strokeWidth={2.5} />
      </div>
      
      {/* Text */}
      <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-gray-900' : 'text-white'}`}>
        EtkinlikQR
      </span>
    </div>
  );
};

export default Logo;
