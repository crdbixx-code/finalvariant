import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentItem } from '../types';
import { ContentCard } from './ContentCard';

interface ContentRowProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  items: ContentItem[];
  onPlay: (item: ContentItem) => void;
  onDetails: (item: ContentItem) => void;
  isInList: (id: string) => boolean;
  onToggleList: (item: ContentItem) => void;
  layout?: 'poster' | 'backdrop';
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  icon,
  subtitle,
  items,
  onPlay,
  onDetails,
  isInList,
  onToggleList,
  layout = 'poster',
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-4 group/row">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row Header */}
        <div className="flex items-end justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            {icon && <div className="text-amber-400">{icon}</div>}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Outfit']">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-slate-400 -mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Navigation Arrows for Desktop */}
          <div className="hidden sm:flex items-center gap-1.5 opacity-80 group-hover/row:opacity-100 transition-opacity">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} left`}
              className={`w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer ${
                !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:border-cyan-400/50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} right`}
              className={`w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer ${
                !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:border-cyan-400/50'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Cards Container */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-smooth"
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onPlay={onPlay}
              onDetails={onDetails}
              isInList={isInList(item.id)}
              onToggleList={onToggleList}
              layout={layout}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
