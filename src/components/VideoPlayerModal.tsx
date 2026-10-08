import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Tv, 
  ListVideo, 
  Sparkles,
  Info,
  Radio,
  Cast
} from 'lucide-react';
import { ContentItem } from '../types';
import { LIVE_TV_CHANNELS, ACCOUNT_INFO } from '../data/mockData';
import { formatTime } from '../lib/utils';

interface VideoPlayerModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onSelectChannel?: (channel: ContentItem) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  onClose,
  onSelectChannel,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(145);
  const [duration, setDuration] = useState(5400); // 1h 30m
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState('4K UHD 60fps');
  const [audioTrack, setAudioTrack] = useState('English (Dolby Atmos 5.1)');
  const [subtitles, setSubtitles] = useState('Off');
  const [showSettings, setShowSettings] = useState(false);
  const [showChannelsDrawer, setShowChannelsDrawer] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const isLive = item?.type === 'live_tv' || item?.type === 'sports' || item?.badge?.includes('LIVE');

  // Timer simulation
  useEffect(() => {
    if (!isPlaying || isLive) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isLive, duration]);

  // Hide controls after 4 seconds of inactivity
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 4000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSettings || showChannelsDrawer) {
          setShowSettings(false);
          setShowChannelsDrawer(false);
        } else {
          onClose();
        }
      }
      if (e.key === ' ' || e.key === 'k') {
        setIsPlaying((p) => !p);
      }
      if (e.key === 'f') {
        toggleFullscreen();
      }
      if (e.key === 'm') {
        setIsMuted((m) => !m);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, showChannelsDrawer, onClose]);

  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-300"
      onMouseMove={handleMouseMove}
    >
      <div 
        ref={playerContainerRef}
        className="relative w-full h-full max-w-7xl max-h-[92vh] rounded-none md:rounded-2xl overflow-hidden bg-[#03060d] border border-white/10 shadow-[0_0_80px_rgba(56,189,248,0.25)] flex flex-col justify-between"
      >
        {/* Ambient Backlight Glow around video */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-600/20 via-amber-600/10 to-transparent blur-3xl" />

        {/* Cinematic Stream Simulation Background */}
        <div className="absolute inset-0 bg-[#030712] overflow-hidden select-none">
          <img
            src={item.backdrop || item.poster}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              isPlaying ? 'scale-105 filter brightness-90 contrast-105' : 'scale-100 filter brightness-75 blur-[1px]'
            }`}
          />

          {/* Animated Ambient Video Scanlines / Grain for authentic cinema feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 opacity-70" />
          
          {/* Live Watermark / Channel Bug */}
          <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-none z-10">
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-cyan-400 font-mono text-xs font-bold tracking-wider">
              PLAYBEAT LUXE 4K
            </span>
            {isLive && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/90 text-white font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* TOP BAR OVERLAY */}
        <div 
          className={`relative z-20 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  {item.title}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                  {quality}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isLive ? `Live Feed · ${ACCOUNT_INFO.user}` : `${item.year} · ${item.genres.join(' / ')}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Channels Drawer */}
            <button
              onClick={() => setShowChannelsDrawer(!showChannelsDrawer)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Channel Guide</span>
            </button>

            {/* Toggle Stream Stats */}
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Stream Diagnostic Stats"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Audio & Quality Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MIDDLE: Big Play/Pause indicator or buffering animation */}
        <div 
          className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {!isPlaying && (
            <div className="w-20 h-20 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-[0_0_50px_rgba(245,166,35,0.7)] animate-in zoom-in-90 duration-200">
              <Play className="w-10 h-10 fill-slate-950 ml-1" />
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS OVERLAY */}
        <div 
          className={`relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Seekbar (Only for VOD) */}
          {!isLive && (
            <div className="mb-4 space-y-1.5">
              <div 
                className="relative h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer transition-all overflow-hidden group/seek"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(Math.floor(pos * duration));
                }}
              >
                {/* Buffer bar */}
                <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full w-[65%]" />
                {/* Played bar */}
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Control Buttons Bar */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 shadow-md cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>

              {!isLive && (
                <>
                  <button
                    onClick={() => setCurrentTime((t) => Math.max(0, t - 10))}
                    className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentTime((t) => Math.min(duration, t + 10))}
                    className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Forward 10s"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 sm:w-24 accent-amber-400 cursor-pointer h-1"
                />
              </div>

              {isLive && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  LIVE 4K STREAM
                </div>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline font-mono text-xs text-slate-400">
                Host: <strong className="text-slate-200">playbeat.live:8880</strong>
              </span>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* OVERLAY: STREAM DIAGNOSTIC STATS */}
        {showStats && (
          <div className="absolute top-20 right-6 z-30 w-80 rounded-xl bg-black/90 backdrop-blur-xl border border-cyan-500/30 p-4 text-xs font-mono space-y-2 text-slate-300 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-cyan-400 font-bold">
              <span>STREAM STATS (NERD STATS)</span>
              <button onClick={() => setShowStats(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stream URL:</span>
              <span className="text-amber-300 truncate max-w-[170px]">{ACCOUNT_INFO.host}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">User / Line:</span>
              <span className="text-white">{ACCOUNT_INFO.user} (VIP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video Resolution:</span>
              <span className="text-white">3840 x 2160 (4K 60fps)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video Bitrate:</span>
              <span className="text-emerald-400 font-bold">28.4 Mbps (CBR)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video Codec:</span>
              <span className="text-white">HEVC / H.265 Main 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Audio Codec:</span>
              <span className="text-white">Dolby E-AC3 7.1 Atmos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Buffer Health:</span>
              <span className="text-cyan-400">4.8s (Stable)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Network Latency:</span>
              <span className="text-emerald-400">{ACCOUNT_INFO.serverPingMs}ms</span>
            </div>
          </div>
        )}

        {/* OVERLAY: AUDIO / SUBTITLES / QUALITY SETTINGS */}
        {showSettings && (
          <div className="absolute bottom-24 right-6 z-30 w-72 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 p-4 space-y-3.5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white font-bold text-xs">
              <span>PLAYBACK CONFIGURATION</span>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Stream Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full bg-[#111827] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="4K UHD 60fps">4K UHD 60fps (HEVC)</option>
                <option value="1080p FHD 60fps">1080p FHD 60fps (High)</option>
                <option value="720p HD">720p HD (Data Saver)</option>
                <option value="Auto (Adaptive)">Auto (Adaptive Bitrate)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Audio Track</label>
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value)}
                className="w-full bg-[#111827] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="English (Dolby Atmos 5.1)">English (Dolby Atmos 5.1)</option>
                <option value="Hindi (Dolby 5.1)">Hindi (Dolby 5.1)</option>
                <option value="Spanish (Castilian)">Spanish (Castilian)</option>
                <option value="Stadium Ambient Only">Stadium Ambient Only (No Commentary)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Subtitles</label>
              <select
                value={subtitles}
                onChange={(e) => setSubtitles(e.target.value)}
                className="w-full bg-[#111827] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Off">Off</option>
                <option value="English [CC]">English [CC]</option>
                <option value="Spanish">Spanish</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
          </div>
        )}

        {/* OVERLAY: CHANNEL GUIDE DRAWER */}
        {showChannelsDrawer && (
          <div className="absolute top-0 right-0 bottom-0 z-30 w-80 sm:w-96 bg-[#070c18]/95 backdrop-blur-2xl border-l border-white/10 p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">LIVE CHANNELS EPG</h3>
              </div>
              <button
                onClick={() => setShowChannelsDrawer(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {LIVE_TV_CHANNELS.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    if (onSelectChannel) {
                      onSelectChannel({
                        id: ch.id,
                        title: ch.name,
                        originalTitle: ch.name,
                        type: 'live_tv',
                        poster: ch.logo,
                        backdrop: ch.logo,
                        genres: [ch.category, 'Live TV'],
                        rating: 9.5,
                        year: 2026,
                        duration: 'Live Broadcast',
                        quality: ch.resolution.includes('4K') ? '4K UHD' : 'FHD 1080p',
                        description: `Now playing: ${ch.currentShow}. Up next: ${ch.nextShow}.`,
                        channelNumber: ch.number,
                        currentShow: ch.currentShow,
                        nextShow: ch.nextShow,
                        badge: '🔴 LIVE CHANNEL',
                      });
                    }
                    setShowChannelsDrawer(false);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-400/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-400 w-8">
                      {ch.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {ch.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {ch.currentShow}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-400/30">
                    {ch.resolution}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
