import React from 'react';
import { motion } from 'motion/react';

interface FocusGaugeProps {
  currentHours?: number;
  goalHours?: number;
}

export const FocusGauge: React.FC<FocusGaugeProps> = ({
  currentHours = 7.5,
  goalHours = 8.0,
}) => {
  // 270 deg circular progress arc
  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(currentHours / goalHours, 1);
  const targetOffset = circumference - (circumference * 0.75 * pct);

  return (
    <div className="bg-[#202227] rounded-[28px] border border-[#2E313A] p-5 shadow-xl flex items-center justify-between h-[165px] hover:border-[#3E424E] transition-colors">
      <div className="flex flex-col justify-between h-full py-0.5">
        <div>
          <h4 className="text-[17px] font-bold text-white tracking-tight">
            Daily Focus Time
          </h4>
          <p className="text-xs font-normal text-[#8A8F9E] mt-1">
            You're on track for today
          </p>
        </div>

        <span className="text-xs font-semibold text-[#8A8F9E]">
          Goal is {goalHours} hours
        </span>
      </div>

      {/* Circular Gauge */}
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90">
          {/* Background Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#2A2D35"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />

          {/* Active Lime Progress Arc */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            cx="40"
            cy="40"
            r={radius}
            stroke="#D2F83D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 450, damping: 25 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-sm font-bold text-white tracking-tight">
            {currentHours}h
          </span>
        </motion.div>
      </div>
    </div>
  );
};
