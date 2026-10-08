export type StreamProtocol = 'HLS' | 'DASH' | 'HTTP' | 'RTSP';
export type QualityResolution = '4K UHD' | 'FHD 1080p' | 'HD 720p' | 'SD';
export type StreamHealthStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'UNVERIFIED';
export type RightsStatus = 'Pending' | 'Verified' | 'Active' | 'Expiring Soon' | 'Expired' | 'Restricted' | 'Suspended';
export type ProviderHealthStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export interface ChannelRecord {
  id: string;                      // Unique Channel ID, e.g. "CH-PK-0101"
  name: string;                    // Display name, e.g. "BBC One HD"
  officialName: string;            // Canonical official name, e.g. "BBC One"
  country: string;                 // e.g. "United Kingdom"
  countryCode: string;             // ISO 2-letter, e.g. "GB"
  region: string;                  // e.g. "Europe", "Middle East", "South Asia"
  language: string;                // e.g. "English", "Urdu", "Arabic"
  category: string;                // "General Entertainment", "News", "Sports", "Movies", "Music", "Kids", "Documentary"
  subcategory: string;             // "Public", "Football", "24/7 News", "Animation"
  logo: string;                    // Verified logo URL or placeholder
  banner: string;                  // Backdrop image
  description: string;
  streamUrl: string;               // Primary stream URL
  backupStreamUrl?: string;        // Redundant stream URL
  streamProtocol: StreamProtocol;
  resolution: QualityResolution;
  bitrate: number;                 // kbps, e.g. 14500
  audioLanguage: string;
  subtitleLanguages: string[];
  epgChannelId: string;
  epgSource: string;
  currentProgram: string;
  nextProgram: string;
  programStartTime: string;        // ISO 8601
  programEndTime: string;          // ISO 8601
  timeZone: string;                // e.g. "UTC+0", "UTC+5"
  qualityStatus: '4K' | 'Full HD' | 'HD' | 'SD';
  isLive: boolean;
  isActive: boolean;
  geographicAvailability: string[];// e.g. ["WW"] or ["GB", "PK"]
  rightsStatus: RightsStatus;
  licenseStartDate: string;        // YYYY-MM-DD
  licenseExpirationDate: string;   // YYYY-MM-DD
  providerId: string;
  providerName: string;
  lastVerificationTimestamp: string;
  streamHealth: StreamHealthStatus;
  httpStatus: number;
  responseTimeMs: number;
  lastSuccessfulPlayback: string;
  failureCount: number;
  
  // Real Analytics & Ranking Metrics (Hot Live TV)
  currentViewers: number;
  playbackStarts: number;
  watchTimeMinutes: number;
  trendingVelocity: number;        // calculated score
  favoritesCount: number;
  searchFrequency: number;
}

export interface ContentProvider {
  id: string;
  name: string;
  apiFeedUrl: string;
  authConfig: {
    type: 'API_KEY' | 'BEARER' | 'XTREAM' | 'IP_WHITELIST';
    tokenMasked: string;
  };
  playlistSource: string;
  epgSource: string;
  metadataSource: string;
  countryCoverage: string[];
  rightsDocumentation: string;
  licenseStatus: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'RESTRICTED';
  licenseStartDate: string;
  licenseExpiryDate: string;
  contactInfo: string;
  priority: number;
  backupSource: string;
  healthStatus: ProviderHealthStatus;
  channelsCount: number;
}

export interface EPGProgram {
  id: string;
  channelId: string;
  title: string;
  description: string;
  poster?: string;
  startTime: string;               // ISO
  endTime: string;                 // ISO
  durationMinutes: number;
  genre: string;
  country: string;
  language: string;
  rating?: string;
}

export interface MovieRecord {
  id: string;
  officialTitle: string;
  originalTitle: string;
  poster: string;
  backdrop: string;
  trailer?: string;
  description: string;
  releaseYear: number;
  runtimeMinutes: number;
  genre: string;
  country: string;
  language: string;
  audioLanguages: string[];
  subtitleLanguages: string[];
  cast: string[];
  director: string;
  rating: number;
  contentProvider: string;
  rightsStatus: RightsStatus;
  licenseTerritory: string[];
  licenseStart: string;
  licenseExpiry: string;
  streamUrl: string;
  downloadRestriction: boolean;
  drmStatus: 'NONE' | 'WIDEVINE' | 'FAIRPLAY';
}

export interface WebSeriesRecord {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  description: string;
  genre: string;
  country: string;
  language: string;
  rating: number;
  releaseYear: number;
  contentProvider: string;
  rightsStatus: RightsStatus;
  seasons: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
      title: string;
      description: string;
      thumbnail: string;
      duration: string;
      releaseDate: string;
      audio: string;
      subtitles: string[];
      streamUrl: string;
      rightsStatus: RightsStatus;
    }[];
  }[];
}

export interface DramaRecord {
  id: string;
  title: string;
  origin: 'Pakistani' | 'Indian' | 'Turkish' | 'Korean' | 'Arabic' | 'International';
  poster: string;
  backdrop: string;
  synopsis: string;
  cast: string[];
  director: string;
  language: string;
  subtitles: string[];
  releaseDate: string;
  totalEpisodes: number;
  seasonCount: number;
  rating: number;
  rightsStatus: RightsStatus;
  streamUrl: string;
}

export interface SportsEventRecord {
  id: string;
  title: string;
  league: string;
  sport: 'Football' | 'Cricket' | 'Tennis' | 'Basketball' | 'Motorsport' | 'Golf' | 'Boxing' | 'MMA' | 'Athletics';
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  score?: string;
  startTime: string;
  channelId: string;
  channelName: string;
  viewers: number;
  streamUrl: string;
  rightsStatus: RightsStatus;
}

export interface ChannelImportReport {
  id: string;
  importedAt: string;
  sourceType: 'M3U' | 'M3U8' | 'XMLTV' | 'JSON' | 'CSV';
  totalRecords: number;
  validCount: number;
  duplicateCount: number;
  invalidCount: number;
  unverifiedCount: number;
  rightsMissingCount: number;
  logoMissingCount: number;
  epgMissingCount: number;
  streamOfflineCount: number;
  status: 'PENDING_REVIEW' | 'REVIEWED' | 'PUBLISHED' | 'REJECTED';
  records: Array<{
    channelName: string;
    normalizedName: string;
    streamUrl: string;
    country: string;
    category: string;
    validationStatus: 'VALID' | 'DUPLICATE' | 'INVALID' | 'UNVERIFIED' | 'RIGHTS_MISSING';
    notes: string;
  }>;
}

export interface SuperAdminDashboardStats {
  totalChannels: number;
  activeChannels: number;
  offlineChannels: number;
  verifiedChannels: number;
  pendingChannels: number;
  expiringRightsCount: number;
  totalMovies: number;
  totalSeries: number;
  totalDramas: number;
  totalMusicItems: number;
  totalSportsFeeds: number;
  totalNewsFeeds: number;
  totalProviders: number;
  totalEPGRecords: number;
  activeUsers: number;
  concurrentViewers: number;
  playbackSessionsTotal: number;
  serverUptimeSeconds: number;
  dbEngine: string;
}
