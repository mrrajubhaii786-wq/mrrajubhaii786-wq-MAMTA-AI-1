export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  pageSource: string;
}

export interface MasterPlan {
  id: string;
  title: string;
  content: string; // Markdown text
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface ProjectTask {
  id: string;
  planId: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  order: number;
  createdAt: string;
  completedAt?: string;
}

export interface VaultItem {
  id: string;
  keyName: string;
  encryptedValue: string; // Hex/base64 representation of AES block
  itemType: 'api_key' | 'password' | 'token' | 'secret' | 'note';
  createdAt: string;
}

export interface WikiEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  page: 'home' | 'workspace' | 'admin' | 'safedrop';
  userSession: string;
  details: string;
  timestamp: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  diskUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  dbConnected: boolean;
  uptime: number; // in seconds
  aiCallsToday: number;
  activeSessions: number;
  plansGenerated: number;
  successRate: number;
}
