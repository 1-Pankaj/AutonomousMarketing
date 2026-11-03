import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Copy, Check, ArrowUpRight, Briefcase, ShieldCheck, Search, X } from 'lucide-react';
import { SocialIntent } from '../types';
import { useStudio } from '../context/StudioContext';

interface ClientOpportunitiesProps {
  onOpenProposal: (leadName: string, domain: string) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'info') => void;
}

const INTENT_STREAMS: SocialIntent[] = [
  {
    id: 'intent-1',
    authorName: 'Dr. Elena Rostova',
    authorHandle: '@dr_rostova',
    authorRole: 'Director @ Meridian Clinics',
    platform: 'Bluesky',
    content: 'Our medical practice portal takes 5 seconds to load on phones. Patients keep complaining about scheduling timeouts. Who can fix this without breaking our existing backend?',
    timeAgo: '18m ago',
    matchScore: 98,
    estimatedBudget: '$8,500',
    tags: ['Healthcare', 'Mobile Speed', 'Portal Rewrite'],
    relevance: 'High Intent'
  },
  {
    id: 'intent-2',
    authorName: 'Marcus Vance',
    authorHandle: '@marcusvance',
    authorRole: 'VP Product @ FinScale',
    platform: 'Twitter',
    content: 'Looking for a senior solo engineer to rewrite our legacy PHP booking system to modern Next.js before Q1. Clean codebase and clear requirements ready.',
    timeAgo: '42m ago',
    matchScore: 96,
    estimatedBudget: '$12,000',
    tags: ['Full Stack', 'Next.js', 'Legacy Migration'],
    relevance: 'High Intent'
  },
  {
    id: 'intent-3',
    authorName: 'Liam Chen',
    authorHandle: '@liamchen_ecom',
    authorRole: 'Founder @ Orbit Supply',
    platform: 'Twitter',
    content: 'Need an agency or senior dev to audit and redesign our Shopify checkout flow. High drop-off at payment step and slow 4.2s initial load.',
    timeAgo: '2h ago',
    matchScore: 91,
    estimatedBudget: '$15,000',
    tags: ['E-Commerce', 'Checkout Audit', 'Conversion'],
    relevance: 'High Intent'
  },
  {
    id: 'intent-4',
    authorName: 'Sarah Jenkins',
    authorHandle: '@sjenkins_legal',
    authorRole: 'Managing Partner @ Apex Law',
    platform: 'Bluesky',
    content: 'Our client intake form has zero mobile encryption warnings and takes forever to submit documents. Need a rapid modernization sprint.',
    timeAgo: '3h ago',
    matchScore: 89,
    estimatedBudget: '$9,200',
    tags: ['Security', 'Forms', 'Client Intake'],
    relevance: 'Qualified Lead'
  }
];

export const ClientOpportunities: React.FC<ClientOpportunitiesProps> = ({ onOpenProposal, onShowToast }) => {
  const { intents } = useStudio();
  const intentList = intents.length > 0 ? intents : INTENT_STREAMS;
  const [selectedIntentId, setSelectedIntentId] = useState<string>('intent-1');
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'All' | 'High' | 'Healthcare' | 'Ecommerce'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIntents = intentList.filter(item => {
    const matchesFilter =
      filter === 'All' ? true :
      filter === 'High' ? item.matchScore >= 95 :
      filter === 'Healthcare' ? item.tags.includes('Healthcare') :
      filter === 'Ecommerce' ? item.tags.includes('E-Commerce') : true;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      item.authorName.toLowerCase().includes(q) ||
      item.authorRole.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const selectedIntent =
    filteredIntents.find(i => i.id === selectedIntentId) ||
    filteredIntents[0] ||
    INTENT_STREAMS[0];

  const getMessageContent = (intent: SocialIntent) => {
    if (intent.id === 'intent-1') {
      return {
        p1: `Hi Dr. Rostova, noticed your note about the patient portal load delays. In healthcare practices, mobile latency usually stems from un-cached database locks during appointment slot queries.`,
        p2: `We recently solved this exact issue for Northstar Health by migrating their scheduling interface to a modern static-edge architecture, reducing patient wait time from 5.1s down to 0.7s without altering their core records system.`,
        p3: `I prepared a 2-page review of your portal with exact fixes and benchmarks. Would you like me to send it over?`
      };
    } else if (intent.id === 'intent-2') {
      return {
        p1: `Hi Marcus, saw your post regarding the PHP booking overhaul. Replacing slow legacy booking systems with fast Next.js pages eliminates the typical session timeouts during traffic peaks.`,
        p2: `We specialize in zero-downtime database migrations, wrapping existing schemas in high-throughput API endpoints so your operations continue uninterrupted.`,
        p3: `I can share an architecture summary and our 14-day execution roadmap if you'd like to review.`
      };
    } else {
      return {
        p1: `Hi ${intent.authorName.split(' ')[0]}, saw your post regarding ${intent.tags[0].toLowerCase()} modernization.`,
        p2: `We have completed similar sprint overhauls resulting in direct speed and conversion improvements with measurable attribution.`,
        p3: `I have compiled a quick review highlighting the highest impact bottlenecks. Happy to share the report.`
      };
    }
  };

  const message = getMessageContent(selectedIntent);

  const handleCopyMessage = () => {
    const fullText = `${message.p1}\n\n${message.p2}\n\n${message.p3}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    onShowToast('Message Copied', 'Suggested message ready to paste.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#18191D] p-6 text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Client Opportunities</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B66F5]/20 border border-[#3B66F5]/40 text-[#60A5FA] font-medium">
              Live Inquiries
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Real-time prospective client inquiries, relevant case studies, and suggested messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#202227] border border-[#2E313A] w-[220px] text-xs text-[#8A8F9E] focus-within:border-[#3B66F5] focus-within:ring-2 focus-within:ring-[#3B66F5]/20 transition-all">
            <Search size={13} className="text-[#8A8F9E] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, tags..."
              className="bg-transparent border-none outline-none text-white text-xs placeholder-[#656A78] w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#8A8F9E] hover:text-white transition-colors"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Scope Filter Pills */}
          <div className="flex items-center gap-1.5">
            {(['All', 'High', 'Healthcare', 'Ecommerce'] as const).map(tab => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === tab
                    ? 'bg-[#D2F83D] text-[#18191D] font-bold shadow-sm'
                    : 'bg-[#202227] text-[#9CA3AF] hover:text-white border border-[#2E313A]'
                }`}
              >
                {tab === 'All' ? `All (${INTENT_STREAMS.length})` :
                 tab === 'High' ? 'High Intent (95%+)' :
                 tab === 'Healthcare' ? 'Healthcare' : 'E-Commerce'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column & Right Column */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Intent Feed (5 cols) */}
        <div className="col-span-5 flex flex-col gap-3 overflow-y-auto pr-1">
          {filteredIntents.length > 0 ? (
            filteredIntents.map(item => {
              const isSelected = item.id === (selectedIntent?.id || selectedIntentId);
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => setSelectedIntentId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#252830] border-[#D2F83D] shadow-lg shadow-[#D2F83D]/5 ring-1 ring-[#D2F83D]/30'
                      : 'bg-[#202227] border-[#2E313A] hover:border-[#3E424E]'
                  }`}
                >
                  {/* Author Info & Match Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#3B66F5] flex items-center justify-center font-bold text-xs text-white shadow-sm">
                        {item.authorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white tracking-tight">{item.authorName}</div>
                        <div className="text-xs text-[#9CA3AF]">{item.authorRole}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9CA3AF]">{item.timeAgo}</span>
                      <span className="text-xs font-bold text-[#D2F83D] bg-[#D2F83D]/10 px-2.5 py-0.5 rounded-full border border-[#D2F83D]/20">
                        {item.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Intent Content */}
                  <p className="text-sm text-[#E5E7EB] leading-relaxed mb-3 line-clamp-3">
                    "{item.content}"
                  </p>

                  {/* Tags & Estimated Budget */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#2E313A]/60">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tags.map(t => (
                        <span key={t} className="text-xs px-2.5 py-0.5 rounded bg-[#18191D] border border-[#2E313A] text-[#9CA3AF]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm font-bold text-[#34D399]">
                      {item.estimatedBudget}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-[#202227] rounded-xl border border-dashed border-[#2E313A] text-center p-6">
              <Search size={22} className="text-[#8A8F9E] mb-2 stroke-1" />
              <p className="text-sm font-semibold text-white">No inquiries found</p>
              <p className="text-xs text-[#8A8F9E] mt-0.5">No client leads match "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setFilter('All'); }}
                className="mt-3 text-xs px-3 py-1 rounded-md bg-[#252830] hover:bg-[#2E313A] text-[#D2F83D] border border-[#2E313A] transition-colors"
              >
                Reset Inquiries
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Matched Message & Case Study Proof (7 cols) */}
        <div className="col-span-7 flex flex-col gap-4 overflow-y-auto">
          {/* Top: Relevant Case Study Proof */}
          <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-4 hover:border-[#3E424E] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#D2F83D]" />
                <span>Relevant Case Studies</span>
              </div>
              <span className="text-xs text-[#9CA3AF]">2 Case Studies</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-[#18191D] border border-[#2E313A] rounded-lg p-3 hover:border-[#3B66F5] transition-colors"
              >
                <div className="text-xs text-[#3B66F5] font-bold uppercase tracking-wider mb-1">
                  Healthcare Performance
                </div>
                <div className="text-sm font-bold text-white mb-1 tracking-tight">
                  Northstar Health Portal Modernization
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-2">
                  Reduced patient appointment load time from 5.1s to 0.7s via Next.js edge caching.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] font-semibold">
                    -74% Latency
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#3B66F5]/15 text-[#60A5FA] font-semibold">
                    +180% Bookings
                  </span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-[#18191D] border border-[#2E313A] rounded-lg p-3 hover:border-[#3B66F5] transition-colors"
              >
                <div className="text-xs text-[#D2F83D] font-bold uppercase tracking-wider mb-1">
                  E-Commerce Speed
                </div>
                <div className="text-sm font-bold text-white mb-1 tracking-tight">
                  Stride Gear Checkout Optimization
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-2">
                  Rebuilt checkout pipeline, reducing drop-offs and accelerating page speeds.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] font-semibold">
                    4.2s → 0.8s Mobile Speed
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D2F83D]/15 text-[#D2F83D] font-semibold">
                    +34% Checkout Rate
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom: Suggested Message & Case Study Proof */}
          <div className="flex-1 bg-[#202227] border border-[#2E313A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3E424E] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E313A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D2F83D] text-[#18191D] flex items-center justify-center font-black text-sm">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Suggested Message</h3>
                    <p className="text-xs text-[#9CA3AF]">
                      Tailored for <span className="text-white font-medium">{selectedIntent.authorName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18191D] hover:bg-[#252830] border border-[#2E313A] text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#D2F83D]" /> : <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />}
                    <span>{copied ? 'Copied' : 'Copy Message'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Message Body with smooth AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIntent.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5 bg-[#18191D] border border-[#2E313A] rounded-xl p-4 text-sm text-[#E5E7EB] leading-relaxed"
                >
                  <p className="font-normal">{message.p1}</p>
                  <p className="font-normal text-[#D1D5DB]">{message.p2}</p>
                  <p className="font-normal text-[#9CA3AF] italic">{message.p3}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#2E313A]">
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <ShieldCheck className="w-4 h-4 text-[#D2F83D]" />
                <span>Includes 2-page performance review and benchmark comparisons.</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => onOpenProposal(selectedIntent.authorName, 'client-inbound.io')}
                className="flex items-center gap-2 px-4 py-2 bg-[#3B66F5] hover:bg-[#2F52C4] text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-[#3B66F5]/20 cursor-pointer"
              >
                <span>Send Proposal &amp; Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
