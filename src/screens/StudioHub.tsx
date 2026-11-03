import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WeeklyReachSpline } from '../components/WeeklyReachSpline';
import { ScheduleCalendar } from '../components/ScheduleCalendar';
import { FocusGauge } from '../components/FocusGauge';
import { ClientGoalBar } from '../components/ClientGoalBar';
import { Search, Plus, ArrowUpRight, MessageSquare, Send, FileText, X } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface StudioHubProps {
  onOpenNewPost: () => void;
  onOpenSprint: () => void;
  onOpenAudit: () => void;
}

export const StudioHub: React.FC<StudioHubProps> = ({
  onOpenNewPost,
  onOpenSprint,
  onOpenAudit,
}) => {
  const { settings, posts } = useStudio();
  const [activeFilter, setActiveFilter] = useState<'all' | 'social' | 'outreach'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const firstPost = posts[0];
  const secondPost = posts[1];
  const thirdPost = posts[2];

  const campaigns = [
    {
      id: 'c1',
      title: firstPost?.title?.slice(0, 24) || 'Public Thread',
      time: firstPost?.scheduledTime ? `${firstPost.scheduledTime} • ${firstPost.parts || '3 parts'}` : '7:00 AM Today • 3 parts',
      channel: firstPost?.channel || 'Bluesky & X',
      type: 'social' as const,
      icon: MessageSquare,
      isPrimary: true,
      onClick: onOpenNewPost
    },
    {
      id: 'c2',
      title: secondPost?.title?.slice(0, 24) || 'Clinic Follow-up',
      time: secondPost?.scheduledTime ? `${secondPost.scheduledTime} • ${secondPost.category || 'Outreach'}` : '2:30 PM Today • Dr. Elena',
      channel: secondPost?.channel || 'Outreach',
      type: 'outreach' as const,
      icon: Send,
      isPrimary: false,
      tagColor: 'text-[#D2F83D]',
      onClick: onOpenAudit
    },
    {
      id: 'c3',
      title: thirdPost?.title?.slice(0, 24) || 'Dev Story Blog',
      time: thirdPost?.scheduledTime ? `${thirdPost.scheduledTime} • ${thirdPost.category || 'Story'}` : '5:00 PM Today • Next.js',
      channel: thirdPost?.channel || 'Dev Blog',
      type: 'social' as const,
      icon: FileText,
      isPrimary: false,
      tagColor: 'text-[#60A5FA]',
      onClick: onOpenSprint
    }
  ];

  const filteredCampaigns = campaigns.filter(c => {
    const matchesFilter =
      activeFilter === 'all' ? true :
      activeFilter === 'social' ? c.type === 'social' :
      c.type === 'outreach';

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      c.channel.toLowerCase().includes(q) ||
      c.time.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto max-w-[1340px] select-none">
      {/* Top Greeting & Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {`Hello, ${settings.founderName ? settings.founderName.split(' ')[0] : 'Alex'}!`}
          </h1>
          <p className="text-sm text-[#8A8F9E] mt-0.5">
            Here is your marketing and client overview for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Pill */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#202227] border border-[#2E313A] w-[260px] text-xs text-[#8A8F9E] focus-within:border-[#3B66F5] focus-within:ring-2 focus-within:ring-[#3B66F5]/20 transition-all">
            <Search size={14} className="text-[#8A8F9E] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, clients, campaigns..."
              className="bg-transparent border-none outline-none text-white text-xs placeholder-[#656A78] w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#8A8F9E] hover:text-white transition-colors"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Create Post Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={onOpenNewPost}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3B66F5] hover:bg-[#2e55dc] text-white font-bold text-xs shadow-lg shadow-[#3B66F5]/25 transition-colors"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Create Post</span>
          </motion.button>
        </div>
      </div>

      {/* Row 1: Weekly Views Spline (770px) & Content Schedule (430px) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-7 xl:col-span-7">
          <WeeklyReachSpline />
        </div>
        <div className="col-span-12 lg:col-span-5 xl:col-span-5">
          <ScheduleCalendar />
        </div>
      </div>

      {/* Row 2: Daily Focus & Goal (370px) + Scheduled Campaigns (830px) */}
      <div className="grid grid-cols-12 gap-5 pb-4">
        {/* Left Stacked Cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <FocusGauge currentHours={7.5} goalHours={8.0} />
          <ClientGoalBar current={16} target={20} />
        </div>

        {/* Right: Scheduled Campaigns Card */}
        <div className="col-span-12 lg:col-span-8 bg-[#202227] rounded-[28px] border border-[#2E313A] p-6 shadow-xl flex flex-col justify-between hover:border-[#3E424E] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-white tracking-tight">
                My Scheduled Campaigns
              </h3>
              <span className="text-xs text-[#8A8F9E]">
                {filteredCampaigns.length} campaigns planned today
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2.5 mb-5">
              {(['all', 'social', 'outreach'] as const).map(f => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === f
                      ? 'bg-[#D2F83D] text-[#18191D] shadow-sm'
                      : 'bg-[#2A2D35] text-[#8A8F9E] hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All (3)' : f === 'social' ? 'Social Media' : 'Client Outreach'}
                </motion.button>
              ))}
            </div>

            {/* Campaign Cards Row */}
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredCampaigns.map(c => {
                  const Icon = c.icon;
                  if (c.isPrimary) {
                    return (
                      <motion.div
                        key={c.id}
                        whileHover={{ y: -3, scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        onClick={c.onClick}
                        className="bg-[#3B66F5] rounded-[22px] p-4 flex flex-col justify-between h-[165px] cursor-pointer hover:brightness-105 transition-all shadow-lg shadow-[#3B66F5]/20 group relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                            <Icon size={12} strokeWidth={2.2} />
                            <span>{c.channel}</span>
                          </div>
                          <ArrowUpRight size={18} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white tracking-tight">{c.title}</h4>
                          <p className="text-xs text-[#DCE6FF] mt-0.5">{c.time}</p>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={c.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      onClick={c.onClick}
                      className="bg-[#18191D] rounded-[22px] border border-[#2E313A] p-4 flex flex-col justify-between h-[165px] cursor-pointer hover:border-[#3E424E] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202227] border border-[#2E313A] ${c.tagColor || 'text-[#8A8F9E]'} text-xs font-semibold`}>
                          <Icon size={12} strokeWidth={2.2} />
                          <span>{c.channel}</span>
                        </div>
                        <ArrowUpRight size={18} className="text-[#8A8F9E] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{c.title}</h4>
                        <p className="text-xs text-[#8A8F9E] mt-0.5">{c.time}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Card 4: + New Campaign */}
                <motion.div
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={onOpenNewPost}
                  className="bg-[#18191D] rounded-[22px] border-2 border-dashed border-[#3A3D46] hover:border-[#D2F83D] p-4 flex flex-col items-center justify-center h-[165px] cursor-pointer transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#202227] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Plus size={18} className="text-[#D2F83D]" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold text-[#8A8F9E] group-hover:text-white transition-colors">
                    + New Draft
                  </span>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-[#18191D]/40 rounded-2xl border border-dashed border-[#2E313A] text-center">
                <Search size={22} className="text-[#8A8F9E] mb-2 stroke-1" />
                <p className="text-xs font-semibold text-white">No campaigns found</p>
                <p className="text-xs text-[#8A8F9E] mt-0.5">No scheduled campaigns match "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                  className="mt-3 text-xs px-3 py-1 rounded-md bg-[#252830] hover:bg-[#2E313A] text-[#D2F83D] border border-[#2E313A] transition-colors"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
