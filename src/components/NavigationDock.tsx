import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Calendar,
  Target,
  Radio,
  Zap,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';
import { ScreenId } from '../types';

interface NavigationDockProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onOpenAccount: () => void;
  onToggleNotifications?: () => void;
  isNotificationsOpen?: boolean;
  unreadCount?: number;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenAccount,
  onToggleNotifications,
  isNotificationsOpen = false,
  unreadCount = 3,
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const navItems = [
    {
      id: 'hub' as ScreenId,
      label: 'Studio Hub',
      Icon: Home,
    },
    {
      id: 'content' as ScreenId,
      label: 'Content Studio',
      Icon: Calendar,
    },
    {
      id: 'radar' as ScreenId,
      label: 'Lead Radar & CRM',
      Icon: Target,
    },
    {
      id: 'stream' as ScreenId,
      label: 'Social Intent Stream',
      Icon: Radio,
    },
    {
      id: 'sprint' as ScreenId,
      label: 'Daily Sprint Mode',
      Icon: Zap,
    },
    {
      id: 'analytics' as ScreenId,
      label: 'Growth Analytics',
      Icon: BarChart3,
    },
    {
      id: 'settings' as ScreenId,
      label: 'Studio Preferences',
      Icon: Settings,
    },
  ];

  return (
    <aside className="w-[68px] h-[calc(100vh-56px)] bg-[#1C1D22]/95 backdrop-blur-xl rounded-[34px] border border-[#2E313A] border-t-white/[0.08] flex flex-col items-center py-4 my-2 ml-3.5 shadow-2xl shrink-0 select-none z-30 transition-shadow">
      {/* Top Logo Pill */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectScreen('hub')}
        className="w-12 h-12 rounded-full bg-[#22242A] flex items-center justify-center mb-4 border border-[#2E313A]/60 cursor-pointer shadow-inner dock-logo-btn"
        title="AutoMarket Studio"
      >
        <div className="grid grid-cols-2 gap-1">
          <div className="w-2 h-2 rounded-[2px] bg-white"></div>
          <div className="w-2 h-2 rounded-[2px] bg-[#D2F83D]"></div>
          <div className="w-2 h-2 rounded-[2px] bg-[#3B66F5]"></div>
          <div className="w-2 h-2 rounded-[2px] bg-white"></div>
        </div>
      </motion.div>

      {/* Nav Items List */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const Icon = item.Icon;
          return (
            <div key={item.id} className="relative">
              <motion.button
                onClick={() => {
                  onSelectScreen(item.id);
                  setHoveredItem(null);
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 480, damping: 28 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-colors dock-nav-item ${
                  !isActive ? 'hover:bg-white/[0.06] text-[#8A8F9E] hover:text-white' : 'text-[#18191D]'
                }`}
                title={item.label}
              >
                {/* Apple-style Fluid Glider Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 bg-[#D2F83D] rounded-full shadow-lg shadow-[#D2F83D]/25"
                    transition={{
                      type: 'spring',
                      stiffness: 480,
                      damping: 34,
                      mass: 0.8
                    }}
                  />
                )}

                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 2}
                  className="relative z-10 transition-colors"
                />
              </motion.button>

              {/* Tooltip on hover */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -4, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -4, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-[64px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#25272F]/95 backdrop-blur-md border border-[#2E313A] text-white text-xs font-semibold whitespace-nowrap shadow-xl z-50 pointer-events-none dock-tooltip"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Inbound Notifications Bell */}
        <div className="relative">
          <motion.button
            onClick={() => {
              onToggleNotifications?.();
              setHoveredItem(null);
            }}
            onMouseEnter={() => setHoveredItem('stream_bell')}
            onMouseLeave={() => setHoveredItem(null)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 480, damping: 28 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors relative dock-nav-item ${
              isNotificationsOpen
                ? 'bg-white/[0.12] text-white'
                : 'hover:bg-white/[0.06] text-[#8A8F9E] hover:text-white'
            }`}
            title="Notifications"
          >
            <Bell size={20} strokeWidth={isNotificationsOpen ? 2.4 : 2} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#D2F83D] ring-2 ring-[#1C1D22]"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {hoveredItem === 'stream_bell' && (
              <motion.div
                initial={{ opacity: 0, x: -4, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -4, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-[64px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#25272F]/95 backdrop-blur-md border border-[#2E313A] text-white text-xs font-semibold whitespace-nowrap shadow-xl z-50 pointer-events-none dock-tooltip"
              >
                {unreadCount > 0 ? `${unreadCount} Notifications` : 'No New Notifications'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Bottom Local Workspace Button */}
      <div className="flex flex-col items-center gap-3 pt-2 border-t border-[#2E313A]/60">
        <motion.button
          onClick={onOpenAccount}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className="w-11 h-11 rounded-full bg-[#3B66F5] flex items-center justify-center shadow-md hover:ring-2 hover:ring-[#3B66F5]/50 transition-all"
          title="Local Workspace & Storage"
        >
          <span className="text-white font-bold text-xs">AM</span>
        </motion.button>
      </div>
    </aside>
  );
};
