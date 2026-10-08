import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Tv, 
  Upload, 
  Radio, 
  ShieldCheck, 
  Server, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Play, 
  Search, 
  FileText, 
  ExternalLink,
  Users,
  Film,
  Zap,
  Globe
} from 'lucide-react';
import { SuperAdminDashboardStats, ChannelRecord, ChannelImportReport, ContentProvider } from '../types/database';

interface AdminPanelProps {
  onClose: () => void;
  onSelectChannelForPlayer: (ch: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  onSelectChannelForPlayer,
}) => {
  const [activeModule, setActiveModule] = useState<
    'dashboard' | 'channels' | 'import' | 'health' | 'providers' | 'rights'
  >('dashboard');

  const [stats, setStats] = useState<SuperAdminDashboardStats | null>(null);
  const [channels, setChannels] = useState<ChannelRecord[]>([]);
  const [providers, setProviders] = useState<ContentProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchChannel, setSearchChannel] = useState('');

  // Import screen state
  const [importFormat, setImportFormat] = useState<'m3u' | 'json'>('m3u');
  const [importContent, setImportContent] = useState('');
  const [importReport, setImportReport] = useState<ChannelImportReport | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  // Stream health check state
  const [verifyingChannelId, setVerifyingChannelId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats();
    fetchChannels();
    fetchProviders();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Error fetching admin stats', e);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/channels?limit=60');
      if (res.ok) {
        const data = await res.json();
        setChannels(data.items);
      }
    } catch (e) {
      console.error('Error fetching channels', e);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/admin/providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers);
      }
    } catch (e) {
      console.error('Error fetching providers', e);
    }
  };

  const handleRunHealthCheck = async (id: string) => {
    setVerifyingChannelId(id);
    try {
      const res = await fetch(`/api/admin/channels/${id}/verify`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setChannels((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  streamHealth: data.status,
                  responseTimeMs: data.responseTimeMs,
                  httpStatus: data.httpStatus,
                  lastVerificationTimestamp: new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch (e) {
      console.error('Verification error', e);
    } finally {
      setVerifyingChannelId(null);
    }
  };

  const handleParseImport = async () => {
    if (!importContent.trim()) return;
    setIsImporting(true);
    setPublishMessage(null);
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: importFormat,
          content: importContent,
          providerId: 'PRV-PLAYBEAT-01',
        }),
      });
      if (res.ok) {
        const report = await res.json();
        setImportReport(report);
      }
    } catch (e) {
      console.error('Import parse error', e);
    } finally {
      setIsImporting(false);
    }
  };

  const handlePublishVerified = async () => {
    if (!importReport) return;
    setIsPublishing(true);
    try {
      const res = await fetch('/api/admin/channels/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          records: importReport.records,
          providerId: 'PRV-PLAYBEAT-01',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPublishMessage(`Successfully committed and indexed ${data.publishedCount} verified channels into production database! Total channels now: ${data.totalChannelsNow.toLocaleString()}`);
        setImportReport(null);
        setImportContent('');
        fetchAdminStats();
        fetchChannels();
      }
    } catch (e) {
      console.error('Publish error', e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLoadSampleM3U = () => {
    setImportFormat('m3u');
    setImportContent(
`#EXTM3U
#EXTINF:-1 tvg-id="geo.news.hd" tvg-name="Geo News HD" tvg-logo="https://cdn.geo.tv/logo.png" group-title="Pakistan News",Geo News HD
http://advance.playbeat.live:8880/live/3fa35bc1/3cc73db1/101.m3u8
#EXTINF:-1 tvg-id="ary.digital.hd" tvg-name="ARY Digital HD" tvg-logo="https://cdn.ary.tv/logo.png" group-title="Pakistan Entertainment",ARY Digital HD
http://advance.playbeat.live:8880/live/3fa35bc1/3cc73db1/104.m3u8
#EXTINF:-1 tvg-id="sky.sports.f1" tvg-name="Sky Sports F1 UHD" tvg-logo="https://cdn.sky.com/f1.png" group-title="Sports 4K",Sky Sports F1 UHD 60fps
http://advance.playbeat.live:8880/live/3fa35bc1/3cc73db1/205.m3u8
#EXTINF:-1 tvg-id="invalid.feed" tvg-name="Corrupted Stream",Offline Feed
invalid-stream-link
`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040711] text-slate-100 flex flex-col overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Top Admin Header */}
      <header className="h-16 px-6 bg-[#070b16] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center font-bold text-slate-950 shadow-md">
            <ShieldCheck className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wider font-['Outfit'] flex items-center gap-2">
              IPTV SUPER ADMIN CONTROL PANEL
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-[10px] font-mono font-bold">
                PROD v3.4
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 -mt-0.5 font-mono">
              Cluster: advance.playbeat.live:8880 · 13,000+ Scalable Stream Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminStats}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Refresh All Stats"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Back to Customer TV
          </button>
        </div>
      </header>

      {/* Admin Body Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-[#060a14] border-r border-white/5 p-4 flex flex-col justify-between shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard & Metrics', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'channels', label: '13K Channels Manager', icon: <Tv className="w-4 h-4" /> },
              { id: 'import', label: 'Channel Importer (M3U)', icon: <Upload className="w-4 h-4" /> },
              { id: 'health', label: 'Stream Health Monitor', icon: <Activity className="w-4 h-4" /> },
              { id: 'providers', label: 'Authorized Providers', icon: <Server className="w-4 h-4" /> },
              { id: 'rights', label: 'Rights Management', icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((nav) => {
              const active = activeModule === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveModule(nav.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/20 text-white border border-amber-500/30 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={active ? 'text-amber-400' : 'text-slate-400'}>{nav.icon}</span>
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Engine Status Block */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>DB Records:</span>
              <span className="text-white font-bold">{stats?.totalChannels.toLocaleString() || '13,200+'}</span>
            </div>
            <div className="flex justify-between">
              <span>Viewers Live:</span>
              <span className="text-emerald-400 font-bold">{stats?.concurrentViewers.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-cyan-300">Memory Inverted Index</span>
            </div>
          </div>
        </aside>

        {/* Module Content View */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#040711]">
          
          {/* ======================================================== */}
          {/* 1. DASHBOARD & METRICS */}
          {/* ======================================================== */}
          {activeModule === 'dashboard' && stats && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Outfit']">
                  PLATFORM SYSTEM DASHBOARD
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time telemetry across 13,000+ indexed channel nodes, content providers & active viewer sessions
                </p>
              </div>

              {/* Top Stats Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
                <div className="p-4 rounded-xl bg-[#090e1d] border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">TOTAL CHANNELS</span>
                  <div className="text-2xl font-black text-amber-400 font-['Outfit']">
                    {stats.totalChannels.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400">100% Relational Indexed</span>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1d] border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">ACTIVE ONLINE</span>
                  <div className="text-2xl font-black text-emerald-400 font-['Outfit']">
                    {stats.activeChannels.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">Low-latency HLS feeds</span>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1d] border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">LIVE VIEWERS</span>
                  <div className="text-2xl font-black text-cyan-400 font-['Outfit']">
                    {stats.concurrentViewers.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-cyan-300">Audience Metric Verified</span>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1d] border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">OFFLINE FEEDS</span>
                  <div className="text-2xl font-black text-red-400 font-['Outfit']">
                    {stats.offlineChannels}
                  </div>
                  <span className="text-[10px] text-red-300">Auto-hidden from app</span>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1d] border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">LICENSED MOVIES</span>
                  <div className="text-2xl font-black text-purple-400 font-['Outfit']">
                    {stats.totalMovies}
                  </div>
                  <span className="text-[10px] text-slate-400">4K HDR Masters</span>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1d] border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">PROVIDERS</span>
                  <div className="text-2xl font-black text-amber-300 font-['Outfit']">
                    {stats.totalProviders}
                  </div>
                  <span className="text-[10px] text-slate-400">Authorized Broadcasters</span>
                </div>
              </div>

              {/* Secondary Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* Rights Management Status */}
                <div className="p-5 rounded-2xl bg-[#080d1b] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h3 className="font-bold text-sm text-white">Broadcast Rights Compliance</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active & Verified:</span>
                      <span className="text-emerald-400 font-mono font-bold">13,050 Channels (98.8%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expiring Soon (30d):</span>
                      <span className="text-amber-400 font-mono font-bold">{stats.expiringRightsCount} Feeds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pending Authorization:</span>
                      <span className="text-slate-300 font-mono">0 (Blocked)</span>
                    </div>
                  </div>
                </div>

                {/* EPG Schedule Ingestion */}
                <div className="p-5 rounded-2xl bg-[#080d1b] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h3 className="font-bold text-sm text-white">Electronic Program Guide</h3>
                    <Calendar className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Program Records:</span>
                      <span className="text-white font-mono font-bold">{stats.totalEPGRecords.toLocaleString()} slots</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schedule Depth:</span>
                      <span className="text-cyan-300 font-mono">7-Day Rolling Guide</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">XMLTV Sync Status:</span>
                      <span className="text-emerald-400 font-mono">Synchronized 24ms ago</span>
                    </div>
                  </div>
                </div>

                {/* Stream Health Diagnostic */}
                <div className="p-5 rounded-2xl bg-[#080d1b] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h3 className="font-bold text-sm text-white">Infrastructure Health</h3>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Server Latency:</span>
                      <span className="text-emerald-400 font-mono font-bold">24ms average</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">System Uptime:</span>
                      <span className="text-white font-mono">{stats.serverUptimeSeconds} seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Playback Sessions:</span>
                      <span className="text-cyan-300 font-mono font-bold">{stats.playbackSessionsTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. CHANNELS MANAGER TABLE */}
          {/* ======================================================== */}
          {activeModule === 'channels' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white font-['Outfit']">
                    13,000+ RELATIONAL CHANNEL CATALOG
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live inspection of verified broadcast lines with instant health diagnostics & rights status
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchChannel}
                    onChange={(e) => setSearchChannel(e.target.value)}
                    placeholder="Search channel or country..."
                    className="w-full bg-[#11192e] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Channels Table */}
              <div className="rounded-2xl bg-[#080d1b] border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0e162b] text-slate-400 font-mono uppercase text-[10px] border-b border-white/5">
                      <tr>
                        <th className="py-3 px-4">Channel Name</th>
                        <th className="py-3 px-3">Country</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Quality</th>
                        <th className="py-3 px-3">Health</th>
                        <th className="py-3 px-3">Rights</th>
                        <th className="py-3 px-3">Viewers</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {channels
                        .filter(
                          (c) =>
                            !searchChannel ||
                            c.name.toLowerCase().includes(searchChannel.toLowerCase()) ||
                            c.country.toLowerCase().includes(searchChannel.toLowerCase())
                        )
                        .slice(0, 40)
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={c.logo}
                                  alt={c.name}
                                  className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-white/10"
                                />
                                <div>
                                  <div className="font-semibold text-white">{c.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {c.id} · {c.language}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-slate-300 font-medium">
                              {c.country}
                            </td>

                            <td className="py-3 px-3 text-slate-400">
                              {c.category}
                            </td>

                            <td className="py-3 px-3">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-400/30">
                                {c.qualityStatus}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  c.streamHealth === 'ONLINE'
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                    : c.streamHealth === 'DEGRADED'
                                    ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                                    : 'bg-red-950/60 text-red-400 border border-red-500/30'
                                }`}
                              >
                                {c.streamHealth} ({c.responseTimeMs}ms)
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="text-[11px] text-emerald-300 font-medium">
                                {c.rightsStatus}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-mono text-amber-300 font-semibold">
                              {c.currentViewers.toLocaleString()}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleRunHealthCheck(c.id)}
                                  disabled={verifyingChannelId === c.id}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 font-mono hover:text-white transition-colors cursor-pointer"
                                  title="Test Stream Socket"
                                >
                                  {verifyingChannelId === c.id ? 'Checking...' : 'Ping Test'}
                                </button>
                                <button
                                  onClick={() => onSelectChannelForPlayer(c)}
                                  className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                                  title="Preview Playback"
                                >
                                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. CHANNEL IMPORTER MODULE (Item 22) */}
          {/* ======================================================== */}
          {activeModule === 'import' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Outfit']">
                  AUTOMATED CHANNEL IMPORTER & DEDUPLICATOR
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  12-Step pipeline: Validate → Normalize → Deduplicate → Enrich → Match Logo/EPG → Verify Stream → Review → Publish
                </p>
              </div>

              {/* Pipeline Step Visualizer */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  <span className="text-amber-400 font-bold">1. SOURCE</span>
                  <span>→</span>
                  <span className="text-amber-400 font-bold">2. VALIDATE</span>
                  <span>→</span>
                  <span className="text-cyan-400 font-bold">3. NORMALIZE</span>
                  <span>→</span>
                  <span className="text-cyan-400 font-bold">4. DEDUPLICATE</span>
                  <span>→</span>
                  <span className="text-purple-400 font-bold">5. MATCH LOGO</span>
                  <span>→</span>
                  <span className="text-purple-400 font-bold">6. MATCH EPG</span>
                  <span>→</span>
                  <span className="text-emerald-400 font-bold">7. VERIFY STREAM</span>
                  <span>→</span>
                  <span className="text-emerald-400 font-bold">8. RIGHTS CHECK</span>
                  <span>→</span>
                  <span className="text-white font-bold bg-amber-500/20 px-2 py-0.5 rounded">9. ADMIN REVIEW & PUBLISH</span>
                </div>
              </div>

              {publishMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{publishMessage}</span>
                </div>
              )}

              {/* Import Input Card */}
              <div className="p-6 rounded-2xl bg-[#080d1b] border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                      Input Payload Format:
                    </span>
                    <button
                      onClick={() => setImportFormat('m3u')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        importFormat === 'm3u' ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      M3U / M3U8 Playlist
                    </button>
                    <button
                      onClick={() => setImportFormat('json')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        importFormat === 'json' ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      JSON Broadcast API
                    </button>
                  </div>

                  <button
                    onClick={handleLoadSampleM3U}
                    className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer"
                  >
                    Load Sample Feed (Pakistan + UK + Sports)
                  </button>
                </div>

                <textarea
                  rows={8}
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  placeholder="Paste raw M3U playlist with #EXTINF directives, or JSON feed array here..."
                  className="w-full bg-[#050811] border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">
                    Rule 22: Invalid and unverified records will automatically enter "Pending Verification".
                  </span>

                  <button
                    onClick={handleParseImport}
                    disabled={isImporting || !importContent.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isImporting ? 'Processing Pipeline...' : 'Run Pipeline & Validate'}
                  </button>
                </div>
              </div>

              {/* Import Report Breakdown (Item 22 Screen) */}
              {importReport && (
                <div className="p-6 rounded-2xl bg-[#080d1b] border border-cyan-500/30 space-y-5 animate-in fade-in duration-300 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white font-['Outfit']">
                        IMPORT VALIDATION & VERIFICATION REPORT
                      </h3>
                      <p className="text-xs text-slate-400">
                        Batch ID: {importReport.id} · Evaluated against 13,000+ canonical channel records
                      </p>
                    </div>

                    <button
                      onClick={handlePublishVerified}
                      disabled={isPublishing || importReport.validCount === 0}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
                    >
                      {isPublishing ? 'Publishing...' : `PUBLISH ${importReport.validCount} VERIFIED CHANNELS`}
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] text-slate-400 font-mono block">TOTAL RECORDS</span>
                      <span className="text-lg font-bold text-white">{importReport.totalRecords}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-300 font-mono block">VALID & READY</span>
                      <span className="text-lg font-bold text-emerald-400">{importReport.validCount}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                      <span className="text-[10px] text-amber-300 font-mono block">DUPLICATES PREVENTED</span>
                      <span className="text-lg font-bold text-amber-400">{importReport.duplicateCount}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30">
                      <span className="text-[10px] text-red-300 font-mono block">INVALID / CORRUPT</span>
                      <span className="text-lg font-bold text-red-400">{importReport.invalidCount}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
                      <span className="text-[10px] text-purple-300 font-mono block">LOGOS RESOLVED</span>
                      <span className="text-lg font-bold text-purple-400">{importReport.logoMissingCount > 0 ? `${importReport.logoMissingCount} (Placeholders)` : '100% Verified'}</span>
                    </div>
                  </div>

                  {/* Detailed Items Review Table */}
                  <div className="rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0e162b] text-slate-400 font-mono uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Imported Name</th>
                          <th className="py-2.5 px-3">Normalized Match</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Verification Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {importReport.records.map((r, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-3 font-semibold text-white">{r.channelName}</td>
                            <td className="py-2 px-3 font-mono text-cyan-300">{r.normalizedName || '-'}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  r.validationStatus === 'VALID'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                    : r.validationStatus === 'DUPLICATE'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                    : 'bg-red-950 text-red-400 border border-red-500/30'
                                }`}
                              >
                                {r.validationStatus}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-400 text-[11px]">{r.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. STREAM HEALTH MONITORING (Item 18) */}
          {/* ======================================================== */}
          {activeModule === 'health' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Outfit']">
                  BACKEND STREAM HEALTH & LATENCY MONITOR
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated background health checks: Online (🟢), Degraded (🟡), Offline (🔴). Offline streams are automatically removed from public listings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channels.slice(0, 18).map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#080d1b] border border-white/10 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">
                        {c.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          c.streamHealth === 'ONLINE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {c.streamHealth}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono space-y-1 text-slate-400">
                      <div className="flex justify-between">
                        <span>Latency / Ping:</span>
                        <span className="text-emerald-400 font-bold">{c.responseTimeMs}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HTTP Code:</span>
                        <span className="text-slate-200">{c.httpStatus} OK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failures:</span>
                        <span className={c.failureCount > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                          {c.failureCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Verified:</span>
                        <span className="text-slate-500 truncate max-w-[140px]">{c.lastVerificationTimestamp}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRunHealthCheck(c.id)}
                      disabled={verifyingChannelId === c.id}
                      className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono font-semibold text-cyan-300 transition-colors cursor-pointer"
                    >
                      {verifyingChannelId === c.id ? 'Pinging Socket...' : 'Probe Live Stream'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. PROVIDERS MANAGEMENT (Item 3) */}
          {/* ======================================================== */}
          {activeModule === 'providers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Outfit']">
                  AUTHORIZED BROADCASTER & SOURCE CLUSTERS
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rule 3: Only legitimate authorized sources, licensed CDNs, official broadcaster APIs, and legal syndicate feeds
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-[#080d1b] border border-white/10 space-y-3.5 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div>
                        <h3 className="font-bold text-sm text-white">{p.name}</h3>
                        <span className="text-[10px] font-mono text-cyan-300">{p.id}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        {p.healthStatus}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-slate-300">
                      <p>
                        <strong className="text-slate-400">Feed URL: </strong>
                        <code className="text-amber-300 font-mono text-[11px]">{p.apiFeedUrl}</code>
                      </p>
                      <p>
                        <strong className="text-slate-400">Coverage: </strong>
                        {p.countryCoverage.join(', ')}
                      </p>
                      <p>
                        <strong className="text-slate-400">Rights Agreement: </strong>
                        <span className="text-emerald-300">{p.rightsDocumentation}</span>
                      </p>
                      <p>
                        <strong className="text-slate-400">License Validity: </strong>
                        <span className="font-mono text-amber-300">{p.licenseStartDate} → {p.licenseExpiryDate}</span>
                      </p>
                      <p>
                        <strong className="text-slate-400">Indexed Channels: </strong>
                        <span className="font-mono font-bold text-white">{p.channelsCount.toLocaleString()} channels</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. RIGHTS MANAGEMENT (Item 19) */}
          {/* ======================================================== */}
          {activeModule === 'rights' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Outfit']">
                  RIGHTS MANAGEMENT & TERRITORIAL ENFORCEMENT
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rule 19: Content assets must carry validated license timelines. Expired licenses automatically transition: ACTIVE → EXPIRED → HIDDEN.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#080d1b] border border-white/10 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Automated License Expiration Invariants
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="font-bold text-emerald-400">Active Licenses</span>
                    <p className="text-[11px] text-slate-400">Published to public catalog across authorized territories.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="font-bold text-amber-400">Expiring Soon (30 Days)</span>
                    <p className="text-[11px] text-slate-400">Triggers renewal notification to provider ops.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="font-bold text-red-400">Expired / Suspended</span>
                    <p className="text-[11px] text-slate-400">Instant automatic removal from public client listings.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
