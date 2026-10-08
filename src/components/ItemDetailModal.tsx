import React from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Star, 
  Film, 
  Clock, 
  Calendar, 
  Volume2, 
  Tv, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { ContentItem } from '../types';

interface ItemDetailModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onPlay: (item: ContentItem) => void;
  isInList: boolean;
  onToggleList: (item: ContentItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onPlay,
  isInList,
  onToggleList,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-[#0a0f1d] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.2)] flex flex-col">
        
        {/* Backdrop Header with Close Button */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={item.backdrop || item.poster}
            alt={item.title}
            className="w-full h-full object-cover filter brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay in backdrop */}
          <div className="absolute bottom-5 left-5 right-5 space-y-1">
            {item.badge && (
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
                {item.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit'] drop-shadow-md">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{item.rating.toFixed(1)} Rating</span>
            </div>

            <span className="text-white/20">·</span>
            <span>{item.year}</span>

            {item.duration && (
              <>
                <span className="text-white/20">·</span>
                <span>{item.duration}</span>
              </>
            )}

            <span className="text-white/20">·</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              {item.quality}
            </span>

            {item.audio && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-slate-400 font-mono text-xs">{item.audio}</span>
              </>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {item.description}
          </p>

          {/* Cast & Details */}
          {item.cast && (
            <div className="space-y-1 text-xs text-slate-400">
              <p>
                <strong className="text-slate-200">Starring: </strong>
                {item.cast.join(', ')}
              </p>
              {item.director && (
                <p>
                  <strong className="text-slate-200">Director: </strong>
                  {item.director}
                </p>
              )}
              <p>
                <strong className="text-slate-200">Genres: </strong>
                {item.genres.join(', ')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onPlay(item);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Stream</span>
            </button>

            <button
              onClick={() => onToggleList(item)}
              className={`px-5 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isInList
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              {isInList ? (
                <>
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>In Favorites</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Favorites</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
