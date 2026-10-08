import React, { useState, useEffect, useCallback } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Sparkles, 
  Star, 
  Music, 
  Film, 
  Tv, 
  Trophy, 
  Heart, 
  Layers,
  History,
  Bookmark,
  Radio,
  Newspaper,
  ShieldAlert,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ContentItem } from './types';
import { ChannelRecord, MovieRecord, WebSeriesRecord, DramaRecord, SportsEventRecord } from './types/database';
import { 
  HERO_ITEMS,
  CONTINUE_WATCHING,
  ACCOUNT_INFO 
} from './data/mockData';
import { TopNav, NavTab } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { ContentRow } from './components/ContentRow';
import { LiveSportsPanel } from './components/LiveSportsPanel';
import { AllGenresSection } from './components/AllGenresSection';
import { ContinueWatchingRow } from './components/ContinueWatchingRow';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AccountModal } from './components/AccountModal';
import { SearchModal } from './components/SearchModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { MyListDrawer } from './components/MyListDrawer';
import { AppFooter } from './components/AppFooter';
import { ChannelCardReal } from './components/ChannelCardReal';
import { HotLiveTVSection } from './components/HotLiveTVSection';
import { CountryLanguageFilter, FilterState } from './components/CountryLanguageFilter';
import { AdminPanel } from './components/AdminPanel';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab | 'admin'>('home');
  const [playingItem, setPlayingItem] = useState<ContentItem | null>(null);
  const [detailItem, setDetailItem] = useState<ContentItem | null>(null);

  // Dynamic Database Counts & Global Stats (Rule 32)
  const [totalChannelsCount, setTotalChannelsCount] = useState<number>(13200);
  const [verifiedActiveChannels, setVerifiedActiveChannels] = useState<number>(13050);
  const [concurrentLiveViewers, setConcurrentLiveViewers] = useState<number>(420000);

  // Real Database Records State
  const [channelList, setChannelList] = useState<ChannelRecord[]>([]);
  const [totalFilteredChannels, setTotalFilteredChannels] = useState<number>(0);
  const [hotChannels, setHotChannels] = useState<ChannelRecord[]>([]);
  const [moviesList, setMoviesList] = useState<MovieRecord[]>([]);
  const [dramasList, setDramasList] = useState<DramaRecord[]>([]);
  const [sportsEventsList, setSportsEventsList] = useState<SportsEventRecord[]>([]);

  // Filtering State (Rule 16 & 23)
  const [filters, setFilters] = useState<FilterState>({
    countryCode: '',
    region: '',
    language: '',
    category: '',
    quality: '',
    providerId: '',
  });

  const [pageOffset, setPageOffset] = useState<number>(0);
  const pageSize = 36;

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // User Favorites & Recently Watched
  const [myList, setMyList] = useState<ContentItem[]>([
    HERO_ITEMS[0],
    {
      id: 'CH-PK-001',
      title: 'Geo News HD',
      originalTitle: 'Geo News',
      type: 'live_tv',
      poster: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop',
      genres: ['News', 'Pakistan Live'],
      rating: 9.8,
      year: 2026,
      quality: 'FHD 1080p',
      description: '24/7 Urdu News broadcast.',
      badge: 'LIVE 4K'
    }
  ]);

  const [recentlyWatched, setRecentlyWatched] = useState<ContentItem[]>(CONTINUE_WATCHING);

  // 1. Fetch Dynamic Database Counts
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setTotalChannelsCount(data.totalChannels);
        setVerifiedActiveChannels(data.verifiedActiveChannels);
        setConcurrentLiveViewers(data.activeViewers);
      }
    } catch (e) {
      console.error('Error fetching dynamic database stats', e);
    }
  };

  // 2. Fetch Channels with Server-side Pagination & Filtering (Rule 23)
  const fetchChannels = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.countryCode) params.set('country', filters.countryCode);
      if (filters.category) params.set('category', filters.category);
      if (filters.language) params.set('language', filters.language);
      if (filters.quality) params.set('quality', filters.quality);
      params.set('limit', pageSize.toString());
      params.set('offset', pageOffset.toString());

      const res = await fetch(`/api/channels?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setChannelList(data.items);
        setTotalFilteredChannels(data.total);
      }
    } catch (e) {
      console.error('Error fetching channels', e);
    }
  }, [filters, pageOffset]);

  // 3. Fetch Hot Live TV
  const fetchHotChannels = async () => {
    try {
      const res = await fetch('/api/hot?limit=6');
      if (res.ok) {
        const data = await res.json();
        setHotChannels(data.items);
      }
    } catch (e) {
      console.error('Error fetching hot channels', e);
    }
  };

  // 4. Fetch Movies, Dramas, Sports
  const fetchVODs = async () => {
    try {
      const [movRes, drmRes, sptRes] = await Promise.all([
        fetch('/api/movies'),
        fetch('/api/dramas'),
        fetch('/api/sports')
      ]);

      if (movRes.ok) {
        const m = await movRes.json();
        setMoviesList(m.items);
      }
      if (drmRes.ok) {
        const d = await drmRes.json();
        setDramasList(d.items);
      }
      if (sptRes.ok) {
        const s = await sptRes.json();
        setSportsEventsList(s.items);
      }
    } catch (e) {
      console.error('Error fetching VOD catalogs', e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHotChannels();
    fetchVODs();
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  // Favorites Helpers
  const isInMyList = (id: string) => myList.some((item) => item.id === id);

  const toggleMyList = (item: ContentItem) => {
    setMyList((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const handlePlayContent = (item: ContentItem) => {
    setPlayingItem(item);
    setRecentlyWatched((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      return [item, ...filtered].slice(0, 8);
    });
  };

  const handlePlayChannelRecord = (channel: ChannelRecord) => {
    const item: ContentItem = {
      id: channel.id,
      title: channel.name,
      originalTitle: channel.officialName,
      type: 'live_tv',
      poster: channel.logo,
      backdrop: channel.banner,
      genres: [channel.category, channel.country],
      rating: 9.6,
      year: 2026,
      duration: 'Live Broadcast',
      quality: channel.resolution,
      audio: channel.audioLanguage,
      description: `${channel.description} Now playing: ${channel.currentProgram}.`,
      channelNumber: channel.id.split('-').pop(),
      currentShow: channel.currentProgram,
      nextShow: channel.nextProgram,
      streamUrl: channel.streamUrl,
      badge: '🔴 LIVE 4K'
    };
    handlePlayContent(item);
  };

  // Convert MovieRecord to ContentItem
  const movieToContentItem = (m: MovieRecord): ContentItem => ({
    id: m.id,
    title: m.officialTitle,
    originalTitle: m.originalTitle,
    type: 'movie',
    poster: m.poster,
    backdrop: m.backdrop,
    genres: [m.genre, m.country],
    rating: m.rating,
    year: m.releaseYear,
    duration: `${Math.floor(m.runtimeMinutes / 60)}h ${m.runtimeMinutes % 60}m`,
    quality: '4K UHD',
    description: m.description,
    cast: m.cast,
    director: m.director,
    badge: '4K CINEMA'
  });

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] select-none">
      
      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab === 'admin' ? 'home' : activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenProfile={() => setIsAccountOpen(true)}
        favoritesCount={myList.length}
        unreadNotificationsCount={3}
      />

      {/* Floating Super Admin Mode Switcher (Fixed Bottom-Left) */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 text-slate-950 font-bold text-xs shadow-[0_0_25px_rgba(245,166,35,0.5)] hover:scale-105 transition-all cursor-pointer border border-white/20"
        >
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span>IPTV SUPER ADMIN</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* HERO SECTION WITH DYNAMIC DATABASE CHANNEL COUNT (Rule 24 & Rule 32) */}
        <div className="relative">
          <HeroBanner
            items={HERO_ITEMS}
            onWatchNow={handlePlayContent}
            onOpenDetails={(item) => setDetailItem(item)}
            isInMyList={isInMyList}
            onToggleMyList={toggleMyList}
          />

          {/* DYNAMIC DATABASE VERIFIED CHANNELS STRIP */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30 mb-8">
            <div className="rounded-2xl bg-gradient-to-r from-[#0d162d]/95 via-[#080e1c]/95 to-[#0b1428]/95 border border-cyan-500/25 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(56,189,248,0.18)] backdrop-blur-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-500 flex items-center justify-center font-bold text-slate-950 shadow-md">
                  <Tv className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold text-white font-['Outfit'] tracking-wide">
                      {totalChannelsCount.toLocaleString()} VERIFIED LIVE CHANNELS
                    </h2>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live television, licensed entertainment & uncompressed 4K sports streams directly indexed from authorized providers
                  </p>
                </div>
              </div>

              {/* Real-time stats */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right hidden sm:block">
                  <span className="text-slate-400 block text-[10px]">ACTIVE CONCURRENT VIEWERS</span>
                  <span className="text-amber-400 font-bold text-sm">{concurrentLiveViewers.toLocaleString()} watching</span>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('catalog-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Explore All Channels ↓
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: 🔥 HOT LIVE TV (Rule 8: Ranked by Real Database Metrics) */}
        <HotLiveTVSection
          channels={hotChannels}
          onPlay={handlePlayChannelRecord}
          isFavorite={(id) => isInMyList(id)}
          onToggleFavorite={(ch) => {
            const item: ContentItem = {
              id: ch.id,
              title: ch.name,
              type: 'live_tv',
              poster: ch.logo,
              backdrop: ch.banner,
              genres: [ch.category, ch.country],
              rating: 9.6,
              year: 2026,
              quality: ch.resolution,
              description: ch.description,
            };
            toggleMyList(item);
          }}
        />

        {/* SECTION 2: ⚽ LIVE SPORTS STADIUM AREA (Rule 13) */}
        <div id="sports">
          <LiveSportsPanel
            matches={[
              {
                id: 'sport-1',
                league: 'UEFA Champions League',
                sport: 'football',
                homeTeam: { name: 'Real Madrid', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=160&auto=format&fit=crop', score: 2 },
                awayTeam: { name: 'Manchester City', logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=160&auto=format&fit=crop', score: 1 },
                status: 'LIVE',
                time: "74'",
                channelName: 'TNT Sports 1 Ultimate 4K',
                channelLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=100&auto=format&fit=crop',
                viewers: '1.4M watching',
                hot: true,
              },
              {
                id: 'sport-2',
                league: 'ICC World Super Series',
                sport: 'cricket',
                homeTeam: { name: 'Pakistan', logo: 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?q=80&w=160&auto=format&fit=crop', score: '178/4' },
                awayTeam: { name: 'Australia', logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=160&auto=format&fit=crop', score: '174/8' },
                status: 'LIVE',
                time: 'Final Over',
                channelName: 'A Sports HD 60fps',
                channelLogo: 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?q=80&w=100&auto=format&fit=crop',
                viewers: '2.8M watching',
                hot: true,
              },
              {
                id: 'sport-3',
                league: 'NBA Playoffs 2026',
                sport: 'basketball',
                homeTeam: { name: 'L.A. Lakers', logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=160&auto=format&fit=crop', score: 98 },
                awayTeam: { name: 'Golden State', logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=160&auto=format&fit=crop', score: 95 },
                status: 'LIVE',
                time: 'Q4 02:41',
                channelName: 'ESPN HD 60fps',
                channelLogo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=100&auto=format&fit=crop',
                viewers: '890K watching',
              }
            ]}
            onWatchMatch={handlePlayContent}
          />
        </div>

        {/* SECTION 3: CASCADING COUNTRY & LANGUAGE FILTER + CHANNELS CATALOG GRID (Rule 16, 23 & 25) */}
        <section id="catalog-grid" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                  GLOBAL LIVE TV NETWORK CATALOG
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Browsing {totalFilteredChannels.toLocaleString()} verified broadcast feeds · Multi-level filtering by Country, Language & Format
              </p>
            </div>
          </div>

          {/* Granular Cascading Filter Bar (Item 16) */}
          <CountryLanguageFilter
            filters={filters}
            onChange={(newFilters) => {
              setFilters(newFilters);
              setPageOffset(0);
            }}
            onReset={() => {
              setFilters({
                countryCode: '',
                region: '',
                language: '',
                category: '',
                quality: '',
                providerId: '',
              });
              setPageOffset(0);
            }}
            totalFiltered={totalFilteredChannels}
          />

          {/* Channels Grid (Virtual load / Paginated per Rule 23) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channelList.map((ch) => (
              <ChannelCardReal
                key={ch.id}
                channel={ch}
                onPlay={handlePlayChannelRecord}
                isFavorite={isInMyList(ch.id)}
                onToggleFavorite={(channel) => {
                  const item: ContentItem = {
                    id: channel.id,
                    title: channel.name,
                    type: 'live_tv',
                    poster: channel.logo,
                    backdrop: channel.banner,
                    genres: [channel.category, channel.country],
                    rating: 9.6,
                    year: 2026,
                    quality: channel.resolution,
                    description: channel.description,
                  };
                  toggleMyList(item);
                }}
              />
            ))}
          </div>

          {/* Server-Side Pagination Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
            <span className="text-slate-400 font-mono">
              Showing {channelList.length > 0 ? pageOffset + 1 : 0} - {Math.min(pageOffset + pageSize, totalFilteredChannels)} of {totalFilteredChannels.toLocaleString()} channels
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageOffset((prev) => Math.max(0, prev - pageSize))}
                disabled={pageOffset === 0}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-mono font-semibold transition-colors cursor-pointer"
              >
                ← Previous Page
              </button>

              <button
                onClick={() => setPageOffset((prev) => prev + pageSize)}
                disabled={pageOffset + pageSize >= totalFilteredChannels}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-mono font-semibold transition-colors cursor-pointer"
              >
                Next Page →
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4: 🎬 LICENSED MOVIES & 4K CINEMA (Rule 9) */}
        {moviesList.length > 0 && (
          <div id="movies">
            <ContentRow
              title="Movies & 4K Cinema"
              subtitle="Theatrical releases and licensed Hollywood & international films"
              icon={<Film className="w-5 h-5 text-purple-400" />}
              items={moviesList.map(movieToContentItem)}
              onPlay={handlePlayContent}
              onDetails={(item) => setDetailItem(item)}
              isInList={isInMyList}
              onToggleList={toggleMyList}
            />
          </div>
        )}

        {/* SECTION 5: 🎭 DRAMA CORNER (Pakistani, Turkish, Korean) (Rule 11) */}
        {dramasList.length > 0 && (
          <div id="drama">
            <ContentRow
              title="Drama Corner (Pakistani, Turkish & Korean)"
              subtitle="Critically acclaimed serials, romantic classics, and historical sagas"
              icon={<Heart className="w-5 h-5 text-rose-400" />}
              items={dramasList.map((d) => ({
                id: d.id,
                title: d.title,
                originalTitle: d.title,
                type: 'series',
                poster: d.poster,
                backdrop: d.backdrop,
                genres: [d.origin, 'Drama', d.language],
                rating: d.rating,
                year: 2024,
                duration: `${d.totalEpisodes} Episodes`,
                quality: '4K UHD',
                description: d.synopsis,
                badge: `${d.origin.toUpperCase()} HIT`
              }))}
              onPlay={handlePlayContent}
              onDetails={(item) => setDetailItem(item)}
              isInList={isInMyList}
              onToggleList={toggleMyList}
            />
          </div>
        )}

        {/* SECTION 6: 🎭 ALL GENRES (Expandable) */}
        <div id="genres">
          <AllGenresSection
            onSelectGenre={(genre) => {
              setFilters({ ...filters, category: genre.includes('Sports') ? 'Sports' : genre.includes('News') ? 'News' : 'General Entertainment' });
              const el = document.getElementById('catalog-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* SECTION 7: CONTINUE WATCHING */}
        <ContinueWatchingRow
          items={CONTINUE_WATCHING}
          onResume={handlePlayContent}
        />

        {/* SECTION 8: RECENTLY WATCHED */}
        {recentlyWatched.length > 0 && (
          <ContentRow
            title="Recently Watched"
            subtitle="Your streaming history from this session"
            icon={<History className="w-5 h-5 text-slate-400" />}
            items={recentlyWatched}
            onPlay={handlePlayContent}
            onDetails={(item) => setDetailItem(item)}
            isInList={isInMyList}
            onToggleList={toggleMyList}
          />
        )}

        {/* SECTION 9: MY SAVED FAVORITES */}
        {myList.length > 0 && (
          <ContentRow
            title="Your Favorites"
            subtitle="Saved channels, cinema films and episodes"
            icon={<Bookmark className="w-5 h-5 text-cyan-400" />}
            items={myList}
            onPlay={handlePlayContent}
            onDetails={(item) => setDetailItem(item)}
            isInList={isInMyList}
            onToggleList={toggleMyList}
          />
        )}

      </main>

      {/* Footer with Device Compatibility Matrix */}
      <AppFooter onOpenAccount={() => setIsAccountOpen(true)} />

      {/* MODALS & DRAWERS */}
      
      {/* 1. Full HLS Video Player Modal */}
      <VideoPlayerModal
        item={playingItem}
        onClose={() => setPlayingItem(null)}
        onSelectChannel={(ch) => setPlayingItem(ch)}
      />

      {/* 2. Item Details Modal */}
      <ItemDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onPlay={handlePlayContent}
        isInList={detailItem ? isInMyList(detailItem.id) : false}
        onToggleList={toggleMyList}
      />

      {/* 3. Xtream Line Account Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      {/* 4. Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPlay={handlePlayContent}
        onDetails={(item) => setDetailItem(item)}
      />

      {/* 5. Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* 6. Favorites Drawer */}
      <MyListDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        items={myList}
        onPlay={handlePlayContent}
        onRemove={(id) => setMyList((prev) => prev.filter((i) => i.id !== id))}
      />

      {/* 7. Super Admin Control Panel Modal */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          onSelectChannelForPlayer={(c) => {
            handlePlayChannelRecord(c);
            setIsAdminOpen(false);
          }}
        />
      )}

    </div>
  );
}

export default App;
