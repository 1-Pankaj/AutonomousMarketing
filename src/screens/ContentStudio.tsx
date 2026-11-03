import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowUpRight, MessageCircle, Repeat2, Heart, Check, Send, X, FileText } from 'lucide-react';
import { QueuedPost } from '../types';
import { useStudio } from '../context/StudioContext';

interface ContentStudioProps {
  onPublishPost?: (postTitle: string) => void;
  onOpenNewPost?: () => void;
  posts?: QueuedPost[];
}

const DEFAULT_POSTS: QueuedPost[] = [
  {
    id: 'post-1',
    title: 'How We Modernized Our Workflow & Cut Load Times',
    channel: 'Bluesky / AT Protocol',
    scheduledTime: 'Today 9:00 AM',
    charCount: 395,
    parts: '3 parts',
    category: 'Technical Story',
    status: 'Ready',
    content: `1/ Why we built AutoMarket as a fast, private desktop app instead of another sluggish browser tool:\n\n2/ Everything loads instantly on your machine with zero spinners or downtime. Your client data never leaves your computer.\n\n3/ When you schedule a post, your marketing sprint updates automatically. Full breakdown and tips linked below.`,
  },
  {
    id: 'post-2',
    title: 'Common Mistakes When Automating Your Marketing',
    channel: 'Twitter / X',
    scheduledTime: 'Today 2:00 PM',
    charCount: 280,
    parts: 'Single post',
    category: 'Mobile Dev',
    status: 'Staged',
    content: `Most founders wait until their product is finished before telling anyone.\n\nHere is how to share small, daily progress updates that attract your first 100 users before launch day.`,
  },
  {
    id: 'post-3',
    title: 'Client Case Study: Helping Local Businesses Grow',
    channel: 'WhatsApp Outreach',
    scheduledTime: 'Tomorrow 11:30 AM',
    charCount: 540,
    parts: 'Direct sequence',
    category: '4 Clinics',
    status: 'Staged',
    content: `Hi Dr. Vance, shared our free mobile optimization review with you yesterday.\n\nWe prepared a 3-step checklist to resolve booking errors on smartphones and increase appointment confirmations.`,
  },
  {
    id: 'post-4',
    title: '5 Simple Design Upgrades Every Founder Should Make',
    channel: 'Dev.to Technical Blog',
    scheduledTime: 'Thursday 5:00 PM',
    charCount: 1420,
    parts: 'Long-form',
    category: 'OSS Spotlight',
    status: 'Staged',
    content: `Good software does not need neon gradients or complicated animations.\n\nHere are 5 typography and spacing principles from Apple's design system that make any interface feel effortless.`,
  },
];

export const ContentStudio: React.FC<ContentStudioProps> = ({
  onPublishPost: propPublishPost,
  onOpenNewPost: propOpenNewPost,
  posts: propPosts,
}) => {
  const { posts: ctxPosts, publishPost: ctxPublishPost, setIsNewPostOpen } = useStudio();
  const posts = (propPosts && propPosts.length > 0) ? propPosts : ctxPosts;
  const onPublishPost = propPublishPost || ctxPublishPost;
  const onOpenNewPost = propOpenNewPost || (() => setIsNewPostOpen(true));

  const [filter, setFilter] = useState<'all' | 'social' | 'direct'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannelTab, setActiveChannelTab] = useState<'bluesky' | 'twitter' | 'linkedin' | 'blog'>('bluesky');
  const [selectedPostId, setSelectedPostId] = useState<string>('post-1');
  const [likes, setLikes] = useState(189);
  const [hasLiked, setHasLiked] = useState(false);

  const filteredPosts = posts.filter((p) => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'social' ? (p.channel.includes('Twitter') || p.channel.includes('Bluesky')) :
      filter === 'direct' ? (p.channel.includes('WhatsApp') || p.channel.includes('Dev.to')) : true;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.channel.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      p.content.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const selectedPost =
    filteredPosts.find((p) => p.id === selectedPostId) ||
    filteredPosts[0] ||
    posts[0];

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const socialCount = posts.filter(p => p.channel.includes('Twitter') || p.channel.includes('Bluesky')).length;
  const directCount = posts.filter(p => p.channel.includes('WhatsApp') || p.channel.includes('Dev.to')).length;

  return (
    <div className="flex-1 flex flex-col gap-3.5 p-5 overflow-y-auto max-w-[1340px] select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Content Studio &amp; Queue
          </h1>
          <p className="text-sm text-[#8A8F9E] mt-0.5">
            Review and approve your scheduled posts across all channels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#202227] border border-[#2E313A] w-[260px] text-xs text-[#8A8F9E] focus-within:border-[#3B66F5] focus-within:ring-2 focus-within:ring-[#3B66F5]/20 transition-all">
            <Search size={14} className="text-[#8A8F9E] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter drafts or keywords..."
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

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => selectedPost && onPublishPost(selectedPost.title)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D2F83D] hover:bg-[#c3e82e] text-[#18191D] font-bold text-xs shadow-lg shadow-[#D2F83D]/20 transition-colors"
          >
            <Send size={14} strokeWidth={2.2} />
            <span>Publish Now</span>
          </motion.button>
        </div>
      </div>

      {/* Main Grid: Left Publication Queue & Right Story Inspector */}
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Publication Queue */}
        <div className="col-span-12 lg:col-span-5 bg-[#202227] rounded-[28px] border border-[#2E313A] p-5 shadow-xl flex flex-col justify-between hover:border-[#3E424E] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-bold text-white tracking-tight">
                Publication Queue
              </h3>
              <span className="text-xs font-semibold text-[#D2F83D] bg-[#D2F83D]/10 px-3 py-1 rounded-full border border-[#D2F83D]/20">
                {posts.filter(p => p.status === 'Ready').length} Ready for Sign-Off
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-4">
              {(['all', 'social', 'direct'] as const).map(f => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === f
                      ? 'bg-[#D2F83D] text-[#18191D] shadow-sm'
                      : 'bg-[#2A2D35] text-[#8A8F9E] hover:text-white'
                  }`}
                >
                  {f === 'all' ? `All Posts (${posts.length})` : f === 'social' ? `Social Updates (${socialCount})` : `Direct Outreach (${directCount})`}
                </motion.button>
              ))}
            </div>

            {/* Queue Items or Empty State */}
            <div className="flex flex-col gap-2.5">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const isSelected = post.id === (selectedPost?.id || selectedPostId);
                  return (
                    <motion.div
                      key={post.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      onClick={() => setSelectedPostId(post.id)}
                      className={`rounded-[20px] p-4 cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[#18191D] border-[#D2F83D] shadow-lg shadow-[#D2F83D]/10 ring-1 ring-[#D2F83D]/30'
                          : 'bg-[#18191D]/60 border-[#2E313A] hover:border-[#3E424E]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          post.channel.includes('Bluesky')
                            ? 'bg-[#3B66F5] text-white'
                            : 'bg-[#25272F] text-[#9CA3AF]'
                        }`}>
                          {post.channel}
                        </span>
                        <span className="text-xs font-medium text-[#9CA3AF]">
                          {post.scheduledTime}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2 line-clamp-1 tracking-tight">
                        {post.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                        <span>{post.charCount} chars • {post.parts || 'Draft'} • {post.category || 'General'}</span>
                        <span className={post.status === 'Ready' ? 'text-[#D2F83D] font-bold' : 'text-[#8A8F9E]'}>
                          {post.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-[#18191D]/40 rounded-2xl border border-dashed border-[#2E313A] p-6">
                  <Search size={22} className="text-[#8A8F9E] mb-2 stroke-1" />
                  <p className="text-sm font-semibold text-white">No drafts found</p>
                  <p className="text-xs text-[#8A8F9E] mt-0.5">No posts match "{searchQuery}"</p>
                  <button
                    onClick={() => { setSearchQuery(''); setFilter('all'); }}
                    className="mt-3 text-xs px-3 py-1 rounded-md bg-[#252830] hover:bg-[#2E313A] text-[#D2F83D] border border-[#2E313A] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenNewPost}
            className="w-full mt-4 py-2.5 rounded-full border border-dashed border-[#3A3D46] hover:border-[#D2F83D] text-xs font-semibold text-[#8A8F9E] hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <span>+ Add Another Scheduled Draft</span>
          </motion.button>
        </div>

        {/* Right Column: Story Inspector & Live Simulator */}
        <div className="col-span-12 lg:col-span-7 bg-[#202227] rounded-[28px] border border-[#2E313A] p-5 shadow-xl flex flex-col justify-between hover:border-[#3E424E] transition-colors">
          <div>
            {/* Header & Channel Switcher */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-bold text-white tracking-tight">
                Story Inspector &amp; Live Simulator
              </h3>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {[
                { id: 'bluesky', label: 'Bluesky AT Protocol' },
                { id: 'twitter', label: 'Twitter / X' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'blog', label: 'Technical Blog' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveChannelTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeChannelTab === tab.id
                      ? 'bg-[#3B66F5] text-white shadow-md'
                      : 'bg-[#25272F] text-[#8A8F9E] hover:text-white'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Live Social Post Card */}
            <div className="bg-[#18191D] rounded-[22px] border border-[#2E313A] p-4 mb-3 shadow-inner">
              {/* User Meta Row */}
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-[#3B66F5] flex items-center justify-center font-bold text-white shadow text-xs">
                  AR
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">Alex Rivera</div>
                  <div className="text-xs text-[#9CA3AF]">
                    @alex.bsky.social • 9m ago
                  </div>
                </div>
              </div>

              {/* Post Text */}
              <div className="text-sm text-[#E5E7EB] leading-relaxed whitespace-pre-line mb-3 font-normal">
                {selectedPost.content}
              </div>

              {/* 3 Rebuilt Engagement Pills - Optical Perfection */}
              <div className="flex items-center gap-2.5 pt-2.5 border-t border-[#2E313A]/50">
                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25272F] border border-[#2E313A] text-xs font-semibold text-[#8A8F9E] cursor-pointer hover:text-white transition-colors leading-none"
                >
                  <MessageCircle size={13} strokeWidth={2} className="text-[#8A8F9E] shrink-0" />
                  <span>14 Replies</span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25272F] border border-[#2E313A] text-xs font-semibold text-[#8A8F9E] cursor-pointer hover:text-white transition-colors leading-none"
                >
                  <Repeat2 size={13} strokeWidth={2} className="text-[#8A8F9E] shrink-0" />
                  <span>42 Reposts</span>
                </motion.div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all leading-none ${
                    hasLiked
                      ? 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#F87171]'
                      : 'bg-[#25272F] border-[#2E313A] text-[#8A8F9E] hover:text-white'
                  }`}
                >
                  <motion.span
                    animate={hasLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <Heart size={13} strokeWidth={2} className={hasLiked ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#8A8F9E]'} />
                  </motion.span>
                  <span>{likes} Likes</span>
                </motion.button>
              </div>
            </div>

            {/* Quality Check Banner */}
            <div className="p-3.5 rounded-[18px] bg-[#18191D] border border-[#2E313A] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block mb-0.5">
                  Content Quality Check
                </span>
                <span className="text-xs text-[#8A8F9E]">
                  Written in clean, natural English • High authenticity score
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D2F83D] bg-[#D2F83D]/10 px-3 py-1 rounded-full border border-[#D2F83D]/20">
                <Check size={14} />
                <span>Ready to Share</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-[#2E313A]/60">
            <span className="text-xs text-[#8A8F9E]">
              Next scheduled post planned for <strong>tomorrow at 9:00 AM</strong>
            </span>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenNewPost}
                className="px-4 py-2 rounded-full bg-[#25272F] border border-[#2E313A] text-xs font-semibold text-[#8A8F9E] hover:text-white transition-colors"
              >
                Edit Post
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPublishPost(selectedPost.title)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#D2F83D] hover:bg-[#c3e82e] text-[#18191D] font-bold text-xs shadow-md shadow-[#D2F83D]/20 transition-all"
              >
                <span>Publish Now</span>
                <ArrowUpRight size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
