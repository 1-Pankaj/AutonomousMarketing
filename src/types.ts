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
}
