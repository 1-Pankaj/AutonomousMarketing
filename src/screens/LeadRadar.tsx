import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Target, Search, ArrowUpRight, ShieldAlert, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lead } from '../types';
import { useStudio } from '../context/StudioContext';

interface LeadRadarProps {
  onOpenAudit?: (lead: Lead) => void;
  onOpenProposal?: (lead: Lead) => void;
}

export const LeadRadar: React.FC<LeadRadarProps> = ({ onOpenAudit: propOpenAudit, onOpenProposal: propOpenProposal }) => {
  const { leads, pipelineStats, openAudit: ctxOpenAudit, openProposal: ctxOpenProposal, isLoadingLeads } = useStudio();

  const handleOpenAudit = propOpenAudit || ctxOpenAudit;
  const handleOpenProposal = propOpenProposal || ctxOpenProposal;

  const [filter, setFilter] = useState<'All' | 'Critical' | 'Moderate' | 'Healthy'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filter leads based on tab and search query
  const filteredLeads = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return leads.filter(lead => {
      const matchesFilter =
        filter === 'All' ? true :
        filter === 'Critical' ? lead.healthStatus === 'Critical' :
        filter === 'Moderate' ? (lead.healthStatus === 'Moderate' || lead.healthStatus === 'Fair') :
        lead.healthStatus === 'Healthy';

      if (!matchesFilter) return false;
      if (!q) return true;

      return (
        lead.name.toLowerCase().includes(q) ||
        lead.domain.toLowerCase().includes(q) ||
        lead.category.toLowerCase().includes(q) ||
        lead.vulnerability.toLowerCase().includes(q) ||
        (lead.city && lead.city.toLowerCase().includes(q))
      );
    });
  }, [leads, filter, searchQuery]);

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (newFilter: 'All' | 'Critical' | 'Moderate' | 'Healthy') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const currentSafePage = Math.min(currentPage, totalPages);
  const startIndex = (currentSafePage - 1) * pageSize;
  const paginatedLeads = useMemo(() => {
    return filteredLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredLeads, startIndex, pageSize]);

  const getBadgeStyle = (status: Lead['healthStatus']) => {
    switch (status) {
      case 'Critical':
        return {
          badge: 'bg-[#2A1618] text-[#F87171] border border-[#7F1D1D]/40',
          bar: 'bg-[#EF4444]'
        };
      case 'Moderate':
        return {
          badge: 'bg-[#2B2114] text-[#FBBF24] border border-[#78350F]/40',
          bar: 'bg-[#F59E0B]'
        };
      case 'Fair':
        return {
          badge: 'bg-[#14261C] text-[#34D399] border border-[#065F46]/40',
          bar: 'bg-[#10B981]'
        };
      case 'Healthy':
      default:
        return {
          badge: 'bg-[#13233A] text-[#60A5FA] border border-[#1E3A8A]/40',
          bar: 'bg-[#3B66F5]'
        };
    }
  };

  const getIconColor = (id: string) => {
    const colors = [
      'bg-[#3B66F5]',
      'bg-[#8B5CF6]',
      'bg-[#D2F83D] text-[#18191D]',
      'bg-[#F97316]',
      'bg-[#06B6D4]',
      'bg-[#EC4899]'
    ];
    const index = parseInt(id.replace(/\D/g, '') || '0', 10) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#18191D] p-6 text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Lead Radar &amp; CRM</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#202227] border border-[#2E313A] text-[#9CA3AF] font-normal">
              Live Scanner
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Real-time local opportunities radar, digital health scores, and client modernization outreach.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search domain, name, or flaw..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#202227] border border-[#2E313A] rounded-lg text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D2F83D] focus:ring-1 focus:ring-[#D2F83D]/20 w-64 transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => {
              const target = paginatedLeads[0] || leads[0];
              if (target) handleOpenProposal(target);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#3B66F5] hover:bg-[#2F52C4] text-white rounded-lg text-xs font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
          >
            <span>Send Client Proposal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 flex items-center justify-between hover:border-[#3E424E] transition-colors"
        >
          <div>
            <div className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Scanned Pipeline</div>
            <div className="text-xl font-bold text-white mt-1">
              {pipelineStats.total.toLocaleString()} <span className="text-xs font-normal text-[#6B7280]">Targets</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#18191D] border border-[#2E313A] flex items-center justify-center text-[#D2F83D]">
            <Target className="w-4 h-4" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 flex items-center justify-between hover:border-[#3E424E] transition-colors"
        >
          <div>
            <div className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Critical Gaps</div>
            <div className="text-xl font-bold text-[#F87171] mt-1">
              {pipelineStats.critical.toLocaleString()} <span className="text-xs font-normal text-[#6B7280]">Urgent</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#2A1618] border border-[#7F1D1D]/40 flex items-center justify-center text-[#F87171]">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 flex items-center justify-between hover:border-[#3E424E] transition-colors"
        >
          <div>
            <div className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Modernization Candidates</div>
            <div className="text-xl font-bold text-[#FBBF24] mt-1">
              {pipelineStats.moderate.toLocaleString()} <span className="text-xs font-normal text-[#6B7280]">Qualified</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#2B2114] border border-[#78350F]/40 flex items-center justify-center text-[#FBBF24]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 flex items-center justify-between hover:border-[#3E424E] transition-colors"
        >
          <div>
            <div className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">Healthy Systems</div>
            <div className="text-xl font-bold text-[#60A5FA] mt-1">
              {pipelineStats.healthy.toLocaleString()} <span className="text-xs font-normal text-[#6B7280]">Monitored</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#13233A] border border-[#1E3A8A]/40 flex items-center justify-center text-[#60A5FA]">
            <CheckCircle className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-3.5">
        {(['All', 'Critical', 'Moderate', 'Healthy'] as const).map((tab) => {
          const isActive = filter === tab;
          const label =
            tab === 'All' ? `All Targets (${pipelineStats.total.toLocaleString()})` :
            tab === 'Critical' ? `Critical Gaps (${pipelineStats.critical.toLocaleString()})` :
            tab === 'Moderate' ? `Modernization Opportunities (${pipelineStats.moderate.toLocaleString()})` :
            `Healthy Systems (${pipelineStats.healthy.toLocaleString()})`;

          return (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleFilterChange(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D2F83D] text-[#18191D] font-semibold shadow-sm'
                  : 'bg-[#202227] text-[#9CA3AF] hover:text-white border border-[#2E313A]'
              }`}
            >
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Leads Table Container */}
      <div className="flex-1 bg-[#202227] border border-[#2E313A] rounded-2xl overflow-hidden flex flex-col min-h-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#2E313A] text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider bg-[#1C1D22]">
          <div className="col-span-4">TARGET / DOMAIN</div>
          <div className="col-span-3">DIGITAL HEALTH</div>
          <div className="col-span-3">DETECTED GAP / ISSUE</div>
          <div className="col-span-2 text-right">ACTION</div>
        </div>

        {/* Table Rows (Scrollable) */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2E313A]/60">
          {paginatedLeads.map((lead) => {
            const style = getBadgeStyle(lead.healthStatus);
            return (
              <motion.div
                key={lead.id}
                whileHover={{ backgroundColor: 'rgba(37, 40, 48, 0.8)' }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center transition-colors group cursor-default"
              >
                {/* Target / Domain */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${getIconColor(lead.id)} shadow-sm`}>
                    {lead.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate group-hover:text-[#D2F83D] transition-colors">
                      {lead.name}
                    </div>
                    <div className="text-xs text-[#9CA3AF] flex items-center gap-1.5 mt-0.5 truncate">
                      <span className="text-[#3B66F5] hover:underline cursor-pointer">{lead.domain}</span>
                      <span>•</span>
                      <span>{lead.category}</span>
                      {lead.city && (
                        <>
                          <span>•</span>
                          <span className="text-[#6B7280]">{lead.city}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Digital Health Meter - Clean & Proportional */}
                <div className="col-span-3 flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap min-w-[92px] text-center shrink-0 ${style.badge}`}>
                    {lead.healthScore} {lead.healthStatus}
                  </span>
                  <div className="w-24 bg-[#18191D] h-2 rounded-full overflow-hidden border border-[#2E313A] shrink-0">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(lead.healthScore, 100)}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${style.bar}`}
                    />
                  </div>
                </div>

                {/* Detected Gap / Flaw */}
                <div className="col-span-3">
                  <p className="text-xs text-[#D1D5DB] line-clamp-2 leading-relaxed">
                    {lead.vulnerability}
                  </p>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    onClick={() => handleOpenAudit(lead)}
                    className="px-2.5 py-1 bg-[#252830] hover:bg-[#2E313A] border border-[#2E313A] text-[#9CA3AF] hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    title="View Full Website Audit"
                  >
                    Audit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    onClick={() => handleOpenProposal(lead)}
                    className="flex items-center gap-1 px-3 py-1 bg-[#D2F83D] hover:bg-[#C2E82D] text-[#18191D] rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Proposal</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}

          {filteredLeads.length === 0 && !isLoadingLeads && (
            <div className="p-12 text-center text-[#9CA3AF]">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No leads matching your search criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setFilter('All'); }}
                className="mt-3 text-xs text-[#D2F83D] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {isLoadingLeads && (
            <div className="p-12 text-center text-[#9CA3AF]">
              <p className="text-sm font-medium">Loading local business targets...</p>
            </div>
          )}
        </div>

        {/* Apple HIG Pagination Footer */}
        {filteredLeads.length > 0 && (
          <div className="px-6 py-3 border-t border-[#2E313A] bg-[#1C1D22] flex items-center justify-between text-xs text-[#9CA3AF]">
            <div>
              Showing <span className="font-semibold text-white">{startIndex + 1}</span>–
              <span className="font-semibold text-white">{Math.min(startIndex + pageSize, filteredLeads.length)}</span> of{' '}
              <span className="font-semibold text-white">{filteredLeads.length.toLocaleString()}</span> targets
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B7280]">
                Page {currentSafePage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: currentSafePage > 1 ? 1.06 : 1 }}
                  whileTap={{ scale: currentSafePage > 1 ? 0.94 : 1 }}
                  disabled={currentSafePage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
                    currentSafePage > 1
                      ? 'bg-[#252830] hover:bg-[#2E313A] border-[#2E313A] text-white cursor-pointer'
                      : 'bg-[#18191D]/50 border-[#2E313A]/50 text-[#4B5563] cursor-not-allowed'
                  }`}
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: currentSafePage < totalPages ? 1.06 : 1 }}
                  whileTap={{ scale: currentSafePage < totalPages ? 0.94 : 1 }}
                  disabled={currentSafePage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
                    currentSafePage < totalPages
                      ? 'bg-[#252830] hover:bg-[#2E313A] border-[#2E313A] text-white cursor-pointer'
                      : 'bg-[#18191D]/50 border-[#2E313A]/50 text-[#4B5563] cursor-not-allowed'
                  }`}
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
