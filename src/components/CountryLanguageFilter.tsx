import React from 'react';
import { Filter, Globe, Sparkles, Check, RotateCcw } from 'lucide-react';

export interface FilterState {
  countryCode: string;
  region: string;
  language: string;
  category: string;
  quality: string;
  providerId: string;
}

interface CountryLanguageFilterProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalFiltered: number;
}

export const CountryLanguageFilter: React.FC<CountryLanguageFilterProps> = ({
  filters,
  onChange,
  onReset,
  totalFiltered,
}) => {
  const countries = [
    { code: '', label: 'All Countries' },
    { code: 'PK', label: '🇵🇰 Pakistan' },
    { code: 'GB', label: '🇬🇧 United Kingdom' },
    { code: 'US', label: '🇺🇸 United States' },
    { code: 'IN', label: '🇮🇳 India' },
    { code: 'AE', label: '🇦🇪 United Arab Emirates' },
    { code: 'SA', label: '🇸🇦 Saudi Arabia' },
    { code: 'TR', label: '🇹🇷 Turkey' },
    { code: 'DE', label: '🇩🇪 Germany' },
    { code: 'FR', label: '🇫🇷 France' },
    { code: 'CA', label: '🇨🇦 Canada' },
    { code: 'AU', label: '🇦🇺 Australia' },
    { code: 'BD', label: '🇧🇩 Bangladesh' },
  ];

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'Sports', label: '⚽ Live Sports' },
    { id: 'News', label: '📰 Live News' },
    { id: 'General Entertainment', label: '📺 Entertainment' },
    { id: 'Movies', label: '🎬 Movies & Cinema' },
    { id: 'Music', label: '🎵 Music TV' },
    { id: 'Kids', label: '🧸 Kids & Family' },
    { id: 'Documentary', label: '🌿 Documentary' },
  ];

  const languages = [
    { id: '', label: 'All Languages' },
    { id: 'Urdu', label: 'Urdu' },
    { id: 'English', label: 'English' },
    { id: 'Hindi', label: 'Hindi' },
    { id: 'Arabic', label: 'Arabic' },
    { id: 'Turkish', label: 'Turkish' },
    { id: 'German', label: 'German' },
    { id: 'French', label: 'French' },
    { id: 'Bengali', label: 'Bengali' },
  ];

  const qualities = [
    { id: '', label: 'All Formats' },
    { id: '4K', label: '4K UHD' },
    { id: 'Full HD', label: 'FHD 1080p' },
  ];

  const isFiltered = filters.countryCode || filters.category || filters.language || filters.quality;

  return (
    <div className="bg-[#080d1b]/90 border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Granular Catalog Matrix Filter
          </h3>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-400/30 px-2 py-0.5 rounded">
            {totalFiltered.toLocaleString()} Matching Channels
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Select Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Country */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
            Country
          </label>
          <select
            value={filters.countryCode}
            onChange={(e) => onChange({ ...filters, countryCode: e.target.value })}
            className="w-full bg-[#11192e] border border-white/10 hover:border-cyan-400/50 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full bg-[#11192e] border border-white/10 hover:border-cyan-400/50 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
            Language
          </label>
          <select
            value={filters.language}
            onChange={(e) => onChange({ ...filters, language: e.target.value })}
            className="w-full bg-[#11192e] border border-white/10 hover:border-cyan-400/50 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Format / Resolution */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
            Format / Resolution
          </label>
          <select
            value={filters.quality}
            onChange={(e) => onChange({ ...filters, quality: e.target.value })}
            className="w-full bg-[#11192e] border border-white/10 hover:border-cyan-400/50 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            {qualities.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
