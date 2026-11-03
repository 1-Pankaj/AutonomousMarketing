import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, FileSpreadsheet, HardDrive, CheckCircle2, Shield, Info } from 'lucide-react';
import { ScreenId } from '../types';

interface AccountPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (title: string, message: string, type: 'info' | 'success') => void;
  onExportCSV?: () => void;
  leadCount?: number;
}

export const AccountPopover: React.FC<AccountPopoverProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onShowToast,
  onExportCSV,
  leadCount = 111
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: -8, y: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, x: -8, y: 8 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="absolute left-[72px] bottom-4 z-50 w-72 bg-[#202227]/95 backdrop-blur-2xl border border-[#2E313A] border-t-white/[0.12] rounded-2xl shadow-2xl p-3.5 select-none"
          >
            {/* Local Studio Workspace Card */}
            <div className="p-3 bg-[#18191D]/90 border border-[#2E313A] rounded-xl mb-2.5 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#3B66F5] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  AM
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">AutoMarket Studio</div>
                  <div className="text-xs text-[#9CA3AF] mt-0.5">Self-Hosted Desktop App</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#2E313A] text-xs text-[#9CA3AF]">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <HardDrive className="w-3.5 h-3.5 text-[#3B66F5]" />
                  <span>leads.json</span>
                </div>
                <span className="text-[#D2F83D] font-semibold">{leadCount.toLocaleString()} Local Targets</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1 text-xs">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onNavigate('settings');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#252830] rounded-lg transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-[#8A8F9E]" />
                <span className="font-medium">Studio Preferences</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (onExportCSV) {
                    onExportCSV();
                  } else {
                    onShowToast('Data Exported', 'Local leads backed up to CSV.', 'success');
                  }
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#252830] rounded-lg transition-colors text-left cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#8A8F9E]" />
                <span className="font-medium">Export Leads Backup (CSV)</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onNavigate('sprint');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#252830] rounded-lg transition-colors text-left"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D2F83D]" />
                <span className="font-medium">Daily Sprint (Step 3 of 4)</span>
              </motion.button>

              <div className="my-1.5 border-t border-[#2E313A]" />

              <div className="px-3 py-1.5 flex items-center justify-between text-xs text-[#6B7280]">
                <span>Local Storage Only</span>
                <span className="font-mono">v1.0.0 Desktop</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
