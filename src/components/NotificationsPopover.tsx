import React from 'react';
import { Bell, X, Calendar, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { ACCOUNT_INFO } from '../data/mockData';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (action: string) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'UCL Live Kickoff',
      description: 'Real Madrid vs Manchester City is in the 74th minute on TNT Sports 1 Ultimate 4K.',
      time: 'Live Now',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      type: 'sports',
    },
    {
      id: 'notif-2',
      title: 'Active VIP Renewal Safe',
      description: `Your World Package (Family VIP) line is active until ${ACCOUNT_INFO.renewalDate}.`,
      time: 'Renewal Info',
      icon: <Calendar className="w-4 h-4 text-cyan-400" />,
      type: 'account',
    },
    {
      id: 'notif-3',
      title: 'New 4K Release Added',
      description: 'Alien: Romulus and Deadpool & Wolverine are now available in 4K Dolby Atmos.',
      time: '2 hours ago',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
      type: 'content',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-4 pt-20 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm rounded-2xl bg-[#090e1d] border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.15)] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">NOTIFICATIONS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-white/5">
                    {n.icon}
                  </div>
                  <h4 className="text-xs font-semibold text-white">
                    {n.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {n.time}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {n.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
