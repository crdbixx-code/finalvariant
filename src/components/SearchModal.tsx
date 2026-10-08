import React, { useState, useMemo } from 'react';
import { Search, X, Play, Star, Film, Tv, Trophy, Music } from 'lucide-react';
import { ContentItem } from '../types';
import { 
  POPULAR_NOW, 
  TRENDING, 
  NEW_RELEASES, 
  ALL_TIME_HITS, 
  MOVIES_ITEMS, 
  TV_SERIES_ITEMS, 
  SPORTS_ITEMS, 
  MUSIC_ITEMS, 
  DRAMA_ITEMS,
  LIVE_TV_CHANNELS
} from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlay: (item: ContentItem) => void;
  onDetails: (item: ContentItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onPlay,
  onDetails,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series' | 'sports' | 'music' | 'live_tv'>('all');

  // Consolidate all searchable items
  const allCatalog: ContentItem[] = useMemo(() => {
    const raw = [
      ...POPULAR_NOW,
      ...TRENDING,
      ...NEW_RELEASES,
      ...ALL_TIME_HITS,
      ...MOVIES_ITEMS,
      ...TV_SERIES_ITEMS,
      ...SPORTS_ITEMS,
      ...MUSIC_ITEMS,
      ...DRAMA_ITEMS,
    ];

    // Add Live TV Channels
    const channelsAsItems: ContentItem[] = LIVE_TV_CHANNELS.map((ch) => ({
      id: ch.id,
      title: ch.name,
      originalTitle: ch.name,
      type: 'live_tv',
      poster: ch.logo,
      backdrop: ch.logo,
      genres: [ch.category, 'Live TV'],
      rating: 9.6,
      year: 2026,
      duration: 'Live',
      quality: ch.resolution.includes('4K') ? '4K UHD' : 'FHD 1080p',
      description: `Now playing: ${ch.currentShow}. Up next: ${ch.nextShow}.`,
      channelNumber: ch.number,
      badge: 'LIVE CH',
    }));

    // Deduplicate by id
    const map = new Map<string, ContentItem>();
    [...raw, ...channelsAsItems].forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });

    return Array.from(map.values());
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return allCatalog.slice(0, 8); // show recommended

    const q = query.toLowerCase();
    return allCatalog.filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesQuery = 
        item.title.toLowerCase().includes(q) ||
        item.genres.some((g) => g.toLowerCase().includes(q)) ||
        (item.cast && item.cast.some((c) => c.toLowerCase().includes(q)));
      return matchesType && matchesQuery;
    });
  }, [allCatalog, query, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-[#0a0f1e] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.2)] flex flex-col max-h-[82vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, series, live sports, channels, actors..."
            autoFocus
            className="flex-1 bg-transparent text-white text-base sm:text-lg placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar bg-black/20">
          {(['all', 'movie', 'series', 'sports', 'music', 'live_tv'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {t === 'all' ? 'All Content' : t.replace('_', ' ')}
            </button>
          ))}
          <span className="text-xs text-slate-500 ml-auto whitespace-nowrap">
            {results.length} found
          </span>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {results.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm">No streaming content found matching "{query}"</p>
              <p className="text-xs text-slate-500">Try searching for Dune, Oppenheimer, Sky Sports, or Action</p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onPlay(item);
                }}
                className="group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-400/40 transition-all flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-12 h-16 rounded-lg object-cover bg-slate-900 border border-white/10"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-slate-300">{item.year}</span>
                      <span>·</span>
                      <span className="capitalize">{item.type.replace('_', ' ')}</span>
                      <span>·</span>
                      <span className="text-amber-400 font-mono flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-400/30">
                    {item.quality}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-md">
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
