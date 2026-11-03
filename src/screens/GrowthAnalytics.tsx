import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, Users, Target, BarChart3, Award } from 'lucide-react';

export const GrowthAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30D' | '90D' | 'YTD'>('30D');

  const funnelSteps = [
    { label: 'Audits & Reviews Sent', count: 142, percentage: '100%', color: 'bg-[#3B66F5]' },
    { label: 'Direct Replies & Discovery Calls', count: 58, percentage: '40.8%', color: 'bg-[#60A5FA]' },
    { label: 'Proposal Packages Sent', count: 26, percentage: '18.3%', color: 'bg-[#A78BFA]' },
    { label: 'Closed Modernization Sprints', count: 12, percentage: '8.5%', color: 'bg-[#D2F83D]' }
  ];

  const topAssets = [
    {
      title: 'Northstar Health Portal Modernization',
      category: 'Healthcare',
      deals: 5,
      revenue: '$47,500',
      winRate: '38%'
    },
    {
      title: 'Stride Gear Checkout Speed Overhaul',
      category: 'E-Commerce',
      deals: 4,
      revenue: '$34,000',
      winRate: '29%'
    },
    {
      title: 'FinScale High-Speed Booking System',
      category: 'Fintech',
      deals: 3,
      revenue: '$28,500',
      winRate: '24%'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#18191D] p-6 text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Growth &amp; Revenue Analytics</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D2F83D]/10 border border-[#D2F83D]/30 text-[#D2F83D] font-bold">
              +24% Month over Month
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Direct attribution between published case studies, sent audit reviews, and closed deals.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#202227] border border-[#2E313A] rounded-lg p-1">
          {(['30D', '90D', 'YTD'] as const).map(range => (
            <motion.button
              key={range}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                timeRange === range
                  ? 'bg-[#3B66F5] text-white shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {range === '30D' ? 'Last 30 Days' : range === '90D' ? 'Last Quarter' : 'Year to Date'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 hover:border-[#3E424E] transition-colors"
        >
          <div className="flex items-center justify-between text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">
            <span>Attributed Revenue</span>
            <DollarSign className="w-4 h-4 text-[#D2F83D]" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 tracking-tight">$68,450</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#D2F83D]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+$13,200 vs last month</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 hover:border-[#3E424E] transition-colors"
        >
          <div className="flex items-center justify-between text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">
            <span>Avg Sprint Value</span>
            <Target className="w-4 h-4 text-[#3B66F5]" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 tracking-tight">$9,780</div>
          <div className="text-xs text-[#9CA3AF] mt-2">
            Based on 12 closed packages
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 hover:border-[#3E424E] transition-colors"
        >
          <div className="flex items-center justify-between text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">
            <span>Audit-to-Close Rate</span>
            <Award className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#10B981] mt-1.5 tracking-tight">18.4%</div>
          <div className="text-xs text-[#9CA3AF] mt-2">
            Industry average: 4.2%
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 hover:border-[#3E424E] transition-colors"
        >
          <div className="flex items-center justify-between text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">
            <span>Active Retainers</span>
            <Users className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div className="text-2xl font-bold text-white mt-1.5 tracking-tight">6 Clients</div>
          <div className="text-xs text-[#9CA3AF] mt-2">
            $22,000 / month recurring
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Funnel & Top Proof Assets */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left: Funnel (7 cols) */}
        <div className="col-span-7 bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E313A]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Client Acquisition Funnel</h3>
                <p className="text-xs text-[#9CA3AF]">
                  Conversion stages from cold website audit review to executed client contract.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#D2F83D] bg-[#D2F83D]/10 px-2.5 py-1 rounded-md border border-[#D2F83D]/20">
                12 Paid Deals
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              {funnelSteps.map((step, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{step.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{step.count}</span>
                      <span className="text-xs text-[#9CA3AF]">({step.percentage})</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-[#18191D] rounded-full overflow-hidden border border-[#2E313A]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: step.percentage }}
                      transition={{ duration: 0.6, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${step.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2E313A] flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Average sales cycle: <strong className="text-white">6.2 days</strong> from audit review</span>
            <span className="text-[#3B66F5] font-semibold cursor-pointer hover:underline">Download Funnel CSV</span>
          </div>
        </div>

        {/* Right: Top Performing Proof Assets (5 cols) */}
        <div className="col-span-5 bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E313A]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Top Revenue Assets</h3>
                <p className="text-xs text-[#9CA3AF]">Which case studies generated the highest deals.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {topAssets.map((asset, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="p-2.5 bg-[#18191D] border border-[#2E313A] rounded-lg hover:border-[#3B66F5] transition-colors cursor-default"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#D2F83D] uppercase tracking-wider">
                      {asset.category}
                    </span>
                    <span className="text-xs font-bold text-white">{asset.revenue}</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1 tracking-tight">{asset.title}</div>
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                    <span>{asset.deals} Deals Closed</span>
                    <span className="text-[#34D399] font-medium">{asset.winRate} Win Rate</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#2E313A] text-center">
            <span className="text-xs text-[#9CA3AF]">
              Case study assets have a <strong className="text-white">4.3x</strong> higher reply rate than generic outreach messages.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
