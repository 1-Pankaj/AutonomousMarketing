import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  ScreenId,
  Lead,
  QueuedPost,
  SocialIntent,
  StudioConfig,
  SprintState,
  AppNotification,
  ToastNotification
} from '../types';
import {
  storageService,
  DEFAULT_STUDIO_CONFIG,
  DEFAULT_POSTS_SEED,
  DEFAULT_INTENTS_SEED,
  DEFAULT_SPRINT_SEED
} from '../services/storage';

interface PipelineStats {
  total: number;
  critical: number;
  moderate: number;
  healthy: number;
}

interface StudioContextValue {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light' | ((prev: 'dark' | 'light') => 'dark' | 'light')) => void;
  
  // Data
  leads: Lead[];
  pipelineStats: PipelineStats;
  posts: QueuedPost[];
  intents: SocialIntent[];
  settings: StudioConfig;
  sprintState: SprintState;
  selectedLead: Lead | null;
  notifications: AppNotification[];
  toasts: ToastNotification[];
  isLoadingLeads: boolean;

  // Modal visibility
  isNewPostOpen: boolean;
  setIsNewPostOpen: (open: boolean) => void;
  isProposalOpen: boolean;
  setIsProposalOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Actions
  openAudit: (lead: Lead) => void;
  openProposal: (target: Lead | string, domain?: string) => void;
  closeProposal: () => void;
  schedulePost: (post: Partial<QueuedPost>) => void;
  publishPost: (identifier: string) => void;
  updateSettings: (newConfig: Partial<StudioConfig>) => Promise<void>;
  completeSprintStep: () => void;
  toggleSprintStep: (index: number) => void;
  resetSprint: () => void;
  sendProposal: (data: { recipient: string; packageType: string; amount: string }) => void;
  exportLeadsCSV: () => Promise<void>;

  // Notifications & Toasts
  showToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
}

const StudioContext = createContext<StudioContextValue | undefined>(undefined);

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('hub');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Core Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [posts, setPosts] = useState<QueuedPost[]>(DEFAULT_POSTS_SEED);
  const [intents, setIntents] = useState<SocialIntent[]>(DEFAULT_INTENTS_SEED);
  const [settings, setSettings] = useState<StudioConfig>(DEFAULT_STUDIO_CONFIG);
  const [sprintState, setSprintState] = useState<SprintState>(DEFAULT_SPRINT_SEED);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([
    {
      id: 'toast-init',
      type: 'info',
      title: 'AutoMarket Studio Ready',
      message: 'All features loaded. 111 local business targets ready offline.'
    }
  ]);

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

  // Initial Load from Storage Service
  useEffect(() => {
    let isMounted = true;
    (async () => {
      // 1. Theme
      try {
        const savedTheme = localStorage.getItem('automarket_theme') as 'dark' | 'light' | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch {}

      // 2. Settings
      try {
        const loadedSettings = await storageService.loadSettings();
        if (isMounted) setSettings(loadedSettings);
      } catch {}

      // 3. Posts
      try {
        const loadedPosts = await storageService.loadPosts();
        if (isMounted && loadedPosts.length > 0) setPosts(loadedPosts);
      } catch {}

      // 4. Intents
      try {
        const loadedIntents = await storageService.loadIntents();
        if (isMounted && loadedIntents.length > 0) setIntents(loadedIntents);
      } catch {}

      // 5. Sprint
      try {
        const loadedSprint = await storageService.loadSprintState();
        if (isMounted) setSprintState(loadedSprint);
      } catch {}

      // 6. Leads (2,174 items)
      try {
        const loadedLeads = await storageService.loadLeads();
        if (isMounted) {
          if (loadedLeads.length > 0) {
            setLeads(loadedLeads);
            setSelectedLead(loadedLeads[0]);
          }
          setIsLoadingLeads(false);
        }
      } catch (err) {
        console.error('Failed to load leads:', err);
        if (isMounted) setIsLoadingLeads(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Theme synchronization with DOM
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
    } catch {}
  }, [theme]);

  // Calculated Pipeline Stats
  const pipelineStats: PipelineStats = useMemo(() => {
    const total = leads.length;
    let critical = 0;
    let moderate = 0;
    let healthy = 0;

    for (const lead of leads) {
      if (lead.healthStatus === 'Critical') critical++;
      else if (lead.healthStatus === 'Moderate' || lead.healthStatus === 'Fair') moderate++;
      else healthy++;
    }

    return { total, critical, moderate, healthy };
  }, [leads]);

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

  // Toast Helpers
  const showToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Actions
  const openAudit = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveScreen('audit');
    showToast('Audit Loaded', `Viewing digital health breakdown for ${lead.name}`, 'info');
  };

  const openProposal = (target: Lead | string, domain?: string) => {
    if (typeof target === 'string') {
      const existing = leads.find(l => l.name === target || l.domain === domain);
      if (existing) {
        setSelectedLead(existing);
      } else {
        setSelectedLead({
          id: 'temp-lead',
          name: target,
          domain: domain || 'target-client.com',
          category: 'Client Opportunity',
          healthScore: 32,
          healthStatus: 'Critical',
          vulnerability: 'Mobile portal latency and checkout bottlenecks'
        });
      }
    } else {
      setSelectedLead(target);
    }
    setIsProposalOpen(true);
  };

  const closeProposal = () => {
    setIsProposalOpen(false);
  };

  const schedulePost = (post: Partial<QueuedPost>) => {
    const isDraft = post.status === 'Staged';
    const newPost: QueuedPost = {
      id: `post-${Date.now()}`,
      title: post.title || 'Untitled Update',
      content: post.content || '',
      channel: post.channel || 'Multi-Channel',
      scheduledTime: post.scheduledTime || (isDraft ? 'Saved in Drafts' : 'Tomorrow 09:00 AM'),
      charCount: post.content?.length || 140,
      parts: post.parts || 'Single post',
      category: 'Marketing',
      status: isDraft ? 'Staged' : 'Ready',
      tags: post.tags || ['Social']
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    storageService.savePosts(updated);

    showToast(
      isDraft ? 'Draft Saved' : 'Post Scheduled',
      `"${newPost.title}" ${isDraft ? 'saved to queue' : 'queued for publishing'}.`,
      'success'
    );
  };

  const publishPost = (identifier: string) => {
    const updated = posts.map(p => (p.id === identifier || p.title === identifier) ? { ...p, status: 'Ready' as const } : p);
    setPosts(updated);
    storageService.savePosts(updated);

    // If step 1 in sprint wasn't complete, complete it
    if (!sprintState.stepCompleted[0]) {
      const nextSteps = [...sprintState.stepCompleted];
      nextSteps[0] = true;
      const nextState = { ...sprintState, stepCompleted: nextSteps };
      setSprintState(nextState);
      storageService.saveSprintState(nextState);
    }

    showToast('Post Published', `Post has been published to connected channels.`, 'success');
  };

  const updateSettings = async (newConfig: Partial<StudioConfig>) => {
    const updated = { ...settings, ...newConfig };
    setSettings(updated);
    await storageService.saveSettings(updated);
    showToast('Settings Saved', 'Your studio preferences have been updated.', 'success');
  };

  const completeSprintStep = () => {
    const current = sprintState.currentStep;
    const updatedSteps = [...sprintState.stepCompleted];
    updatedSteps[current - 1] = true;

    const nextStep = current < 4 ? current + 1 : current;
    const nextState = {
      ...sprintState,
      currentStep: nextStep,
      stepCompleted: updatedSteps,
      lastUpdated: new Date().toISOString()
    };

    setSprintState(nextState);
    storageService.saveSprintState(nextState);

    if (current < 4) {
      showToast('Step Completed', `Proceeding to Step ${nextStep}.`, 'info');
    } else {
      showToast('Sprint Complete!', 'All 4 daily marketing tasks executed in under 15 minutes.', 'success');
    }
  };

  const toggleSprintStep = (index: number) => {
    const updatedSteps = [...sprintState.stepCompleted];
    updatedSteps[index] = !updatedSteps[index];
    const nextState = {
      ...sprintState,
      stepCompleted: updatedSteps,
      lastUpdated: new Date().toISOString()
    };
    setSprintState(nextState);
    storageService.saveSprintState(nextState);
  };

  const resetSprint = () => {
    const reset = {
      currentStep: 1,
      stepCompleted: [false, false, false, false],
      lastUpdated: new Date().toISOString()
    };
    setSprintState(reset);
    storageService.saveSprintState(reset);
    showToast('Sprint Reset', 'Sprint reset to Step 1.', 'info');
  };

  const sendProposal = (data: { recipient: string; packageType: string; amount: string }) => {
    // If selectedLead matches recipient, update status to 'Proposal Sent'
    if (selectedLead && selectedLead.name === data.recipient) {
      const updatedLead = { ...selectedLead, status: 'Proposal Sent' as const };
      setSelectedLead(updatedLead);
      const updatedLeads = leads.map(l => l.id === selectedLead.id ? updatedLead : l);
      setLeads(updatedLeads);
      storageService.saveLeads(updatedLeads);
    }

    // Advance step 3 in sprint if not done
    if (!sprintState.stepCompleted[2]) {
      const nextSteps = [...sprintState.stepCompleted];
      nextSteps[2] = true;
      const nextState = { ...sprintState, stepCompleted: nextSteps };
      setSprintState(nextState);
      storageService.saveSprintState(nextState);
    }

    showToast(
      'Proposal Sent',
      `${data.packageType} (${data.amount}) sent to ${data.recipient}.`,
      'success'
    );
  };

  const exportLeadsCSV = async () => {
    const result = await storageService.exportLeadsCSV(leads);
    if (result.success) {
      showToast(
        'CSV Export Complete',
        `Successfully exported ${result.count || leads.length} leads to backup file.`,
        'success'
      );
    } else {
      showToast('Export Error', 'Unable to export leads CSV.', 'error');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All notifications marked as read.', 'info');
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <StudioContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        theme,
        setTheme,
        leads,
        pipelineStats,
        posts,
        intents,
        settings,
        sprintState,
        selectedLead,
        notifications,
        toasts,
        isLoadingLeads,
        isNewPostOpen,
        setIsNewPostOpen,
        isProposalOpen,
        setIsProposalOpen,
        isAccountOpen,
        setIsAccountOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        openAudit,
        openProposal,
        closeProposal,
        schedulePost,
        publishPost,
        updateSettings,
        completeSprintStep,
        toggleSprintStep,
        resetSprint,
        sendProposal,
        exportLeadsCSV,
        showToast,
        dismissToast,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = (): StudioContextValue => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
