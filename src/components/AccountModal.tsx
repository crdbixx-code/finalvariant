import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Server, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  Wifi, 
  Users, 
  Tv, 
  RefreshCw 
} from 'lucide-react';
import { ACCOUNT_INFO } from '../data/mockData';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<number>(ACCOUNT_INFO.serverPingMs);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleTestPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingResult(Math.floor(18 + Math.random() * 12));
      setIsPinging(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-[#090e1c] border border-amber-500/30 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,166,35,0.2)] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg">
              <Tv className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit']">
                XTREAM VIP LINE DETAILS
              </h2>
              <p className="text-xs text-slate-400">
                Connected to advance.playbeat.live edge streaming cluster
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 block">Subscription</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {ACCOUNT_INFO.status}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 block">Next Renewal</span>
            <span className="text-xs font-mono font-semibold text-amber-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {ACCOUNT_INFO.renewalDate}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 block">Connections</span>
            <span className="text-xs font-mono font-semibold text-cyan-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {ACCOUNT_INFO.activeConnections} / {ACCOUNT_INFO.maxConnections} Max
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Latency</span>
              <button 
                onClick={handleTestPing}
                title="Ping server"
                className="text-slate-400 hover:text-cyan-300 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" />
              {pingResult}ms Fast
            </span>
          </div>
        </div>

        {/* Credentials Form Card */}
        <div className="rounded-xl bg-black/40 border border-white/10 p-4 space-y-3.5">
          <div className="text-xs font-semibold text-slate-300 pb-1 border-b border-white/5">
            Active Xtream Codes API Authentication
          </div>

          {/* Server Host */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Server Host / URL</span>
            <div className="flex items-center gap-2">
              <code className="bg-[#111827] px-2.5 py-1 rounded text-cyan-300 border border-white/10 font-mono">
                {ACCOUNT_INFO.host}
              </code>
              <button
                onClick={() => copyToClipboard(ACCOUNT_INFO.host, 'host')}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Copy Host"
              >
                {copiedField === 'host' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Username</span>
            <div className="flex items-center gap-2">
              <code className="bg-[#111827] px-2.5 py-1 rounded text-amber-300 border border-white/10 font-mono font-semibold">
                {ACCOUNT_INFO.user}
              </code>
              <button
                onClick={() => copyToClipboard(ACCOUNT_INFO.user, 'user')}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Copy Username"
              >
                {copiedField === 'user' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Password</span>
            <div className="flex items-center gap-2">
              <code className="bg-[#111827] px-2.5 py-1 rounded text-slate-200 border border-white/10 font-mono">
                {showPassword ? ACCOUNT_INFO.pass : '••••••••'}
              </code>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Toggle Visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => copyToClipboard(ACCOUNT_INFO.pass, 'pass')}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                title="Copy Password"
              >
                {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Package Name */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-medium">Package Tier</span>
            <span className="text-slate-200 font-semibold">{ACCOUNT_INFO.packageName}</span>
          </div>
        </div>

        {/* Quick Links & Direct Web Player */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Direct App Player */}
            <a
              href={ACCOUNT_INFO.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Launch Web Player App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* CPanel Direct Link */}
            <a
              href={ACCOUNT_INFO.cpanelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Operator Panel Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Copy M3U URL Button */}
          <button
            onClick={() => copyToClipboard(ACCOUNT_INFO.m3uUrl, 'm3u')}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copiedField === 'm3u' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">M3U Plus URL Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy M3U Plus Playlist URL (For VLC, TiviMate & Smart TV)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
