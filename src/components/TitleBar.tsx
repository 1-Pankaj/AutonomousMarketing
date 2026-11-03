import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Square, Copy, X, AlertTriangle, Sun, Moon } from 'lucide-react';

interface TitleBarProps {
  onNotify?: (title: string, message: string, type: 'info' | 'success') => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ onNotify, theme = 'dark', onToggleTheme }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api && typeof api.isMaximized === 'function') {
      api.isMaximized().then((max: boolean) => {
        setIsMaximized(Boolean(max));
      }).catch(() => {});
    }

    if (api && typeof api.onMaximizedState === 'function') {
      const cleanup = api.onMaximizedState((state: boolean) => {
        setIsMaximized(Boolean(state));
      });
      return () => {
        if (typeof cleanup === 'function') cleanup();
      };
    }
  }, []);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const api = (window as any).electronAPI;
    if (api && typeof api.minimize === 'function') {
      api.minimize();
    }
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const api = (window as any).electronAPI;
    if (api && typeof api.maximize === 'function') {
      api.maximize();
    } else {
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCloseModal(true);
  };

  const confirmQuit = () => {
    setShowCloseModal(false);
    onNotify?.('Studio Closed', 'All client data and drafts remain securely saved offline.', 'info');
    const api = (window as any).electronAPI;
    if (api && typeof api.close === 'function') {
      api.close();
    } else {
      try {
        window.close();
      } catch (e) {
        // Ignored in standard browser tab
      }
    }
  };

  return (
    <>
      <div
        onDoubleClick={handleMaximize}
        className="h-9 w-full bg-[#18191D] border-b border-[#23252B] flex items-center justify-between px-3 select-none app-drag z-50 transition-colors"
      >
        {/* Brand & App Identity */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-[#22242A] p-1.5 rounded-lg border border-[#2E313A]/50">
            <div className="w-1.5 h-1.5 rounded-[1px] bg-white"></div>
            <div className="w-1.5 h-1.5 rounded-[1px] bg-[#D2F83D]"></div>
            <div className="w-1.5 h-1.5 rounded-[1px] bg-[#3B66F5]"></div>
            <div className="w-1.5 h-1.5 rounded-[1px] bg-white"></div>
          </div>
          <span className="text-xs font-bold text-white tracking-wide">AutoMarket Studio</span>
          <span className="text-xs font-semibold text-[#8A8F9E] bg-[#22242A] px-2 py-0.5 rounded-full border border-[#2E313A]/60">
            Offline Desktop App
          </span>
        </div>

        {/* Middle Window Title - Simple English */}
        <div className="text-xs font-medium text-[#8A8F9E] hidden md:block">
          Marketing Studio
        </div>

        {/* Native Window Controls with explicit WebkitAppRegion no-drag */}
        <div className="flex items-center gap-1.5 app-no-drag" style={{ WebkitAppRegion: 'no-drag' } as any}>
          {onToggleTheme && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleTheme}
              style={{ WebkitAppRegion: 'no-drag' } as any}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#25272F] text-[#8A8F9E] hover:text-white transition-colors cursor-pointer mr-1"
              title={theme === 'light' ? "Switch to Dark Appearance" : "Switch to Light Appearance"}
            >
              {theme === 'light' ? <Moon size={13} strokeWidth={2} /> : <Sun size={13} strokeWidth={2} />}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMinimize}
            style={{ WebkitAppRegion: 'no-drag' } as any}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#25272F] text-[#8A8F9E] hover:text-white transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus size={13} strokeWidth={2} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMaximize}
            style={{ WebkitAppRegion: 'no-drag' } as any}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#25272F] text-[#8A8F9E] hover:text-white transition-colors cursor-pointer"
            title={isMaximized ? "Restore Window" : "Maximize Window"}
          >
            {isMaximized ? <Copy size={11} strokeWidth={2} /> : <Square size={11} strokeWidth={2} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            style={{ WebkitAppRegion: 'no-drag' } as any}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#FF5C5C] text-[#8A8F9E] hover:text-white transition-colors cursor-pointer"
            title="Close Studio"
          >
            <X size={13} strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Apple-grade Exit Confirmation Dialog (Web/Desktop fallback) */}
      <AnimatePresence>
        {showCloseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="bg-[#202227] border border-[#2E313A] rounded-[24px] p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#2A1618] border border-[#7F1D1D]/40 text-[#F87171] flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} />
              </div>

              <h3 className="text-base font-bold text-white tracking-tight mb-1">
                Close AutoMarket Studio?
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                All your scheduled posts, client proposals, and offline database are safely saved.
              </p>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#252830] border border-[#2E313A] text-xs font-semibold text-white hover:bg-[#2E313A] transition-colors"
                >
                  Stay Open
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmQuit}
                  className="flex-1 py-2.5 rounded-full bg-[#EF4444] text-xs font-bold text-white hover:bg-[#DC2626] transition-colors shadow-lg shadow-[#EF4444]/20"
                >
                  Quit App
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
