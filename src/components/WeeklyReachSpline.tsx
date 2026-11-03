import React from 'react';
import { motion } from 'motion/react';

export const WeeklyReachSpline: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-[#202227] rounded-[28px] border border-[#2E313A] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-[385px] hover:border-[#3E424E] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-white tracking-tight">
            Weekly Audience Reach &amp; Activity
          </h3>
          <p className="text-xs text-[#8A8F9E] mt-0.5">
            Cross-platform views, engagements, and peak audience timing
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25272F] border border-[#2E313A] text-xs font-semibold text-[#8A8F9E] hover:text-white transition-colors"
        >
          <span>Last 7 Days</span>
          <span className="text-xs">▾</span>
        </motion.button>
      </div>

      {/* Spline Chart SVG Area */}
      <div className="relative w-full h-[185px] my-1">
        <svg
          viewBox="0 0 720 185"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Lime Gradient Area Fill */}
            <linearGradient id="limeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D2F83D" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#D2F83D" stopOpacity="0.0" />
            </linearGradient>

            {/* Amber Gradient */}
            <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB020" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFB020" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Dotted Baseline */}
          <line
            x1="30"
            y1="145"
            x2="690"
            y2="145"
            stroke="#2E313A"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* 1. Electric Lime Spline Fill (Audience Views) */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            d="M 30 135 C 90 120, 150 95, 230 85 C 300 75, 330 32, 360 32 C 390 32, 430 75, 480 85 C 540 95, 620 120, 690 125 L 690 145 L 30 145 Z"
            fill="url(#limeGrad)"
          />

          {/* 1. Electric Lime Spline Stroke */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            d="M 30 135 C 90 120, 150 95, 230 85 C 300 75, 330 32, 360 32 C 390 32, 430 75, 480 85 C 540 95, 620 120, 690 125"
            fill="none"
            stroke="#D2F83D"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Dotted drop line at Lime peak (Thu: x=360) */}
          <motion.line
            initial={{ opacity: 0, y2: 32 }}
            animate={{ opacity: 1, y2: 145 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            x1="360"
            y1="32"
            x2="360"
            y2="145"
            stroke="#D2F83D"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* 2. Amber Spline (Engagements) */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            d="M 30 142 C 120 138, 200 125, 300 95 C 380 72, 430 38, 475 38 C 520 38, 570 80, 690 110"
            fill="none"
            stroke="#FFB020"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* 3. Purple Spline (Optimal Timing) */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            d="M 30 144 C 140 140, 240 130, 360 110 C 460 90, 520 52, 575 52 C 625 52, 660 85, 690 98"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Day Ticks */}
          {days.map((day, i) => {
            const x = 50 + i * 100;
            return (
              <text
                key={day}
                x={x}
                y="164"
                textAnchor="middle"
                fill="#6B7280"
                fontSize="12"
                fontWeight="600"
              >
                {day}
              </text>
            );
          })}
        </svg>

        {/* Peak Callout Pill 1: 8 745 Views (Lime Peak on Thu) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 450, damping: 22 }}
          className="absolute left-[50%] top-[4px] -translate-x-1/2 flex items-center justify-center px-3 py-1 rounded-full bg-[#18191D] border-2 border-[#D2F83D] shadow-lg cursor-default z-10"
        >
          <span className="text-xs font-bold text-white tracking-wide">8 745</span>
        </motion.div>

        {/* Peak Callout Pill 2: 700 Engaged (Amber Peak on Fri) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.65, type: 'spring', stiffness: 450, damping: 22 }}
          className="absolute left-[66%] top-[10px] -translate-x-1/2 flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#FFB020] text-[#18191D] font-bold text-xs shadow-md cursor-default z-10"
        >
          700
        </motion.div>

        {/* Peak Callout Pill 3: 6 PM (Purple Peak on Sat) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.75, type: 'spring', stiffness: 450, damping: 22 }}
          className="absolute left-[80%] top-[24px] -translate-x-1/2 flex items-center justify-center px-2 py-0.5 rounded-full bg-[#8B5CF6] text-white font-bold text-xs shadow-md cursor-default z-10"
        >
          6 PM Peak
        </motion.div>
      </div>

      {/* Bottom 3 Summary Metrics */}
      <div className="grid grid-cols-3 gap-6 pt-3 border-t border-[#2E313A]/60">
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="text-xs font-semibold text-[#8A8F9E] block mb-1">Audience Views</span>
          <div className="text-2xl font-bold text-white tracking-tight mb-1.5">8 745</div>
          <div className="flex items-center gap-3 text-xs font-semibold text-[#8A8F9E]">
            <span>Goal <strong className="text-white font-semibold">8 000</strong></span>
            <span>Avg <strong className="text-white font-semibold">9 450</strong></span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <span className="text-xs font-semibold text-[#8A8F9E] block mb-1">People Engaged</span>
          <div className="text-2xl font-bold text-white tracking-tight mb-1.5">700</div>
          <div className="flex items-center gap-3 text-xs font-semibold text-[#8A8F9E]">
            <span>Goal <strong className="text-white font-semibold">500</strong></span>
            <span>Avg <strong className="text-white font-semibold">646</strong></span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <span className="text-xs font-semibold text-[#8A8F9E] block mb-1">Time Saved</span>
          <div className="text-2xl font-bold text-white tracking-tight mb-1.5">2h 45m</div>
          <div className="flex items-center gap-3 text-xs font-semibold text-[#8A8F9E]">
            <span>Goal <strong className="text-white font-semibold">2h</strong></span>
            <span>Avg <strong className="text-white font-semibold">2h 30m</strong></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
