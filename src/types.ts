export type ScreenId =
  | 'hub'
  | 'content'
  | 'radar'
  | 'stream'
  | 'analytics'
  | 'settings'
  | 'sprint'
  | 'audit';

export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export interface Lead {
  id: string;
  name: string;
  domain: string;
  category: string;
  healthScore: number;
  healthStatus: 'Critical' | 'Moderate' | 'Fair' | 'Healthy';
  vulnerability: string;
  monthlyVisitors?: string;
  opportunityValue?: string;
  city?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  status?: 'New' | 'Audited' | 'Proposal Sent' | 'Closed';
}

export interface QueuedPost {
  id: string;
  title: string;
  channel: string;
  scheduledTime: string;
  charCount?: number;
  parts?: string;
  category?: string;
  status: 'Ready' | 'Staged' | 'Scheduled';
  content: string;
  tags?: string[];
}

export interface SocialIntent {
  id: string;
  authorName: string;
  authorHandle: string;
  authorRole: string;
  platform: string;
  content: string;
  timeAgo: string;
  matchScore: number;
  estimatedBudget: string;
  tags: string[];
  relevance: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'opportunity' | 'sprint' | 'system';
  targetScreen?: ScreenId;
}

export interface StudioConfig {
  founderName: string;
  specialtyTitle: string;
  leadsFilePath: string;
  targetDailyAudits: number;
  targetDailyHours: number;
  writingStyle: number;
  matchingThreshold: number;
  morningRoutineTime: string;
  dailyRoutineEnabled: boolean;
  desktopNotifications: boolean;
  soundAlerts: boolean;
  theme?: 'dark' | 'light';
  aiProvider?: 'antigravity' | 'claude' | 'ollama' | 'openai' | 'openclaw' | 'cursor';
  aiApiKey?: string;
  aiEndpoint?: string;
  aiModel?: string;
}

export interface SprintState {
  currentStep: number;
  stepCompleted: boolean[];
  lastUpdated?: string;
}

export interface ClientProposalRecord {
  id: string;
  leadId?: string;
  recipient: string;
  domain?: string;
  packageType: string;
  amount: string;
  sentAt: string;
}

export interface ElectronAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  onMaximizedState: (callback: (isMaximized: boolean) => void) => () => void;
  getLeads: () => Promise<any[]>;
  saveLeads: (leads: any[]) => Promise<boolean>;
  getPosts: () => Promise<QueuedPost[]>;
  savePosts: (posts: QueuedPost[]) => Promise<boolean>;
  getSettings: () => Promise<Partial<StudioConfig>>;
  saveSettings: (settings: Partial<StudioConfig>) => Promise<boolean>;
  getIntents: () => Promise<SocialIntent[]>;
  saveIntents: (intents: SocialIntent[]) => Promise<boolean>;
  getSprintState: () => Promise<SprintState>;
  saveSprintState: (state: SprintState) => Promise<boolean>;
  exportLeadsCSV: () => Promise<{ success: boolean; filePath?: string; count?: number }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

