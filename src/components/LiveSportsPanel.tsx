import React, { useState } from 'react';
import { 
  Trophy, 
  Play, 
  Radio, 
  Users, 
  Clock, 
  Calendar,
  Flame,
  ChevronRight
} from 'lucide-react';
import { LiveSportsMatch, ContentItem } from '../types';

interface LiveSportsPanelProps {
  matches: LiveSportsMatch[];
  onWatchMatch: (item: ContentItem) => void;
}

export const LiveSportsPanel: React.FC<LiveSportsPanelProps> = ({
  matches,
  onWatchMatch,
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const sportsFilter = [
    { id: 'all', label: 'All Live Sports' },
    { id: 'football', label: 'Football' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'basketball', label: 'NBA' },
    { id: 'racing', label: 'Motorsport' },
  ];

  const filteredMatches = selectedSport === 'all'
    ? matches
    : matches.filter((m) => m.sport === selectedSport);

  const handleLaunchMatch = (match: LiveSportsMatch) => {
    // Transform match into ContentItem for the player
    const sportsItem: ContentItem = {
      id: match.id,
      title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      originalTitle: `${match.league} - ${match.channelName}`,
      type: 'sports',
      poster: match.homeTeam.logo,
      backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop',
      genres: [match.league, 'Live Sports UHD'],
      rating: 9.8,
      year: 2026,
      duration: 'Live Stream',
      quality: '4K UHD',
      audio: 'Dolby Atmos 5.1 Stadium Feed',
      description: `Live broadcast on ${match.channelName}. Current match time: ${match.time}. Score: ${match.homeTeam.name} ${match.homeTeam.score ?? ''} - ${match.awayTeam.score ?? ''} ${match.awayTeam.name}.`,
      badge: '🔴 LIVE NOW',
    };
    onWatchMatch(sportsItem);
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Panel Container with Luxury Dark Glassmorphism */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#0c1326]/90 via-[#0a0f1d]/90 to-[#060913]/95 border border-cyan-500/20 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.15)] overflow-hidden">
          
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit']">
                    LIVE SPORTS STADIUM
                  </h2>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold tracking-wider uppercase animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    LIVE NOW
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ultra-low latency 4K 60FPS feeds · Premier League, UCL, ICC Cricket, NBA, F1
                </p>
              </div>
            </div>

            {/* Filter Tabs (Functional Button Controls with Clean Styling) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-black/40 rounded-xl border border-white/5">
              {sportsFilter.map((tab) => {
                const isActive = selectedSport === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSport(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matches Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((match) => {
              const isLive = match.status === 'LIVE';

              return (
                <div
                  key={match.id}
                  onClick={() => handleLaunchMatch(match)}
                  className="group relative rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 hover:border-cyan-400/50 p-4 transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.7),0_0_20px_rgba(56,189,248,0.2)] cursor-pointer flex flex-col justify-between"
                >
                  {/* Top Bar: League & Status */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {match.league}
                    </span>

                    {isLive ? (
                      <span className="flex items-center gap-1 font-mono font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        {match.time}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 bg-white/5 px-2 py-0.5 rounded text-[11px] font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {match.time}
                      </span>
                    )}
                  </div>

                  {/* Teams & Scoreboard */}
                  <div className="py-2 space-y-2.5">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={match.homeTeam.logo}
                          alt={match.homeTeam.name}
                          className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm"
                        />
                        <span className="font-semibold text-white text-sm group-hover:text-amber-300 transition-colors">
                          {match.homeTeam.name}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-base text-amber-400">
                        {match.homeTeam.score ?? '-'}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={match.awayTeam.logo}
                          alt={match.awayTeam.name}
                          className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-sm"
                        />
                        <span className="font-semibold text-white text-sm group-hover:text-amber-300 transition-colors">
                          {match.awayTeam.name}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-base text-slate-200">
                        {match.awayTeam.score ?? '-'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Footer: Channel, Viewers & Watch Now Button */}
                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-cyan-300 truncate max-w-[150px]">
                        {match.channelName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {match.viewers}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchMatch(match);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(245,166,35,0.6)] cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{isLive ? 'Watch Live' : 'Preview'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
