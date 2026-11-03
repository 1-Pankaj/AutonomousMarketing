import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Calendar, TrendingUp, Check, X, Bell } from 'lucide-react';
import { AppNotification, ScreenId } from '../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onDismissNotification: (id: string) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onDismissNotification,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'opportunity':
        return <Radio className="w-4 h-4 text-[#D2F83D]" />;
      case 'sprint':
        return <Calendar className="w-4 h-4 text-[#3B66F5]" />;
      case 'system':
      default:
        return <TrendingUp className="w-4 h-4 text-[#34D399]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, x: -12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="fixed left-[84px] bottom-16 z-50 w-96 bg-[#202227]/98 backdrop-blur-2xl border border-[#2E313A] border-t-white/[0.1] rounded-2xl shadow-2xl p-4 select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2E313A]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#8A8F9E]" />
                <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#D2F83D] text-[#18191D]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs text-[#8A8F9E] hover:text-[#D2F83D] transition-colors"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-[#8A8F9E] hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="mt-3 space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(37, 40, 48, 0.8)' }}
                    transition={{ duration: 0.15 }}
                    onClick={() => onSelectNotification(notif)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                      notif.read
                        ? 'bg-[#18191D] border-[#2E313A]/60 opacity-75'
                        : 'bg-[#252830] border-[#3B404E]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-[#18191D] border border-[#2E313A] shrink-0">
                        {getIcon(notif.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-white tracking-tight truncate">
                            {notif.title}
                          </span>
                          <span className="text-xs text-[#6B7280] shrink-0 ml-2">
                            {notif.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismissNotification(notif.id);
                        }}
                        className="text-[#6B7280] hover:text-white p-1 transition-colors shrink-0"
                        title="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {!notif.read && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D2F83D]" />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#8A8F9E]">
                  No recent notifications
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
