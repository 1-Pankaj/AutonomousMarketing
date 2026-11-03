import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Clock, Smartphone, Server, ArrowUpRight, CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { Lead } from '../types';

interface AuditReportProps {
  lead?: Lead | null;
  onBack: () => void;
  onOpenProposal: (leadName: string, domain: string) => void;
  onShowToast?: (title: string, message: string, type: 'success' | 'info') => void;
}

export const AuditReport: React.FC<AuditReportProps> = ({ lead, onBack, onOpenProposal, onShowToast }) => {
  const targetLead = lead || {
    id: 'lead-1',
    name: 'Meridian Health & Diagnostics',
    domain: 'meridianhealth.io',
    category: 'Healthcare Clinic',
    healthScore: 32,
    healthStatus: 'Critical',
    vulnerability: 'Broken mobile scheduling, slow 4.2s LCP, no API',
    monthlyVisitors: '18.4K',
    opportunityValue: '$9,500'
  };

  const handleExportPDF = () => {
    if (onShowToast) {
      onShowToast(
        'Review PDF Exported',
        `Executive review for ${targetLead.name} saved to downloads.`,
        'success'
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#18191D] p-6 text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={onBack}
            className="p-2 bg-[#202227] hover:bg-[#252830] border border-[#2E313A] rounded-lg text-[#9CA3AF] hover:text-white transition-colors"
            title="Back to Lead Radar"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Client Performance Review</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2A1618] border border-[#7F1D1D]/40 text-[#F87171] font-bold">
                Health Score: {targetLead.healthScore}/100
              </span>
            </h1>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Executive performance review and recommendations for <strong className="text-white">{targetLead.name}</strong> ({targetLead.domain}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202227] hover:bg-[#252830] border border-[#2E313A] text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Export PDF</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => onOpenProposal(targetLead.name, targetLead.domain)}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#3B66F5] hover:bg-[#2F52C4] text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-[#3B66F5]/20 cursor-pointer"
          >
            <span>Send Upgrade Proposal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* Big Alert Banner */}
        <div className="bg-[#2A1618] border border-[#7F1D1D]/60 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#7F1D1D]/40 text-[#F87171] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Estimated Monthly Revenue Friction: $14,200</h3>
              <p className="text-xs text-[#FCA5A5] mt-1 leading-relaxed max-w-2xl">
                Slow mobile load speeds and tap-target collisions cause over 42% of prospective patients to abandon the appointment booking step on smartphones.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#FCA5A5] font-semibold uppercase tracking-wider">Health Rating</div>
            <div className="text-2xl font-black text-[#F87171] tracking-tight">{targetLead.healthScore} / 100</div>
          </div>
        </div>

        {/* 3 Metric Cards with Progress Bars */}
        <div className="grid grid-cols-3 gap-5">
          {/* Mobile Load Time */}
          <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F87171]" />
                  Mobile Load Time
                </span>
                <span className="text-xs font-black text-[#F87171] bg-[#2A1618] px-2 py-0.5 rounded border border-[#7F1D1D]/40">
                  4.2s (Slow)
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Current vs Target (&lt; 1.2s)</span>
                  <span className="text-white font-bold">3.5x Slower</span>
                </div>
                <div className="h-2 w-full bg-[#18191D] rounded-full overflow-hidden border border-[#2E313A]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-[#EF4444] rounded-full"
                  />
                </div>
              </div>

              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                First Contentful Paint on mobile 4G connections takes over 4 seconds, causing high bounce rates before patients view doctors.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2E313A] text-xs text-[#9CA3AF]">
              Fix: Edge static HTML caching + optimized asset delivery
            </div>
          </div>

          {/* Mobile Usability Score */}
          <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#F87171]" />
                  Mobile Usability
                </span>
                <span className="text-xs font-black text-[#F87171] bg-[#2A1618] px-2 py-0.5 rounded border border-[#7F1D1D]/40">
                  28 / 100
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Viewport Compatibility</span>
                  <span className="text-white font-bold">Failed</span>
                </div>
                <div className="h-2 w-full bg-[#18191D] rounded-full overflow-hidden border border-[#2E313A]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '28%' }}
                    transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-[#EF4444] rounded-full"
                  />
                </div>
              </div>

              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                Booking buttons overlap on iPhone screens under 400px width. Tap targets on time slot selector are too close together.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2E313A] text-xs text-[#9CA3AF]">
              Fix: Responsive Tailwind grid + accessible touch targets
            </div>
          </div>

          {/* Server API Delay */}
          <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-[#F59E0B]" />
                  Database Query Delay
                </span>
                <span className="text-xs font-black text-[#F59E0B] bg-[#2B2114] px-2 py-0.5 rounded border border-[#78350F]/40">
                  0.8s Latency
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Backend Slot Queries</span>
                  <span className="text-white font-bold">High Wait</span>
                </div>
                <div className="h-2 w-full bg-[#18191D] rounded-full overflow-hidden border border-[#2E313A]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-[#F59E0B] rounded-full"
                  />
                </div>
              </div>

              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                Appointment queries trigger full unindexed table scans on every calendar date switch, causing repeated timeout errors.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2E313A] text-xs text-[#9CA3AF]">
              Fix: Redis / edge cache layer for available slot queries
            </div>
          </div>
        </div>

        {/* Proposed Modernization Sprint Package */}
        <div className="bg-[#202227] border border-[#2E313A] rounded-2xl p-6 hover:border-[#3E424E] transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-xs font-bold text-[#D2F83D] uppercase tracking-wider">
                Recommended Solution
              </span>
              <h3 className="text-base font-bold text-white mt-0.5 tracking-tight">
                14-Day Performance Upgrade Plan ($9,500 Fixed Scope)
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => onOpenProposal(targetLead.name, targetLead.domain)}
              className="px-4 py-2 bg-[#D2F83D] hover:bg-[#C2E82D] text-[#18191D] rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Prepare Client Message
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="p-4 bg-[#18191D] border border-[#2E313A] rounded-xl space-y-2 hover:border-[#3B66F5] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-[#D2F83D]" />
                <span>Next.js Edge Booking Portal</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Replaces slow legacy monolithic PHP frontend with an instant mobile-optimized Next.js web application.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="p-4 bg-[#18191D] border border-[#2E313A] rounded-xl space-y-2 hover:border-[#3B66F5] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-[#D2F83D]" />
                <span>Slot Caching &amp; API Layer</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Adds a lightweight caching layer over the existing database, dropping calendar latency from 0.8s to 0.05s.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="p-4 bg-[#18191D] border border-[#2E313A] rounded-xl space-y-2 hover:border-[#3B66F5] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white tracking-tight">
                <CheckCircle2 className="w-4 h-4 text-[#D2F83D]" />
                <span>Zero-Downtime Rollout</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Full cutover performed without taking down existing patient records or requiring staff retraining.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
