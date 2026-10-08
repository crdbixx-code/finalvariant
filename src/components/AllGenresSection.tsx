import React, { useState } from 'react';
import { 
  Flame, 
  Cpu, 
  Heart, 
  Trophy, 
  Eye, 
  Smile, 
  Music, 
  Sparkles, 
  Compass, 
  Ghost, 
  Zap, 
  Film,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { ALL_GENRES_CATEGORIES } from '../data/mockData';

interface AllGenresSectionProps {
  onSelectGenre: (genreName: string) => void;
}

export const AllGenresSection: React.FC<AllGenresSectionProps> = ({
  onSelectGenre,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show 6 initial genres, or all 12 when expanded
  const displayedGenres = isExpanded
    ? ALL_GENRES_CATEGORIES
    : ALL_GENRES_CATEGORIES.slice(0, 6);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-emerald-400" />;
      case 'Eye': return <Eye className="w-5 h-5 text-purple-400" />;
      case 'Smile': return <Smile className="w-5 h-5 text-yellow-400" />;
      case 'Music': return <Music className="w-5 h-5 text-pink-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-sky-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-teal-400" />;
      case 'Ghost': return <Ghost className="w-5 h-5 text-red-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-violet-400" />;
      default: return <Film className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                EXPLORE ALL GENRES
              </h2>
              <p className="text-xs text-slate-400">
                Over 12,000+ curated VODs, 4K Cinema & Live channels classified by mood
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse' : 'View All 12 Genres'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayedGenres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => onSelectGenre(genre.name)}
              className={`group relative rounded-xl p-4 bg-gradient-to-br from-[#0e1628]/80 to-[#090e1c]/80 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(0,0,0,0.7),0_0_20px_rgba(56,189,248,0.2)] cursor-pointer overflow-hidden flex flex-col justify-between h-28`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                  {getIcon(genre.icon)}
                </div>
                <span className="font-mono text-[11px] text-slate-400 group-hover:text-cyan-300 transition-colors">
                  {genre.count} Titles
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-white group-hover:text-amber-300 transition-colors">
                  {genre.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
