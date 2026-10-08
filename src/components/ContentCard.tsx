import React from 'react';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onPlay: (item: ContentItem) => void;
  onDetails: (item: ContentItem) => void;
  isInList: boolean;
  onToggleList: (item: ContentItem) => void;
  layout?: 'poster' | 'backdrop'; // 2:3 or 16:9
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onPlay,
  onDetails,
  isInList,
  onToggleList,
  layout = 'poster',
}) => {
  const isBackdrop = layout === 'backdrop';

  return (
    <div 
      className={`group relative flex-none rounded-xl overflow-hidden bg-[#0c1222]/80 border border-white/[0.08] transition-all duration-300 hover:scale-[1.03] hover:z-30 hover:border-cyan-400/60 hover:shadow-[0_10px_28px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.25)] cursor-pointer ${
        isBackdrop ? 'w-[280px] sm:w-[320px]' : 'w-[170px] sm:w-[195px] md:w-[215px]'
      }`}
    >
      {/* Poster / Backdrop Media */}
      <div 
        className={`relative w-full overflow-hidden bg-slate-900 ${
          isBackdrop ? 'aspect-[16/9]' : 'aspect-[2/3]'
        }`}
        onClick={() => onPlay(item)}
      >
        <img
          src={isBackdrop ? item.backdrop : item.poster}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Quality Badge (4K / 1080p) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono bg-black/75 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
            {item.quality === '4K UHD' ? '4K' : 'HD'}
          </span>
        </div>

        {/* Audio / Special Badge */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/90 text-slate-950 font-mono shadow-md">
              {item.badge.includes('LIVE') ? 'LIVE' : item.badge.slice(0, 14)}
            </span>
          </div>
        )}

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-cyan-500 p-[1.5px] shadow-[0_0_24px_rgba(245,166,35,0.7)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-amber-300 fill-amber-300 ml-0.5" />
            </div>
          </div>
        </div>

        {/* Quick Action Bar on Hover */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleList(item);
            }}
            aria-label={isInList ? 'Remove from list' : 'Add to list'}
            className={`w-8 h-8 rounded-lg backdrop-blur-md border flex items-center justify-center transition-colors ${
              isInList
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                : 'bg-black/60 border-white/20 text-white hover:bg-black/80 hover:border-white/50'
            }`}
          >
            {isInList ? <Check className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetails(item);
            }}
            aria-label="More details"
            className="w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-white/50 text-white flex items-center justify-center transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title & Metadata Details */}
      <div className="p-3 space-y-1" onClick={() => onPlay(item)}>
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">{item.year}</span>
            <span className="text-white/20">·</span>
            <span className="truncate max-w-[90px] text-slate-400">
              {item.genres[0]}
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-amber-400 font-semibold font-mono">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
