import React from 'react';
import { Play, RotateCcw, Clock } from 'lucide-react';
import { ContentItem } from '../types';

interface ContinueWatchingRowProps {
  items: ContentItem[];
  onResume: (item: ContentItem) => void;
  onRemove?: (id: string) => void;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  items,
  onResume,
}) => {
  if (items.length === 0) return null;

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <RotateCcw className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              CONTINUE WATCHING
            </h2>
            <p className="text-xs text-slate-400">
              Pick up exactly where you left off across all your devices
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const progress = item.progress || 50;

            return (
              <div
                key={item.id}
                onClick={() => onResume(item)}
                className="group relative rounded-xl overflow-hidden bg-[#0c1224]/85 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.2)] cursor-pointer flex flex-col"
              >
                {/* 16:9 Thumbnail with Resume Button */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.backdrop}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1224] via-black/30 to-transparent" />

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
                    <div className="w-11 h-11 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,166,35,0.8)]">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>

                  {/* Quality Badge */}
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-cyan-300 border border-cyan-400/30">
                    {item.quality === '4K UHD' ? '4K' : 'HD'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 rounded-r"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Details Footer */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 mt-1 border-t border-white/5">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Clock className="w-3 h-3" />
                      {progress}% completed
                    </span>
                    <span className="text-amber-400 font-semibold">
                      Resume ▶
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
