import express, { Request, Response } from 'express';
import { db } from './database';
import { importer } from './importer';

export const apiRouter = express.Router();

/**
 * 1. Global / Dynamic Stats (Rule 32: Dynamic Channel Count)
 */
apiRouter.get('/stats', (req: Request, res: Response) => {
  const stats = db.getAdminStats();
  res.json({
    totalChannels: stats.totalChannels,
    verifiedActiveChannels: stats.activeChannels,
    activeViewers: stats.concurrentViewers,
    providersCount: stats.totalProviders,
    totalMovies: stats.totalMovies,
    totalSeries: stats.totalSeries,
    totalDramas: stats.totalDramas,
    totalSportsFeeds: stats.totalSportsFeeds,
    uptimeSeconds: stats.serverUptimeSeconds,
    dbEngine: stats.dbEngine,
  });
});

/**
 * 2. Channels Query (Server-side Pagination & Filtering for 13,000+ Channels)
 */
apiRouter.get('/channels', (req: Request, res: Response) => {
  const {
    country,
    region,
    category,
    language,
    quality,
    health,
    search,
    sortBy,
    limit,
    offset
  } = req.query;

  const result = db.queryChannels({
    countryCode: country as string,
    region: region as string,
    category: category as string,
    language: language as string,
    quality: quality as string,
    health: health as any,
    search: search as string,
    sortBy: sortBy as any,
    limit: limit ? parseInt(limit as string, 10) : 36,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  res.json(result);
});

apiRouter.get('/channels/:id', (req: Request, res: Response) => {
  const channel = db.getChannelById(String(req.params.id));
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  res.json(channel);
});

/**
 * 3. Hot Live TV (Ranked by Real Database Metrics)
 */
apiRouter.get('/hot', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
  const items = db.getHotLiveTV(limit);
  res.json({ items });
});

/**
 * 4. Electronic Program Guide (EPG)
 */
apiRouter.get('/epg/:channelId', (req: Request, res: Response) => {
  const channelId = String(req.params.channelId);
  const schedule = db.getEPGForChannel(channelId);
  res.json({ channelId, schedule });
});

/**
 * 5. Categories Taxonomy
 */
apiRouter.get('/categories', (req: Request, res: Response) => {
  res.json({
    categories: [
      { id: 'all', name: 'All Categories', icon: 'Tv' },
      { id: 'Sports', name: 'Live Sports', icon: 'Trophy' },
      { id: 'News', name: 'Live News', icon: 'Radio' },
      { id: 'General Entertainment', name: 'General Entertainment', icon: 'Film' },
      { id: 'Movies', name: 'Movies & Cinema', icon: 'Film' },
      { id: 'Music', name: 'Music TV', icon: 'Music' },
      { id: 'Kids', name: 'Kids & Family', icon: 'Sparkles' },
      { id: 'Documentary', name: 'Documentary & Nature', icon: 'Compass' }
    ]
  });
});

/**
 * 6. Countries Taxonomy
 */
apiRouter.get('/countries', (req: Request, res: Response) => {
  res.json({
    countries: [
      { code: 'PK', name: 'Pakistan', region: 'Middle East & South Asia' },
      { code: 'GB', name: 'United Kingdom', region: 'Europe' },
      { code: 'US', name: 'United States', region: 'North America' },
      { code: 'IN', name: 'India', region: 'South Asia' },
      { code: 'AE', name: 'United Arab Emirates', region: 'Middle East' },
      { code: 'SA', name: 'Saudi Arabia', region: 'Middle East' },
      { code: 'TR', name: 'Turkey', region: 'Middle East' },
      { code: 'DE', name: 'Germany', region: 'Europe' },
      { code: 'FR', name: 'France', region: 'Europe' },
      { code: 'CA', name: 'Canada', region: 'North America' },
      { code: 'AU', name: 'Australia', region: 'Australia & Pacific' },
      { code: 'BD', name: 'Bangladesh', region: 'South Asia' },
      { code: 'WW', name: 'Global International', region: 'Global' }
    ]
  });
});

/**
 * 7. Licensed Movies
 */
apiRouter.get('/movies', (req: Request, res: Response) => {
  const { genre, search } = req.query;
  const items = db.getAllMovies({ genre: genre as string, search: search as string });
  res.json({ items, total: items.length });
});

/**
 * 8. Web Series
 */
apiRouter.get('/series', (req: Request, res: Response) => {
  const items = db.getAllSeries();
  res.json({ items, total: items.length });
});

/**
 * 9. Dramas (Pakistani, Turkish, Korean, Indian)
 */
apiRouter.get('/dramas', (req: Request, res: Response) => {
  const origin = req.query.origin as string;
  const items = db.getAllDramas(origin);
  res.json({ items, total: items.length });
});

/**
 * 10. Sports Stadium Feeds
 */
apiRouter.get('/sports', (req: Request, res: Response) => {
  const items = db.getAllSportsEvents();
  res.json({ items, total: items.length });
});

/**
 * 11. Global Search
 */
apiRouter.get('/search', (req: Request, res: Response) => {
  const q = (req.query.q as string || '').toLowerCase().trim();
  if (!q) {
    return res.json({ channels: [], movies: [], series: [], dramas: [] });
  }

  const channels = db.queryChannels({ search: q, limit: 12 }).items;
  const movies = db.getAllMovies({ search: q }).slice(0, 8);
  const series = db.getAllSeries().filter(s => s.title.toLowerCase().includes(q));
  const dramas = db.getAllDramas().filter(d => d.title.toLowerCase().includes(q) || d.cast.some(c => c.toLowerCase().includes(q)));

  res.json({ channels, movies, series, dramas });
});

// ==========================================
// SUPER ADMIN MODULES
// ==========================================

/**
 * Admin Stats
 */
apiRouter.get('/admin/stats', (req: Request, res: Response) => {
  const stats = db.getAdminStats();
  res.json(stats);
});

/**
 * Admin: Provider Management
 */
apiRouter.get('/admin/providers', (req: Request, res: Response) => {
  const providers = db.getAllProviders();
  res.json({ providers });
});

/**
 * Admin: Channel Import Pipeline (M3U / JSON / CSV)
 */
apiRouter.post('/admin/import', (req: Request, res: Response) => {
  const { format, content, providerId } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Empty import payload' });
  }

  try {
    let report;
    if (format === 'json') {
      report = importer.parseJSON(content, providerId);
    } else {
      // Default to M3U / M3U8
      report = importer.parseM3U(content, providerId);
    }
    res.json(report);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Import parsing error' });
  }
});

/**
 * Admin: Publish Verified Channels from Import Review
 */
apiRouter.post('/admin/channels/publish', (req: Request, res: Response) => {
  const { records, providerId } = req.body;
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Missing records list' });
  }

  const publishedCount = importer.commitVerifiedChannels(records, providerId);
  res.json({
    success: true,
    publishedCount,
    totalChannelsNow: db.getChannelCount()
  });
});

/**
 * Admin: Stream Verification & Health Diagnostic
 */
apiRouter.post('/admin/channels/:id/verify', (req: Request, res: Response) => {
  try {
    const channelId = String(req.params.id);
    const result = db.verifyStreamHealth(channelId);
    res.json({ channelId, ...result });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * Admin: Update Content Rights
 */
apiRouter.post('/admin/channels/:id/rights', (req: Request, res: Response) => {
  const channelId = String(req.params.id);
  const { rightsStatus, licenseExpirationDate } = req.body;
  db.updateChannelRights(channelId, rightsStatus, licenseExpirationDate);
  res.json({ success: true, channelId, rightsStatus, licenseExpirationDate });
});
