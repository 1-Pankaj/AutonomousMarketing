import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, ToastNotification, Lead, QueuedPost, AppNotification } from './types';
import { TitleBar } from './components/TitleBar';
import { NavigationDock } from './components/NavigationDock';
import { StudioHub } from './screens/StudioHub';
import { ContentStudio } from './screens/ContentStudio';
import { LeadRadar } from './screens/LeadRadar';
import { ClientOpportunities } from './screens/ClientOpportunities';
import { GrowthAnalytics } from './screens/GrowthAnalytics';
import { StudioSettings } from './screens/StudioSettings';
import { DailySprint } from './screens/DailySprint';
import { AuditReport } from './screens/AuditReport';
import { ModalNewPost } from './components/ModalNewPost';
import { ModalSendProposal } from './components/ModalSendProposal';
import { ToastContainer } from './components/ToastContainer';
import { AccountPopover } from './components/AccountPopover';
import { NotificationsPopover } from './components/NotificationsPopover';

export const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('hub');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [founderName, setFounderName] = useState('Alex Vance');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Sync theme with HTML class and local state
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('automarket_theme') as 'dark' | 'light' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (e) {
      // LocalStorage fallback
    }
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    try {
      localStorage.setItem('automarket_theme', theme);
    } catch (e) {}
  }, [theme]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'New Client Opportunity',
      message: 'Dr. Elena Rostova posted about patient portal mobile delays and booking drop-offs.',
      timeAgo: '18m ago',
      read: false,
      type: 'opportunity',
      targetScreen: 'stream',
    },
    {
      id: 'notif-2',
      title: 'Morning Review Ready',
      message: "Today's performance case study draft is prepared for your review and approval.",
      timeAgo: '1h ago',
      read: false,
      type: 'sprint',
      targetScreen: 'content',
    },
    {
      id: 'notif-3',
      title: 'Weekly Audience Milestone',
      message: 'Audience reach increased by +24% this week across your connected accounts.',
      timeAgo: '3h ago',
      read: true,
      type: 'system',
      targetScreen: 'analytics',
    },
  ]);

  const [posts, setPosts] = useState<QueuedPost[]>([
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
  ]);

  const [toasts, setToasts] = useState<ToastNotification[]>([
    {
      id: 'toast-init',
      type: 'info',
      title: 'AutoMarket Studio Ready',
      message: 'All features loaded. 2,174 local business targets ready offline.'
    }
  ]);

  // Global Keyboard Shortcuts (Apple HIG Desktop Standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes open modals or menus ONLY
      if (e.key === 'Escape') {
        if (isNewPostOpen) { setIsNewPostOpen(false); return; }
        if (isProposalOpen) { setIsProposalOpen(false); return; }
        if (isAccountOpen) { setIsAccountOpen(false); return; }
        if (isNotificationsOpen) { setIsNotificationsOpen(false); return; }
      }
      // Cmd/Ctrl + K shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showToast('Command Center', 'Press 1-7 on keyboard to switch screens quickly.', 'info');
      }
      // Quick numeric navigation 1-7
      if (!isNewPostOpen && !isProposalOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        const screens: ScreenId[] = ['hub', 'content', 'radar', 'stream', 'sprint', 'analytics', 'settings'];
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= screens.length) {
          setActiveScreen(screens[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewPostOpen, isProposalOpen, isAccountOpen, isNotificationsOpen]);

  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All notifications marked as read.', 'info');
  };

  const handleSelectNotification = (notif: AppNotification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setIsNotificationsOpen(false);
    if (notif.targetScreen) {
      setActiveScreen(notif.targetScreen);
    }
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleOpenAudit = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveScreen('audit');
    showToast('Audit Loaded', `Viewing digital health breakdown for ${lead.name}`, 'info');
  };

  const handleOpenProposal = (target: Lead | string, domain?: string) => {
    if (typeof target === 'string') {
      setSelectedLead({
        id: 'temp-lead',
        name: target,
        domain: domain || 'target-client.com',
        category: 'Client Opportunity',
        healthScore: 32,
        healthStatus: 'Critical',
        vulnerability: 'Mobile portal latency and checkout bottlenecks'
      });
    } else {
      setSelectedLead(target);
    }
    setIsProposalOpen(true);
  };

  const handleSchedulePost = (post: Partial<QueuedPost>) => {
    const isDraft = post.status === 'Staged';
    const newPost: QueuedPost = {
      id: `post-${Date.now()}`,
      title: post.title || 'Untitled Draft',
      content: post.content || '',
      channel: post.channel || 'Multi-Channel',
      scheduledTime: post.scheduledTime || (isDraft ? 'Saved in Drafts' : 'Tomorrow 09:00 AM'),
      charCount: post.content?.length || 140,
      parts: post.parts || 'Single post',
      category: 'Marketing',
      status: isDraft ? 'Staged' : 'Ready',
      tags: post.tags || ['Social']
    };
    setPosts(prev => [newPost, ...prev]);
    showToast(
      isDraft ? 'Draft Saved' : 'Post Scheduled',
      `"${newPost.title}" ${isDraft ? 'saved to queue' : 'queued for publishing'}.`,
      'success'
    );
  };

  const handleSendProposal = (data: { recipient: string; packageType: string; amount: string }) => {
    showToast(
      'Proposal Sent',
      `${data.packageType} (${data.amount}) sent to ${data.recipient}.`,
      'success'
    );
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans select-none antialiased transition-colors ${theme === 'light' ? 'light bg-[#F5F6F8] text-[#111827]' : 'dark bg-[#18191D] text-white'}`}>
      {/* Frameless Desktop Titlebar */}
      <TitleBar
        onNotify={showToast}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Studio Body: Left Dock + Active Screen */}
      <div className="flex-1 flex overflow-hidden relative">
        <NavigationDock
          activeScreen={activeScreen}
          onSelectScreen={(screen) => setActiveScreen(screen)}
          onOpenAccount={() => setIsAccountOpen(prev => !prev)}
          onToggleNotifications={() => setIsNotificationsOpen(prev => !prev)}
          isNotificationsOpen={isNotificationsOpen}
          unreadCount={notifications.filter(n => !n.read).length}
        />

        {/* Dynamic Screen Viewport with Apple Fluid Transition */}
        <main className="flex-1 flex overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 6, scale: 0.996 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.996 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden"
            >
              {activeScreen === 'hub' && (
                <StudioHub
                  onOpenNewPost={() => setIsNewPostOpen(true)}
                  onOpenSprint={() => setActiveScreen('sprint')}
                  onOpenAudit={() => setActiveScreen('radar')}
                />
              )}

              {activeScreen === 'content' && (
                <ContentStudio
                  posts={posts}
                  onOpenNewPost={() => setIsNewPostOpen(true)}
                  onPublishPost={(title) => {
                    setPosts(prev => prev.map(p => p.title === title ? { ...p, status: 'Ready' } : p));
                    showToast('Post Published', `"${title}" has been published.`, 'success');
                  }}
                />
              )}

              {activeScreen === 'radar' && (
                <LeadRadar
                  onOpenAudit={handleOpenAudit}
                  onOpenProposal={(lead) => handleOpenProposal(lead)}
                />
              )}

              {activeScreen === 'stream' && (
                <ClientOpportunities
                  onOpenProposal={(name, domain) => handleOpenProposal(name, domain)}
                  onShowToast={showToast}
                />
              )}

              {activeScreen === 'analytics' && (
                <GrowthAnalytics />
              )}

              {activeScreen === 'settings' && (
                <StudioSettings
                  onShowToast={showToast}
                  founderName={founderName}
                  theme={theme}
                  onSetTheme={(t) => setTheme(t)}
                  onUpdateFounderName={(name) => {
                    setFounderName(name);
                    showToast('Profile Updated', `Studio name updated to ${name}`, 'info');
                  }}
                />
              )}

              {activeScreen === 'sprint' && (
                <DailySprint
                  onOpenProposal={(name, domain) => handleOpenProposal(name, domain)}
                  onShowToast={showToast}
                />
              )}

              {activeScreen === 'audit' && (
                <AuditReport
                  lead={selectedLead}
                  onBack={() => setActiveScreen('radar')}
                  onOpenProposal={(name, domain) => handleOpenProposal(name, domain)}
                  onShowToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Local Workspace Popover */}
        <AccountPopover
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          onNavigate={(screen) => setActiveScreen(screen)}
          onShowToast={showToast}
        />

        {/* Notifications Popover */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onSelectNotification={handleSelectNotification}
          onDismissNotification={handleDismissNotification}
        />
      </div>

      {/* Modals & Overlays */}
      <ModalNewPost
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onSchedulePost={handleSchedulePost}
      />

      <ModalSendProposal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        lead={selectedLead}
        onSend={handleSendProposal}
      />

      {/* Floating System Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
};
export default App;
