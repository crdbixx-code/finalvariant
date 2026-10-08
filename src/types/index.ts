export type ContentType = 'movie' | 'series' | 'live_tv' | 'sports' | 'music' | 'kids';

export interface ContentItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: ContentType;
  poster: string;
  backdrop: string;
  genres: string[];
  rating: number; // e.g. 8.9
  year: number;
  duration?: string; // e.g. "2h 18m" or "3 Seasons"
  quality: '4K UHD' | 'FHD 1080p' | 'HD 720p' | 'SD';
  audio?: string; // e.g. "Dolby Atmos 5.1"
  description: string;
  cast?: string[];
  director?: string;
  trailerUrl?: string;
  streamUrl?: string;
  progress?: number; // 0 to 100 for continue watching
  channelNumber?: string;
  currentShow?: string;
  nextShow?: string;
  badge?: string; // e.g. "Top 10", "Trending", "Exclusive"
}

export interface LiveSportsMatch {
  id: string;
  league: string;
  leagueIcon?: string;
  sport: 'football' | 'cricket' | 'basketball' | 'tennis' | 'racing' | 'mma';
  homeTeam: {
    name: string;
    logo: string;
    score?: string | number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score?: string | number;
  };
  status: 'LIVE' | 'UPCOMING' | 'HALF_TIME';
  time: string; // "78'" or "20:45 Today"
  streamUrl?: string;
  channelName: string;
  channelLogo: string;
  viewers: string;
  hot?: boolean;
}

export interface ChannelCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface XtreamAccountInfo {
  host: string;
  user: string;
  pass: string;
  packageName: string;
  renewalDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TRIAL';
  activeConnections: number;
  maxConnections: number;
  appUrl: string;
  cpanelUrl: string;
  serverPingMs: number;
  m3uUrl: string;
}
