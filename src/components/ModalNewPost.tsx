import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Image as ImageIcon, Check, ArrowUpRight } from 'lucide-react';
import { QueuedPost } from '../types';

interface ModalNewPostProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedulePost: (post: Partial<QueuedPost>) => void;
}

export const ModalNewPost: React.FC<ModalNewPostProps> = ({ isOpen, onClose, onSchedulePost }) => {
  const [content, setContent] = useState<string>(
    'How we took a regional clinic booking portal from 5.1s mobile load time down to 0.7s:\n\n1. Replaced unindexed SQL queries with static edge cache\n2. Swapped legacy frontend with Next.js edge routes\n3. Zero downtime migration without touching EHR backend\n\nResult: +180% monthly completed appointments.'
  );
  const [channel, setChannel] = useState<'All' | 'Twitter' | 'Bluesky'>('All');
  const [scheduledTime, setScheduledTime] = useState<string>('09:00 AM Tomorrow');

  // Apple HIG: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const charCount = content.length;
  const maxChar = 280;

  const handlePublish = () => {
    onSchedulePost({
      title: content.slice(0, 42).replace(/\n/g, ' ') + '...',
      content,
      scheduledTime,
      channel: channel === 'All' ? 'Multi-Channel' : channel,
      status: 'Ready',
      tags: ['Case Study', 'Performance']
    });
    onClose();
  };

  const handleSaveDraft = () => {
    onSchedulePost({
      title: content.slice(0, 42).replace(/\n/g, ' ') + '...',
      content,
      scheduledTime: 'Saved as Draft',
      channel: channel === 'All' ? 'Multi-Channel' : channel,
      status: 'Staged',
      tags: ['Draft', 'In Progress']
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#202227]/95 backdrop-blur-2xl border border-[#2E313A] border-t-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E313A] bg-[#1C1D22]/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D2F83D] text-[#18191D] flex items-center justify-center font-bold text-base">
                  +
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Create New Post</h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Write a helpful update, client story, or tip to publish on your accounts.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2E313A] transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Target Channels */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9CA3AF] font-medium mr-1">Target:</span>
                  {(['All', 'Twitter', 'Bluesky'] as const).map(c => (
                    <motion.button
                      key={c}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setChannel(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        channel === c
                          ? 'bg-[#3B66F5] text-white shadow-sm'
                          : 'bg-[#18191D] text-[#9CA3AF] hover:text-white border border-[#2E313A]'
                      }`}
                    >
                      {c === 'All' ? 'X + Bluesky (All)' : c === 'Twitter' ? 'X / Twitter' : 'Bluesky'}
                    </motion.button>
                  ))}
                </div>

                <div className="text-xs text-[#8A8F9E] font-medium">
                  Direct &amp; Natural Tone
                </div>
              </div>

              {/* Text Editor Box */}
              <div className="bg-[#18191D] border border-[#2E313A] rounded-xl p-4 focus-within:border-[#D2F83D] transition-colors">
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your customer story, update, or helpful advice..."
                  className="w-full bg-transparent text-sm text-white placeholder-[#6B7280] focus:outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-3 border-t border-[#2E313A]/60 text-xs text-[#9CA3AF]">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors">
                      <ImageIcon className="w-4 h-4" />
                      <span>Attach Screenshot</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span>{scheduledTime}</span>
                    </button>
                  </div>

                  <span className={`font-mono text-xs font-semibold ${charCount > maxChar ? 'text-[#F87171]' : 'text-[#8A8F9E]'}`}>
                    {charCount} / {maxChar}
                  </span>
                </div>
              </div>

              {/* Practical Guidance Reminder (Zero Gimmick Dots) */}
              <div className="p-3.5 bg-[#18191D] border border-[#2E313A] rounded-xl flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>Tip: Concrete numbers and real benchmarks (-74% latency, +180% bookings) get the best response.</span>
                <span className="text-[#D2F83D] font-bold shrink-0 ml-3">Ready to Publish</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#2E313A] bg-[#1C1D22]/80">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-[#202227] hover:bg-[#252830] border border-[#2E313A] text-xs font-semibold text-[#9CA3AF] hover:text-white rounded-lg transition-colors"
              >
                Save as Draft
              </motion.button>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePublish}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#D2F83D] hover:bg-[#C2E82D] text-[#18191D] rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  <span>Schedule Post</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
