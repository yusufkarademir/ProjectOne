import React from 'react';

interface FramedImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  frameStyle?: 'none' | 'polaroid' | 'gradient' | 'minimal' | 'corners' | 'cinema' | 'vintage' | 'gold' | 'neon' | 'floral';
  watermarkText?: string | null;
}

export default function FramedImage({ 
  src, 
  alt, 
  className = '', 
  imageClassName = '', 
  frameStyle = 'none',
  watermarkText = null
}: FramedImageProps) {
  if (frameStyle === 'none') {
    return (
      <div className={`relative ${className}`}>
        <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-cover ${imageClassName}`} 
        />
        {/* Watermark Overlay */}
        {watermarkText && (
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                    {Array(6).fill(watermarkText).map((text, i) => (
                        <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                    ))}
                </div>
            </div>
        )}
        {/* Ghost Layer */}
        {watermarkText && (
            <div 
                className="absolute inset-0 z-30" 
                onContextMenu={(e) => e.preventDefault()}
            />
        )}
      </div>
    );
  }

  // Polaroid: Classic instant photo look
  if (frameStyle === 'polaroid') {
    return (
      <div className={`bg-white p-3 pb-12 shadow-lg rotate-1 transform transition-transform hover:rotate-0 relative ${className}`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 shadow-inner">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover ${imageClassName}`} 
            />
             {/* Watermark Overlay */}
            {watermarkText && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                    <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                        {Array(6).fill(watermarkText).map((text, i) => (
                            <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ghost Layer */}
            {watermarkText && (
                <div 
                    className="absolute inset-0 z-30" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>
      </div>
    );
  }

  // Gradient: Modern Instagram-like border
  if (frameStyle === 'gradient') {
    return (
      <div className={`p-1.5 rounded-2xl bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 relative ${className}`}>
        <div className="bg-white p-1 rounded-xl overflow-hidden h-full relative">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover rounded-lg ${imageClassName}`} 
            />
             {/* Watermark Overlay */}
            {watermarkText && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                    <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                        {Array(6).fill(watermarkText).map((text, i) => (
                            <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ghost Layer */}
            {watermarkText && (
                <div 
                    className="absolute inset-0 z-30" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>
      </div>
    );
  }

  // Minimal: Clean white border
  if (frameStyle === 'minimal') {
    return (
      <div className={`border-[12px] border-white shadow-md relative ${className}`}>
        <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-cover ${imageClassName}`} 
        />
         {/* Watermark Overlay */}
         {watermarkText && (
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                <div className="transform -rotate-45 whitespace-nowrap text-gray-500 font-bold text-xl sm:text-3xl tracking-widest mix-blend-multiply">
                    {Array(6).fill(watermarkText).map((text, i) => (
                        <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                    ))}
                </div>
            </div>
        )}
        {/* Ghost Layer */}
        {watermarkText && (
            <div 
                className="absolute inset-0 z-30" 
                onContextMenu={(e) => e.preventDefault()}
            />
        )}
      </div>
    );
  }

  // Corners: Elegant corner decorations
  if (frameStyle === 'corners') {
    return (
      <div className={`relative p-4 ${className}`}>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-500/80 rounded-tl-lg z-10"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-500/80 rounded-tr-lg z-10"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-500/80 rounded-bl-lg z-10"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-500/80 rounded-br-lg z-10"></div>
        
        <div className="relative overflow-hidden rounded-lg h-full">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover ${imageClassName}`} 
            />
             {/* Watermark Overlay */}
            {watermarkText && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                    <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                        {Array(6).fill(watermarkText).map((text, i) => (
                            <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ghost Layer */}
            {watermarkText && (
                <div 
                    className="absolute inset-0 z-30" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>
      </div>
    );
  }

  // Cinema: Film strip effect
  if (frameStyle === 'cinema') {
    return (
      <div className={`bg-black p-4 relative ${className}`}>
        {/* Top Perforations */}
        <div className="flex justify-between mb-2 px-1">
            {[...Array(8)].map((_, i) => (
                <div key={`t-${i}`} className="w-4 h-6 bg-white/20 rounded-sm"></div>
            ))}
        </div>
        
        <div className="border-2 border-white/10 overflow-hidden relative">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover ${imageClassName}`} 
            />
             {/* Watermark Overlay */}
            {watermarkText && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                    <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                        {Array(6).fill(watermarkText).map((text, i) => (
                            <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ghost Layer */}
            {watermarkText && (
                <div 
                    className="absolute inset-0 z-30" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>

        {/* Bottom Perforations */}
        <div className="flex justify-between mt-2 px-1">
            {[...Array(8)].map((_, i) => (
                <div key={`b-${i}`} className="w-4 h-6 bg-white/20 rounded-sm"></div>
            ))}
        </div>
      </div>
    );
  }

  // Vintage: Torn paper / Old photo look
  if (frameStyle === 'vintage') {
    return (
      <div className={`p-4 bg-[#f4e4bc] shadow-lg relative ${className}`} style={{ clipPath: 'polygon(2% 2%, 98% 1%, 100% 98%, 1% 100%)' }}>
        <div className="border border-[#d4c49c] p-1 h-full relative">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover sepia-[.3] contrast-125 ${imageClassName}`} 
            />
             {/* Watermark Overlay */}
            {watermarkText && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                    <div className="transform -rotate-45 whitespace-nowrap text-black font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay opacity-20">
                        {Array(6).fill(watermarkText).map((text, i) => (
                            <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ghost Layer */}
            {watermarkText && (
                <div 
                    className="absolute inset-0 z-30" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>
      </div>
    );
  }

  // Gold Luxury: Double gold border
  if (frameStyle === 'gold') {
    return (
      <div className={`p-3 bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#b38728] shadow-xl relative ${className}`}>
        <div className="bg-black p-1 h-full">
             <div className="border border-[#bf953f] p-1 h-full relative">
                <img 
                    src={src} 
                    alt={alt} 
                    className={`w-full h-full object-cover ${imageClassName}`} 
                />
                 {/* Watermark Overlay */}
                {watermarkText && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                        <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                            {Array(6).fill(watermarkText).map((text, i) => (
                                <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                            ))}
                        </div>
                    </div>
                )}
                {/* Ghost Layer */}
                {watermarkText && (
                    <div 
                        className="absolute inset-0 z-30" 
                        onContextMenu={(e) => e.preventDefault()}
                    />
                )}
             </div>
        </div>
      </div>
    );
  }

  // Neon: Glowing border
  if (frameStyle === 'neon') {
    return (
      <div className={`p-1 bg-black shadow-[0_0_10px_#0ff,0_0_20px_#0ff] rounded-lg relative ${className}`}>
        <div className="border-2 border-[#0ff] rounded-lg overflow-hidden h-full relative">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover ${imageClassName}`} 
            />
             {/* Watermark Overlay */}
            {watermarkText && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                    <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                        {Array(6).fill(watermarkText).map((text, i) => (
                            <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ghost Layer */}
            {watermarkText && (
                <div 
                    className="absolute inset-0 z-30" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>
      </div>
    );
  }

  // Floral: Simple SVG overlay
  if (frameStyle === 'floral') {
    return (
      <div className={`relative p-6 bg-white shadow-sm ${className}`}>
        {/* SVG Decorations */}
        <svg className="absolute top-0 left-0 w-16 h-16 text-pink-300 z-10" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0 C 20 0 20 20 40 20 C 20 20 20 40 0 40 Z" />
            <circle cx="10" cy="10" r="5" fill="#fce7f3" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-16 h-16 text-pink-300 z-10 rotate-180" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0 0 C 20 0 20 20 40 20 C 20 20 20 40 0 40 Z" />
            <circle cx="10" cy="10" r="5" fill="#fce7f3" />
        </svg>

        <div className="relative overflow-hidden rounded-full border-4 border-pink-100 h-full aspect-square">
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover ${imageClassName}`} 
            />
             {/* Watermark Overlay */}
            {watermarkText && (
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                    <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                        {Array(6).fill(watermarkText).map((text, i) => (
                            <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Ghost Layer */}
            {watermarkText && (
                <div 
                    className="absolute inset-0 z-30" 
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
        <img src={src} alt={alt} className={imageClassName || className} />
         {/* Watermark Overlay */}
         {watermarkText && (
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 select-none">
                <div className="transform -rotate-45 whitespace-nowrap text-white font-bold text-xl sm:text-3xl tracking-widest mix-blend-overlay">
                    {Array(6).fill(watermarkText).map((text, i) => (
                        <span key={i} className="block my-16">{text} &nbsp;&nbsp;&nbsp; {text}</span>
                    ))}
                </div>
            </div>
        )}
        {/* Ghost Layer */}
        {watermarkText && (
            <div 
                className="absolute inset-0 z-30" 
                onContextMenu={(e) => e.preventDefault()}
            />
        )}
    </div>
  );
}
