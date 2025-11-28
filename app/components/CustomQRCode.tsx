'use client';

import { useEffect, useRef } from 'react';
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  Options
} from 'qr-code-styling';

interface CustomQRCodeProps {
  url: string;
  config?: any;
  size?: number;
  className?: string;
}

export default function CustomQRCode({ url, config, size = 120, className }: CustomQRCodeProps) {
  const qrCode = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Default config if none provided
    const qrConfig = {
        width: size,
        height: size,
        type: 'svg' as const,
        data: url,
        image: config?.logo,
        dotsOptions: {
            color: config?.color || '#000000',
            type: config?.dotType || 'rounded',
            gradient: config?.gradient,
        },
        backgroundOptions: {
            color: 'transparent', // Transparent for card integration
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
        },
        cornersSquareOptions: {
            type: config?.cornerType || 'extra-rounded',
            color: config?.color || '#000000',
            gradient: config?.gradient,
        },
        cornersDotOptions: {
            type: undefined,
            color: config?.color || '#000000',
            gradient: config?.gradient,
        }
    };

    if (!qrCode.current) {
        qrCode.current = new QRCodeStyling(qrConfig);
    } else {
        qrCode.current.update(qrConfig);
    }

    if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrCode.current.append(containerRef.current);
    }
  }, [url, config, size]);

  return <div ref={containerRef} className={className} />;
}
