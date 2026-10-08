import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Star,
  Film
} from 'lucide-react';
import { ContentItem } from '../types';

interface HeroBannerProps {
  items: ContentItem[];
  onWatchNow: (item: ContentItem) => void;
  onOpenDetails: (item: ContentItem) => void;
  isInMyList: (id: string) => boolean;
  onToggleMyList: (item: ContentItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  items,
  onWatchNow,
  onOpenDetails,
  isInMyList,
  onToggleMyList,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Auto rotate slides every 8 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  const currentItem = items[currentIndex] || items[0];
  const inList = isInMyList(currentItem.id);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative w-full h-[76vh] min-h-[580px] max-h-[860px] overflow-hidden bg-[#050811] select-none">
      
      {/* Background Image with Cinematic Backdrop */}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1000ms' }}
        >
          <img
            src={item.backdrop}
            alt={item.title}
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.1]"
          />
        </div>
      ))}

      {/* Cinematic Gradient Overlays (Multi-layered for deep black & blue glassmorphism) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/85 to-transparent w-full md:w-3/4 z-10" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050811]/90 to-transparent z-10" />

      {/* Subtle Ambient Neon Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-10" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-10" />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        
        <div className="max-w-2xl lg:max-w-3xl space-y-4">
          
          {/* Badge / Kicker (editorial, unboxed clean text) */}
          {currentItem.badge && (
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{currentItem.badge}</span>
              <span className="text-white/30">·</span>
              <span className="text-cyan-400 font-mono tracking-normal">{currentItem.quality}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {currentItem.title}
          </h1>

          {/* Metadata Row: Rating, Year, Duration, Audio, Genres (no pill clutter per design constitution) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{currentItem.rating.toFixed(1)}</span>
            </div>
            
            <span className="text-white/30" aria-hidden="true">·</span>
            <span className="text-slate-200">{currentItem.year}</span>
            
            {currentItem.duration && (
              <>
                <span className="text-white/30" aria-hidden="true">·</span>
                <span className="text-slate-300">{currentItem.duration}</span>
              </>
            )}

            {currentItem.audio && (
              <>
                <span className="text-white/30" aria-hidden="true">·</span>
                <span className="text-cyan-300/90 font-mono text-[11px]">{currentItem.audio}</span>
              </>
            )}

            <span className="text-white/30" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              {currentItem.genres.slice(0, 3).map((genre, gIdx) => (
                <span key={genre} className="flex items-center gap-1.5">
                  {genre}
                  {gIdx < Math.min(currentItem.genres.length - 1, 2) && (
                    <span className="text-white/20">/</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed line-clamp-3 max-w-2xl drop-shadow-md">
            {currentItem.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            
            {/* Watch Now Button (Cinematic Neon Gold/Blue CTA) */}
            <button
              onClick={() => onWatchNow(currentItem)}
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-[0_0_30px_rgba(245,166,35,0.45)] hover:shadow-[0_0_40px_rgba(245,166,35,0.7)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Watch Now</span>
            </button>

            {/* Add to List Button */}
            <button
              onClick={() => onToggleMyList(currentItem)}
              className={`px-5 sm:px-6 py-3.5 rounded-xl backdrop-blur-md border text-sm sm:text-base font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                inList
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-white/40'
              }`}
            >
              {inList ? (
                <>
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add to List</span>
                </>
              )}
            </button>

            {/* More Info Button */}
            <button
              onClick={() => onOpenDetails(currentItem)}
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer"
              title="View Synopsis & Cast"
            >
              <Info className="w-5 h-5" />
            </button>

            {/* Mute/Sound Ambient Indicator */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="hidden sm:flex p-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer ml-auto"
              title={isMuted ? 'Muted Preview' : 'Unmuted Preview'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Dots & Arrows (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
        
        <div className="flex items-center gap-1.5 mr-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-gradient-to-r from-amber-400 to-cyan-400 shadow-[0_0_8px_rgba(245,166,35,0.8)]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handlePrev}
          aria-label="Previous featured banner"
          className="w-9 h-9 rounded-lg bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next featured banner"
          className="w-9 h-9 rounded-lg bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
