import React from 'react';
import { Bookmark, X, Play, Trash2, Star } from 'lucide-react';
import { ContentItem } from '../types';

interface MyListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContentItem[];
  onPlay: (item: ContentItem) => void;
  onRemove: (id: string) => void;
}

export const MyListDrawer: React.FC<MyListDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onPlay,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#090e1d] border-l border-white/10 h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                MY FAVORITES & LIST
              </h2>
              <span className="text-xs text-slate-400">
                {items.length} titles saved
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="py-24 text-center text-slate-400 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">Your list is currently empty.</p>
              <p className="text-xs text-slate-500">
                Click "+ Add to List" on any movie, series, or live channel to bookmark it.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-400/30 transition-all flex items-center justify-between gap-3"
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => {
                    onClose();
                    onPlay(item);
                  }}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-12 h-16 rounded-lg object-cover bg-slate-900 border border-white/10"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{item.year}</span>
                      <span>·</span>
                      <span className="text-amber-400 font-mono flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onClose();
                      onPlay(item);
                    }}
                    className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                    title="Play"
                  >
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                if (items[0]) {
                  onClose();
                  onPlay(items[0]);
                }
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Play All / Resume First</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
