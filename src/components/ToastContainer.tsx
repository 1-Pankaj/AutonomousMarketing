import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="pointer-events-auto bg-[#202227]/95 backdrop-blur-xl border border-[#2E313A] border-t-white/[0.1] shadow-2xl rounded-xl p-3.5 flex items-start gap-3"
            >
              <div className="mt-0.5 flex-shrink-0">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#D2F83D]" />}
                {isError && <AlertCircle className="w-4 h-4 text-[#F87171]" />}
                {isWarning && <AlertCircle className="w-4 h-4 text-[#FBBF24]" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-[#60A5FA]" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white tracking-tight">{toast.title}</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{toast.message}</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => onDismiss(toast.id)}
                className="text-[#6B7280] hover:text-white p-0.5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
