import React from 'react';
import { Play, Heart, Star, ShieldCheck, Wifi, Radio } from 'lucide-react';
import { ChannelRecord } from '../types/database';

interface ChannelCardRealProps {
  channel: ChannelRecord;
  onPlay: (channel: ChannelRecord) => void;
  isFavorite: boolean;
  onToggleFavorite: (channel: ChannelRecord) => void;
  onDetails?: (channel: ChannelRecord) => void;
}

export const ChannelCardReal: React.FC<ChannelCardRealProps> = ({
  channel,
  onPlay,
  isFavorite,
  onToggleFavorite,
  onDetails,
}) => {
  const isOnline = channel.streamHealth === 'ONLINE';

  return (
    <div
      onClick={() => onPlay(channel)}
      className="group relative rounded-xl bg-gradient-to-br from-[#0c1224]/90 to-[#070b16]/95 border border-white/[0.08] hover:border-cyan-400/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(0,0,0,0.85),0_0_22px_rgba(56,189,248,0.22)] cursor-pointer p-4 flex flex-col justify-between"
    >
      {/* Top Bar: Health / Quality / Badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          {/* Health indicator */}
          <span
            className={`w-2 h-2 rounded-full ${
              channel.streamHealth === 'ONLINE'
                ? 'bg-emerald-400 animate-pulse'
                : channel.streamHealth === 'DEGRADED'
                ? 'bg-amber-400'
                : 'bg-red-500'
            }`}
            title={`Stream Health: ${channel.streamHealth}`}
          />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {channel.countryCode} · {channel.language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* HD / 4K Badge */}
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 text-cyan-300 border border-cyan-400/30">
            {channel.qualityStatus}
          </span>
          {/* Live indicator */}
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-500/30 uppercase flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-400 animate-ping" />
            LIVE
          </span>
        </div>
      </div>

      {/* Middle: Logo & Channel Identification */}
      <div className="flex items-center gap-3.5 my-2">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 flex items-center justify-center">
          <img
            src={channel.logo}
            alt={channel.officialName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Neutral placeholder on error
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=120&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
            {channel.name}
          </h3>
          <p className="text-xs text-cyan-300/90 font-medium truncate mt-0.5">
            ▶ {channel.currentProgram}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            Up next: {channel.nextProgram}
          </p>
        </div>
      </div>

      {/* Bottom Meta & Action Buttons */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
          <span className="text-amber-300 font-semibold">{channel.currentViewers.toLocaleString()}</span>
          <span>viewers</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(channel);
            }}
            aria-label={isFavorite ? 'Remove favorite' : 'Add to favorites'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>

          {/* Watch Live CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(channel);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md group-hover:shadow-[0_0_15px_rgba(245,166,35,0.6)] transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>WATCH LIVE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
