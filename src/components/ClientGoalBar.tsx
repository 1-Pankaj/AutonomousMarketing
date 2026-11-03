import React from 'react';
import { motion } from 'motion/react';

interface ClientGoalBarProps {
  current?: number;
  target?: number;
}

export const ClientGoalBar: React.FC<ClientGoalBarProps> = ({
  current = 16,
  target = 20,
}) => {
  const pct = Math.round((current / target) * 100);

  return (
    <div className="bg-[#202227] rounded-[28px] border border-[#2E313A] p-5 shadow-xl flex flex-col justify-between h-[165px] hover:border-[#3E424E] transition-colors">
      <div className="flex items-center justify-between">
        <h4 className="text-[17px] font-bold text-white tracking-wide">
          Client Outreach Goal
        </h4>
        <span className="text-xs font-semibold text-[#D2F83D] bg-[#D2F83D]/10 px-2.5 py-0.5 rounded-full border border-[#D2F83D]/20">
          {pct}% completed
        </span>
      </div>

      <div className="my-auto py-2">
        {/* Track */}
        <div className="w-full h-2.5 rounded-full bg-[#18191D] border border-[#2E313A] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="h-full rounded-full bg-[#D2F83D] shadow-sm shadow-[#D2F83D]/20"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-[#8A8F9E]">
        <span>{current} Audits Sent</span>
        <span>{target} Target</span>
      </div>
    </div>
  );
};
