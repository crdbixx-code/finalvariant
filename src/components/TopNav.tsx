import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Search, 
  Bell, 
  Bookmark, 
  User, 
  Wifi, 
  SlidersHorizontal,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ACCOUNT_INFO } from '../data/mockData';

export type NavTab = 'home' | 'live_tv' | 'movies' | 'series' | 'sports' | 'music' | 'kids' | 'genres';

interface TopNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenFavorites: () => void;
  onOpenProfile: () => void;
  favoritesCount: number;
  unreadNotificationsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenNotifications,
  onOpenFavorites,
  onOpenProfile,
  favoritesCount,
  unreadNotificationsCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'live_tv', label: 'Live TV' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'sports', label: 'Sports' },
    { id: 'music', label: 'Music' },
    { id: 'kids', label: 'Kids' },
    { id: 'genres', label: 'Genres' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050811]/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-[#050811]/95 via-[#050811]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-cyan-500 p-[1.5px] shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#070b16] rounded-[10px] flex items-center justify-center">
                <Tv className="w-5 h-5 text-amber-400 transition-colors group-hover:text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent font-['Outfit']">
                PLAYBEAT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-cyan-400/90 -mt-1 flex items-center gap-1">
                LUXE IPTV <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 text-sm font-medium transition-all duration-200 rounded-md relative cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Server Connection Badge (Live indicator) */}
          <div 
            onClick={onOpenProfile}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 text-xs transition-colors cursor-pointer"
            title="Active Xtream Line: Connected"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-mono text-[11px]">{ACCOUNT_INFO.serverPingMs}ms</span>
            <span className="text-white/40">·</span>
            <span className="text-amber-300 font-mono text-[11px] font-semibold">{ACCOUNT_INFO.user}</span>
          </div>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search catalog"
            className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            aria-label="Favorites & My List"
            className="relative w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-black flex items-center justify-center shadow-lg">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Profile / Account Button */}
          <button
            onClick={onOpenProfile}
            aria-label="Account and Xtream line details"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
              <User className="w-4 h-4 text-slate-950" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-100 group-hover:text-amber-300 leading-tight">
                VIP Family
              </span>
              <span className="text-[10px] text-emerald-400 leading-tight">
                Active 2026
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-Navigation Bar */}
      <div className="xl:hidden max-w-7xl mx-auto px-4 pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
