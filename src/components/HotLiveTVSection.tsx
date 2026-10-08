import React from 'react';
import { Flame, Play, Users, TrendingUp, Heart, Star, Sparkles } from 'lucide-react';
import { ChannelRecord } from '../types/database';

interface HotLiveTVSectionProps {
  channels: ChannelRecord[];
  onPlay: (channel: ChannelRecord) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (channel: ChannelRecord) => void;
}

export const HotLiveTVSection: React.FC<HotLiveTVSectionProps> = ({
  channels,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  if (channels.length === 0) return null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,166,35,0.4)]">
              <Flame className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit'] tracking-tight">
                  HOT LIVE TV · TRENDING NOW
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold uppercase">
                  Real-time Audience Metric Ranked
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ranked dynamically by verified active concurrent streams, watch time velocity & search trends
              </p>
            </div>
          </div>
        </div>

        {/* Hot Ranked Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.slice(0, 6).map((channel, rank) => {
            const fav = isFavorite(channel.id);

            return (
              <div
                key={channel.id}
                onClick={() => onPlay(channel)}
                className="group relative rounded-xl bg-gradient-to-br from-[#0c1429] via-[#090f20] to-[#060913] border border-amber-500/20 hover:border-amber-400/60 p-4 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(245,166,35,0.2)] cursor-pointer flex items-center justify-between"
              >
                {/* Left: Rank Badge + Logo + Name */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Rank Number */}
                  <div className="w-7 text-center">
                    <span className={`text-xl font-extrabold font-['Outfit'] ${
                      rank === 0
                        ? 'text-amber-400'
                        : rank === 1
                        ? 'text-slate-200'
                        : rank === 2
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}>
                      #{rank + 1}
                    </span>
                  </div>

                  {/* Channel Logo */}
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=120&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {channel.name}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-400/30">
                        {channel.qualityStatus}
                      </span>
                    </div>

                    <p className="text-xs text-amber-300/90 truncate mt-0.5">
                      ▶ {channel.currentProgram}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Users className="w-3 h-3 text-cyan-400" />
                        {channel.currentViewers.toLocaleString()} watching
                      </span>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        {channel.trendingVelocity}% Velocity
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-2 pl-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(channel);
                    }}
                    className={`p-2 rounded-lg border transition-colors ${
                      fav
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-rose-400' : ''}`} />
                  </button>

                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-md">
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
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
