import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, ArrowRight, ArrowUpRight, Check, ShieldCheck, FileText } from 'lucide-react';

interface DailySprintProps {
  onOpenProposal: (leadName: string, domain: string) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'info') => void;
}

export const DailySprint: React.FC<DailySprintProps> = ({ onOpenProposal, onShowToast }) => {
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [stepCompleted, setStepCompleted] = useState<boolean[]>([true, true, false, false]);

  const steps = [
    {
      id: 1,
      title: "Share Today's Case Study",
      time: '3 min',
      desc: 'Post the Northstar Health speed improvement story to Twitter and Bluesky.'
    },
    {
      id: 2,
      title: 'Review New Inquiries',
      time: '4 min',
      desc: 'Check 2 prospective clients requesting web optimization.'
    },
    {
      id: 3,
      title: 'Send Message to Meridian Clinics',
      time: '5 min',
      desc: 'Message Dr. Elena Rostova regarding their 5.1s mobile portal load delay.'
    },
    {
      id: 4,
      title: 'Review Tomorrow’s Schedule',
      time: '3 min',
      desc: 'Check tomorrow’s draft post and marketing calendar.'
    }
  ];

  const isAllCompleted = stepCompleted.every(Boolean);

  const handleCompleteCurrentStep = () => {
    const updated = [...stepCompleted];
    updated[currentStep - 1] = true;
    setStepCompleted(updated);

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      onShowToast('Step Completed', `Proceeding to Step ${currentStep + 1}.`, 'info');
    } else {
      onShowToast('Sprint Complete!', 'All 4 daily marketing tasks executed in under 15 minutes.', 'success');
    }
  };

  const handleToggleStep = (index: number) => {
    const updated = [...stepCompleted];
    updated[index] = !updated[index];
    setStepCompleted(updated);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#18191D] p-6 text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Daily 15-Minute Marketing Sprint</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${
              isAllCompleted
                ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                : 'bg-[#D2F83D]/10 border-[#D2F83D]/30 text-[#D2F83D]'
            }`}>
              {isAllCompleted ? 'Sprint Completed' : `Step ${currentStep} of 4`}
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            A focused daily routine: 1 post published, 3 client messages sent, zero context switching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] bg-[#202227] border border-[#2E313A] px-3.5 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-[#D2F83D]" />
            <span>Target: <strong>15m total</strong> • 7m elapsed</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => {
              if (isAllCompleted) {
                setStepCompleted([true, true, false, false]);
                setCurrentStep(3);
                onShowToast('Sprint Reset', 'Sprint reset to Step 3.', 'info');
              } else {
                setStepCompleted([true, true, true, true]);
                onShowToast('Sprint Finished!', 'Great job! Today’s marketing is completely done.', 'success');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D2F83D] hover:bg-[#C2E82D] text-[#18191D] rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <span>{isAllCompleted ? 'Restart Sprint' : 'Complete Sprint'}</span>
            <Check className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Main Grid: Steps List & Active Action Workspace */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Column: 4-Step Checklist (5 cols) */}
        <div className="col-span-5 bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E313A]">
              <h3 className="text-sm font-bold text-white tracking-tight">Daily Sprint Workflow</h3>
              <span className="text-xs text-[#9CA3AF]">
                {stepCompleted.filter(Boolean).length} / 4 Done
              </span>
            </div>

            <div className="space-y-3">
              {steps.map((s, idx) => {
                const isCurrent = currentStep === s.id;
                const isDone = stepCompleted[s.id - 1];

                return (
                  <motion.div
                    key={s.id}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    onClick={() => setCurrentStep(s.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#252830] border-[#D2F83D] shadow-md shadow-[#D2F83D]/5 ring-1 ring-[#D2F83D]/30'
                        : isDone
                        ? 'bg-[#18191D] border-[#2E313A]/60 opacity-80'
                        : 'bg-[#18191D] border-[#2E313A] hover:border-[#3E424E]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStep(idx);
                        }}
                        className="mt-0.5"
                        title={isDone ? 'Mark incomplete' : 'Mark done'}
                      >
                        {isDone ? (
                          <motion.div
                            initial={{ scale: 0.6 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#D2F83D]" />
                          </motion.div>
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? 'border-[#D2F83D] text-[#D2F83D]'
                                : 'border-[#6B7280] text-[#6B7280]'
                            }`}
                          >
                            {s.id}
                          </div>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              isCurrent ? 'text-white' : isDone ? 'text-[#9CA3AF] line-through' : 'text-[#D1D5DB]'
                            }`}
                          >
                            {s.title}
                          </span>
                          <span className="text-xs text-[#8A8F9E]">{s.time}</span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#2E313A] text-xs text-[#9CA3AF] flex items-center justify-between">
            <span>Consistent 15m/day outperforms 8h weekend sprints.</span>
          </div>
        </div>

        {/* Right Column: Active Task Workspace (7 cols) */}
        <div className="col-span-7 bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E313A]">
              <div>
                <span className="text-xs font-bold text-[#D2F83D] uppercase tracking-wider">
                  Active Task • Step {currentStep}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5 tracking-tight">
                  {steps[currentStep - 1].title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={handleCompleteCurrentStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3B66F5] hover:bg-[#2F52C4] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Mark Done &amp; Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isAllCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 bg-[#18191D] border border-[#2E313A] rounded-xl text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#D2F83D]/10 border border-[#D2F83D]/30 flex items-center justify-center mx-auto text-[#D2F83D]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">Today’s Sprint Completed!</h4>
                    <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto mt-1 leading-relaxed">
                      All 4 daily marketing tasks executed in 12m 40s. Your pipeline, client messages, and post queues are 100% up to date.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-2">
                    <div className="p-3 bg-[#202227] border border-[#2E313A] rounded-lg text-left">
                      <div className="text-xs text-[#8A8F9E] uppercase tracking-wider font-semibold">Time Elapsed</div>
                      <div className="text-sm font-bold text-[#D2F83D] mt-0.5">12m 40s</div>
                    </div>
                    <div className="p-3 bg-[#202227] border border-[#2E313A] rounded-lg text-left">
                      <div className="text-xs text-[#8A8F9E] uppercase tracking-wider font-semibold">Next Session</div>
                      <div className="text-sm font-bold text-white mt-0.5">Tomorrow 9 AM</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 3 ? (
                    <div className="space-y-4">
                      {/* Target Lead Overview */}
                      <div className="p-4 bg-[#18191D] border border-[#2E313A] rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-bold text-white tracking-tight">Dr. Elena Rostova</div>
                          <span className="text-xs font-semibold text-[#F87171] bg-[#2A1618] border border-[#7F1D1D]/40 px-2 py-0.5 rounded">
                            5.1s Portal Latency (Critical)
                          </span>
                        </div>
                        <div className="text-xs text-[#9CA3AF] mb-3">
                          Meridian Clinics • 18,400 Monthly Patients • $8,500 Sprint Estimate
                        </div>

                        <div className="p-3 bg-[#202227] border border-[#2E313A] rounded-lg text-sm text-[#D1D5DB] leading-relaxed">
                          "Hi Dr. Rostova, noticed your note about patient portal delays. In medical clinics, mobile latency usually stems from legacy database table locks during slot queries. We recently resolved this for Northstar Health by migrating their scheduling system to a modern static-edge architecture, dropping load time from 5.1s to 0.7s without changing their database. I prepared a 2-page summary with exact fixes. Would you like me to send the breakdown over?"
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#18191D] border border-[#2E313A] rounded-xl text-xs text-[#9CA3AF]">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#D2F83D]" />
                          <span>Attached: 2-Page Performance Review (PDF)</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => onOpenProposal('Dr. Elena Rostova', 'meridianclinics.org')}
                          className="text-[#3B66F5] hover:underline font-semibold flex items-center gap-1 text-xs"
                        >
                          <span>Customize Proposal</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  ) : currentStep === 1 ? (
                    <div className="p-6 bg-[#18191D] border border-[#2E313A] rounded-xl text-center space-y-3">
                      <FileText className="w-8 h-8 text-[#D2F83D] mx-auto opacity-90" />
                      <h4 className="text-base font-bold text-white tracking-tight">Today's Case Study Post is Ready</h4>
                      <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
                        "How we rebuilt a healthcare booking portal to handle 20k daily appointments with zero downtime."
                      </p>
                      <div className="flex justify-center gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCompleteCurrentStep}
                          className="px-4 py-2 bg-[#D2F83D] text-[#18191D] font-bold rounded-lg text-xs hover:bg-[#C2E82D] shadow-sm"
                        >
                          Publish to Twitter &amp; Bluesky Now
                        </motion.button>
                      </div>
                    </div>
                  ) : currentStep === 2 ? (
                    <div className="p-6 bg-[#18191D] border border-[#2E313A] rounded-xl text-center space-y-3">
                      <h4 className="text-base font-bold text-white tracking-tight">2 New Client Inquiries</h4>
                      <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
                        Dr. Elena Rostova and Marcus Vance have posted urgent requirements matching your stack within the last 2 hours.
                      </p>
                      <div className="flex justify-center gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCompleteCurrentStep}
                          className="px-4 py-2 bg-[#3B66F5] text-white font-bold rounded-lg text-xs hover:bg-[#2F52C4] shadow-sm"
                        >
                          Review Suggested Message
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-[#18191D] border border-[#2E313A] rounded-xl text-center space-y-3">
                      <CheckCircle2 className="w-8 h-8 text-[#D2F83D] mx-auto" />
                      <h4 className="text-base font-bold text-white tracking-tight">Daily Schedule Verified</h4>
                      <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
                        Tomorrow’s story draft is saved and your schedule is up to date.
                      </p>
                      <div className="flex justify-center gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCompleteCurrentStep}
                          className="px-4 py-2 bg-[#D2F83D] text-[#18191D] font-bold rounded-lg text-xs hover:bg-[#C2E82D] shadow-sm"
                        >
                          Complete Sprint
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-[#2E313A] flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Next daily sprint scheduled tomorrow at 09:00 AM</span>
            <button
              onClick={handleCompleteCurrentStep}
              className="text-[#D2F83D] hover:underline font-bold"
            >
              Advance to Next Task →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
