import React from 'react';
import { 
  Tv, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Lock, 
  ExternalLink 
} from 'lucide-react';
import { ACCOUNT_INFO } from '../data/mockData';

interface AppFooterProps {
  onOpenAccount: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onOpenAccount }) => {
  const devices = [
    { name: 'Apple TV 4K', desc: 'tvOS / GSE / IPTVX' },
    { name: 'Android TV & Google TV', desc: 'TiviMate / OTT Navigator' },
    { name: 'Amazon Fire TV Stick', desc: '4K Max / Cube' },
    { name: 'Samsung & LG Smart TV', desc: 'IBO Player / Smart STB' },
    { name: 'Formuler & MAG Boxes', desc: 'MYTVOnline 2/3 Stalker' },
    { name: 'iOS & Android Mobile', desc: 'Smarters Player Pro' },
    { name: 'PC & Mac OS', desc: 'VLC / SFVIP / Web Player' },
  ];

  return (
    <footer className="mt-16 border-t border-white/[0.08] bg-[#03060f] relative overflow-hidden">
      
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Device Compatibility Showcase */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <Tv className="w-4 h-4 text-cyan-400" />
                Multi-Screen & Device Compatibility
              </h3>
              <p className="text-xs text-slate-400">
                PlayBeat Luxe IPTV supports high-speed hardware decoding across all modern platforms
              </p>
            </div>
            <button
              onClick={onOpenAccount}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View Connection Credentials</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {devices.map((device) => (
              <div
                key={device.name}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors"
              >
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {device.name}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  {device.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links & Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Tv className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-lg font-bold text-white tracking-wider font-['Outfit']">
                PLAYBEAT LUXE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cinema-grade IPTV streaming platform featuring over 15,000 live channels, 65,000 VODs, and live sports in true 4K HDR at 60 FPS.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cluster status: 99.98% uptime
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Entertainment
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#popular" className="hover:text-amber-400 transition-colors">🔥 Popular Now</a></li>
              <li><a href="#trending" className="hover:text-amber-400 transition-colors">📈 Trending Movies & Shows</a></li>
              <li><a href="#sports" className="hover:text-amber-400 transition-colors">⚽ Live Sports Stadium</a></li>
              <li><a href="#music" className="hover:text-amber-400 transition-colors">🎵 24/7 Concerts & Music</a></li>
              <li><a href="#genres" className="hover:text-amber-400 transition-colors">🎭 All 12 Genre Hubs</a></li>
            </ul>
          </div>

          {/* Xtream Line Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Account Status
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between">
                <span>Account User:</span>
                <strong className="text-slate-200 font-mono">{ACCOUNT_INFO.user}</strong>
              </li>
              <li className="flex justify-between">
                <span>Package:</span>
                <span className="text-amber-300">Family VIP</span>
              </li>
              <li className="flex justify-between">
                <span>Active Expiry:</span>
                <span className="text-emerald-400 font-mono">{ACCOUNT_INFO.renewalDate}</span>
              </li>
              <li className="flex justify-between">
                <span>Concurrent Feeds:</span>
                <span className="text-cyan-300 font-mono">{ACCOUNT_INFO.maxConnections} Streams</span>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenAccount(); }} className="hover:text-cyan-400 transition-colors">IPTV Setup Guide</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenAccount(); }} className="hover:text-cyan-400 transition-colors">M3U Plus & EPG URL</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">DMCA Notice</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 PlayBeat Luxe IPTV Entertainment. All rights reserved. Powered by Xtream Codes API v3.
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>HDR10+</span>
            <span>·</span>
            <span>Dolby Atmos</span>
            <span>·</span>
            <span>4K UHD 60FPS</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
