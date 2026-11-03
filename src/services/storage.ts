import { Lead, QueuedPost, SocialIntent, StudioConfig, SprintState, ClientProposalRecord } from '../types';

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  founderName: 'Alex Vance',
  specialtyTitle: 'Full-Stack Web Optimization Specialist',
  leadsFilePath: 'leads/leads.json',
  targetDailyAudits: 20,
  targetDailyHours: 8,
  writingStyle: 95,
  matchingThreshold: 85,
  morningRoutineTime: '09:00',
  dailyRoutineEnabled: true,
  desktopNotifications: true,
  soundAlerts: true,
  theme: 'dark',
  aiProvider: 'antigravity',
  aiEndpoint: 'https://generativelanguage.googleapis.com',
  aiModel: 'gemini-2.5-pro',
  aiApiKey: '',
};

export const DEFAULT_POSTS_SEED: QueuedPost[] = [
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
    tags: ['Case Study', 'Performance']
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
    tags: ['Founders', 'Growth']
  },
  {
    id: 'post-3',
    title: 'Client Case Study: Helping Local Businesses Grow',
    channel: 'WhatsApp Outreach',
    scheduledTime: 'Tomorrow 11:30 AM',
    charCount: 540,
    parts: 'Direct sequence',
    category: 'Healthcare Outreach',
    status: 'Staged',
    content: `Hi Dr. Vance, shared our free mobile optimization review with you yesterday.\n\nWe prepared a 3-step checklist to resolve booking errors on smartphones and increase appointment confirmations.`,
    tags: ['Outreach', 'Healthcare']
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
    tags: ['Design', 'Apple HIG']
  },
];

export const DEFAULT_INTENTS_SEED: SocialIntent[] = [
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

export const DEFAULT_SPRINT_SEED: SprintState = {
  currentStep: 3,
  stepCompleted: [true, true, false, false],
  lastUpdated: new Date().toISOString()
};

/**
 * Normalizes raw items from leads.json into typed, strongly validated Lead models.
 * Handles both the raw Indian business dataset and pre-formatted Lead models.
 */
export function normalizeRawLead(raw: any, index: number): Lead {
  // Check if it's already a normalized Lead object
  if (raw && typeof raw.healthScore === 'number' && raw.healthStatus && raw.domain) {
    return raw as Lead;
  }

  const id = raw['Lead ID'] || raw.id || `lead-${index + 1}`;
  const name = raw['Business Name'] || raw.name || 'Unnamed Business';
  const url = raw['Website URL'] || raw.domain || '';
  
  // Clean domain extraction
  let domain = url;
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const parsed = new URL(url);
      domain = parsed.hostname.replace(/^www\./, '');
    } else if (url) {
      domain = url.split('/')[0].replace(/^www\./, '');
    }
  } catch {
    domain = url || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }
  if (!domain) {
    domain = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }

  const category = raw['Category'] || raw.category || 'General Business';
  const priorityStr = String(raw['Lead Priority (1-5)'] || raw.priority || '3').trim();
  const priority = parseInt(priorityStr, 10) || 3;

  // Derive health score & status from priority and deterministic index
  let healthScore: number;
  let healthStatus: Lead['healthStatus'];
  let opportunityValue: string;

  if (priority >= 5) {
    // Critical priority (most urgent digital gaps)
    healthScore = 26 + ((index * 3) % 9); // 26 - 34
    healthStatus = 'Critical';
    opportunityValue = '$12,500 - $18,000';
  } else if (priority === 4) {
    // Moderate priority
    healthScore = 38 + ((index * 2) % 11); // 38 - 48
    healthStatus = 'Moderate';
    opportunityValue = '$8,500 - $12,000';
  } else if (priority === 3) {
    // Fair priority
    healthScore = 52 + ((index * 4) % 14); // 52 - 65
    healthStatus = 'Fair';
    opportunityValue = '$6,000 - $9,500';
  } else {
    // Healthy / Low priority
    healthScore = 75 + ((index * 2) % 14); // 75 - 88
    healthStatus = 'Healthy';
    opportunityValue = '$4,000 - $6,500';
  }

  const vulnerability =
    raw['Primary Digital Gap'] ||
    raw.vulnerability ||
    'Mobile responsive optimization and booking checkout speed needed';

  const monthlyVisitors = `${(10 + ((index * 7) % 55)).toFixed(1)}K`;

  return {
    id,
    name,
    domain,
    category,
    healthScore,
    healthStatus,
    vulnerability,
    monthlyVisitors,
    opportunityValue,
    city: raw['City/Area'] || raw.city || '',
    contactPerson: raw['Contact Person (Role)'] || raw.contactPerson || '',
    phone: raw['Phone'] || raw.phone || '',
    email: raw['Email'] || raw.email || '',
    status: raw.status || 'New'
  };
}

/**
 * Storage Service: Manages persistence between Electron IPC and LocalStorage fallback.
 */
export const storageService = {
  /**
   * Load leads from Electron IPC or public JSON / LocalStorage.
   */
  async loadLeads(): Promise<Lead[]> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.getLeads) {
        const rawLeads = await window.electronAPI.getLeads();
        if (Array.isArray(rawLeads) && rawLeads.length > 0) {
          return rawLeads.map(normalizeRawLead);
        }
      }
    } catch (err) {
      console.warn('Electron IPC getLeads unavailable, trying local fallback:', err);
    }

    // Browser or fallback mode: Try fetching from local leads.json or sample leads.example.json
    try {
      let response = await fetch('/leads/leads.json');
      if (!response.ok) {
        response = await fetch('/leads/leads.example.json');
      }
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          return json.map(normalizeRawLead);
        }
      }
    } catch {}

    // Check LocalStorage cache
    try {
      const cached = localStorage.getItem('automarket_leads_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeRawLead);
        }
      }
    } catch {}

    // Return empty array if not loaded yet
    return [];
  },

  async saveLeads(leads: Lead[]): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.saveLeads) {
        const ok = await window.electronAPI.saveLeads(leads);
        if (ok) return true;
      }
    } catch (err) {
      console.warn('Electron saveLeads failed:', err);
    }

    try {
      // LocalStorage backup
      localStorage.setItem('automarket_leads_cache', JSON.stringify(leads));
      return true;
    } catch {
      return false;
    }
  },

  async loadPosts(): Promise<QueuedPost[]> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.getPosts) {
        const posts = await window.electronAPI.getPosts();
        if (Array.isArray(posts) && posts.length > 0) {
          return posts;
        }
      }
    } catch {}

    try {
      const cached = localStorage.getItem('automarket_posts');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    return DEFAULT_POSTS_SEED;
  },

  async savePosts(posts: QueuedPost[]): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.savePosts) {
        await window.electronAPI.savePosts(posts);
      }
    } catch {}

    try {
      localStorage.setItem('automarket_posts', JSON.stringify(posts));
      return true;
    } catch {
      return false;
    }
  },

  async loadIntents(): Promise<SocialIntent[]> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.getIntents) {
        const intents = await window.electronAPI.getIntents();
        if (Array.isArray(intents) && intents.length > 0) {
          return intents;
        }
      }
    } catch {}

    try {
      const cached = localStorage.getItem('automarket_intents');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    return DEFAULT_INTENTS_SEED;
  },

  async saveIntents(intents: SocialIntent[]): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.saveIntents) {
        await window.electronAPI.saveIntents(intents);
      }
    } catch {}

    try {
      localStorage.setItem('automarket_intents', JSON.stringify(intents));
      return true;
    } catch {
      return false;
    }
  },

  async loadSettings(): Promise<StudioConfig> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.getSettings) {
        const settings = await window.electronAPI.getSettings();
        if (settings && typeof settings === 'object') {
          return { ...DEFAULT_STUDIO_CONFIG, ...settings };
        }
      }
    } catch {}

    try {
      const cached = localStorage.getItem('automarket_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_STUDIO_CONFIG, ...parsed };
        }
      }
    } catch {}

    return DEFAULT_STUDIO_CONFIG;
  },

  async saveSettings(settings: Partial<StudioConfig>): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.saveSettings) {
        await window.electronAPI.saveSettings(settings);
      }
    } catch {}

    try {
      const existing = await this.loadSettings();
      const merged = { ...existing, ...settings };
      localStorage.setItem('automarket_settings', JSON.stringify(merged));
      return true;
    } catch {
      return false;
    }
  },

  async loadSprintState(): Promise<SprintState> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.getSprintState) {
        const state = await window.electronAPI.getSprintState();
        if (state && typeof state.currentStep === 'number') {
          return state;
        }
      }
    } catch {}

    try {
      const cached = localStorage.getItem('automarket_sprint_state');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.currentStep === 'number') return parsed;
      }
    } catch {}

    return DEFAULT_SPRINT_SEED;
  },

  async saveSprintState(state: SprintState): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.saveSprintState) {
        await window.electronAPI.saveSprintState(state);
      }
    } catch {}

    try {
      localStorage.setItem('automarket_sprint_state', JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  },

  async exportLeadsCSV(leads: Lead[]): Promise<{ success: boolean; filePath?: string; count?: number }> {
    // If in Electron, call IPC handler
    try {
      if (typeof window !== 'undefined' && window.electronAPI?.exportLeadsCSV) {
        const result = await window.electronAPI.exportLeadsCSV();
        if (result && result.success) {
          return result;
        }
      }
    } catch {}

    // Fallback: Browser file download
    try {
      if (!leads || leads.length === 0) {
        return { success: false };
      }
      const headers = ['Lead ID', 'Business Name', 'Domain', 'Category', 'Health Score', 'Status', 'Gap', 'City', 'Phone', 'Email'];
      const escape = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;
      const lines = [
        headers.join(','),
        ...leads.map(l => [
          escape(l.id),
          escape(l.name),
          escape(l.domain),
          escape(l.category),
          escape(l.healthScore),
          escape(l.healthStatus),
          escape(l.vulnerability),
          escape(l.city),
          escape(l.phone),
          escape(l.email)
        ].join(','))
      ];

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_backup_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, count: leads.length, filePath: 'Downloads/leads_backup.csv' };
    } catch (e) {
      console.error('CSV export failed:', e);
      return { success: false };
    }
  }
};
