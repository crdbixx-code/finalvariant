import React, { useState } from 'react';
import { Tv, Film, Flame, Star, Play, Search, Filter } from 'lucide-react';
import { ContentItem } from '../types';
import { ContentCard } from './ContentCard';
import { LIVE_TV_CHANNELS } from '../data/mockData';
import { NavTab } from './TopNav';

interface CategoryViewProps {
  tab: NavTab;
  items: ContentItem[];
  onPlay: (item: ContentItem) => void;
  onDetails: (item: ContentItem) => void;
  isInList: (id: string) => boolean;
  onToggleList: (item: ContentItem) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  tab,
  items,
  onPlay,
  onDetails,
  isInList,
  onToggleList,
}) => {
  const [filterGenre, setFilterGenre] = useState<string>('All');
  const [channelSearch, setChannelSearch] = useState<string>('');

  const getTitle = () => {
    switch (tab) {
      case 'live_tv': return 'Live TV Broadcast Channels';
      case 'movies': return 'On-Demand 4K Cinema Movies';
      case 'series': return 'TV Series & Multi-Season Shows';
      case 'sports': return 'Live Sports & Premium Stadium Feeds';
      case 'music': return 'Concerts, Music Videos & Festival Streams';
      case 'kids': return 'Kids & Family Animation Lounge';
      case 'genres': return 'Browse by All Entertainment Genres';
      default: return 'Curated Streaming Catalog';
    }
  };

  const getSubtitle = () => {
    switch (tab) {
      case 'live_tv': return 'Over 15,000 global live channels with electronic program guide (EPG)';
      case 'movies': return 'Full 4K Ultra HD & Dolby Atmos cinematic releases';
      case 'series': return 'Binge-worthy drama, sci-fi, comedy, and limited series';
      case 'sports': return 'Uncompressed 60FPS football, cricket, basketball, and motorsport';
      default: return 'Instant high-speed playback with zero buffering';
    }
  };

  // If Live TV, render interactive channel directory
  if (tab === 'live_tv') {
    const filteredChannels = LIVE_TV_CHANNELS.filter((ch) => {
      const matchesSearch = 
        ch.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
        ch.currentShow.toLowerCase().includes(channelSearch.toLowerCase()) ||
        ch.number.includes(channelSearch);
      const matchesCategory = filterGenre === 'All' || ch.category === filterGenre;
      return matchesSearch && matchesCategory;
    });

    const channelCategories = ['All', 'Sports', 'Movies', 'Entertainment', 'Documentary', 'Kids', 'Music'];

    return (
      <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              {getTitle()}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {getSubtitle()}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              placeholder="Search channel or show..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {channelCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterGenre(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                filterGenre === cat
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChannels.map((ch) => (
            <div
              key={ch.id}
              onClick={() => {
                onPlay({
                  id: ch.id,
                  title: ch.name,
                  originalTitle: ch.name,
                  type: 'live_tv',
                  poster: ch.logo,
                  backdrop: ch.logo,
                  genres: [ch.category, 'Live TV'],
                  rating: 9.6,
                  year: 2026,
                  duration: 'Live Feed',
                  quality: ch.resolution.includes('4K') ? '4K UHD' : 'FHD 1080p',
                  description: `Current broadcast: ${ch.currentShow}. Up next: ${ch.nextShow}.`,
                  channelNumber: ch.number,
                  badge: '🔴 LIVE CHANNEL',
                });
              }}
              className="group p-4 rounded-xl bg-gradient-to-br from-[#0c1326] to-[#070b16] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.2)] cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {ch.number}
                    </span>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {ch.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                    ▶ {ch.currentShow}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Next: {ch.nextShow}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-400/30">
                  {ch.resolution}
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-md">
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // General content grid for other tabs (Movies, Series, Sports, Music, Kids, Genres)
  return (
    <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          {getTitle()}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {getSubtitle()}
        </p>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onPlay={onPlay}
            onDetails={onDetails}
            isInList={isInList(item.id)}
            onToggleList={onToggleList}
            layout="poster"
          />
        ))}
      </div>
    </div>
  );
};
