import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Calendar as CalendarIcon, Check } from 'lucide-react';

interface CalendarDay {
  d: number;
  prev?: boolean;
  next?: boolean;
}

export const ScheduleCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [selectedMonth, setSelectedMonth] = useState<string>('November');
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const months = ['October', 'November', 'December'];
  const daysHeader = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const calendarDates: CalendarDay[][] = [
    [ { d: 1, prev: true }, { d: 2, prev: true }, { d: 3, prev: true }, { d: 1 }, { d: 2 }, { d: 3 }, { d: 4 } ],
    [ { d: 5 }, { d: 6 }, { d: 7 }, { d: 8 }, { d: 9 }, { d: 10 }, { d: 11 } ],
    [ { d: 12 }, { d: 13 }, { d: 14 }, { d: 15 }, { d: 16 }, { d: 17 }, { d: 18 } ],
    [ { d: 19 }, { d: 20 }, { d: 21 }, { d: 22 }, { d: 23 }, { d: 24 }, { d: 25 } ],
    [ { d: 26 }, { d: 27 }, { d: 28 }, { d: 29 }, { d: 30 }, { d: 31 }, { d: 1, next: true } ]
  ];

  return (
    <div className="bg-[#3B66F5] rounded-[28px] p-6 text-white shadow-2xl flex flex-col justify-between h-[385px] relative overflow-hidden select-none schedule-calendar-card">
      {/* Header */}
      <div className="flex items-center justify-between relative z-20">
        <h3 className="text-[17px] font-bold text-white tracking-wide flex items-center gap-2">
          <span>Content Schedule</span>
        </h3>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMonthOpen(!isMonthOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2B4EC8] text-xs font-semibold text-white hover:bg-[#203ea7] transition-colors shadow-sm calendar-month-btn"
          >
            <span>{selectedMonth}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${isMonthOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isMonthOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 4 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-9 w-32 bg-[#202227] border border-[#2E313A] rounded-xl shadow-2xl py-1.5 z-30 overflow-hidden"
              >
                {months.map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setIsMonthOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-[#2A2D35] transition-colors ${
                      selectedMonth === m ? 'text-[#D2F83D] font-bold' : 'text-white/80'
                    }`}
                  >
                    <span>{m}</span>
                    {selectedMonth === m && <Check size={12} className="text-[#D2F83D]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold tracking-wider text-white/70 uppercase pt-1 calendar-week-header">
        {daysHeader.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="flex flex-col gap-1.5">
        {calendarDates.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7 gap-2">
            {week.map((item, dIdx) => {
              const isSelected = !item.prev && !item.next && item.d === selectedDay;

              if (isSelected) {
                return (
                  <motion.button
                    key={dIdx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    onClick={() => setSelectedDay(item.d)}
                    className="w-9 h-9 rounded-full bg-[#D2F83D] text-[#18191D] font-bold text-xs flex items-center justify-center mx-auto shadow-lg ring-2 ring-white/30 calendar-day-selected"
                  >
                    {item.d}
                  </motion.button>
                );
              }

              if (item.prev || item.next) {
                return (
                  <div
                    key={dIdx}
                    className="w-9 h-9 rounded-full border border-white/20 text-white/40 font-semibold text-xs flex items-center justify-center mx-auto calendar-day-muted"
                  >
                    {item.d}
                  </div>
                );
              }

              return (
                <motion.button
                  key={dIdx}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={() => setSelectedDay(item.d)}
                  className="w-9 h-9 rounded-full bg-[#2546B8] hover:bg-[#1E3A9E] text-white font-semibold text-xs flex items-center justify-center mx-auto transition-colors cursor-pointer calendar-day-normal"
                >
                  {item.d}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
