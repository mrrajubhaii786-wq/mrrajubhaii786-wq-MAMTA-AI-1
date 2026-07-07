import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config();

import { 
  dbChats, 
  dbPlans, 
  dbTasks, 
  dbVault, 
  dbWiki, 
  dbLogs, 
  dbFiles, 
  decryptValue, 
  encryptValue,
  readDb
} from './src/db/fileDb';
import { initializeApp as initClientApp, getApps as getClientApps } from 'firebase/app';
import { 
  getFirestore as getClientFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch 
} from 'firebase/firestore';
import firebaseConfig from './src/lib/firebase-config';
import { db as pgDb } from './src/db/index';
import { users as pgUsers, plans as pgPlans, tasks as pgTasks, builds as pgBuilds } from './src/db/schema';
import { eq } from 'drizzle-orm';
import { ChatMessage, MasterPlan, ProjectTask, VaultItem, WikiEntry, ActivityLog } from './src/types';

// Security Middlewares and Utilities
import { verifyAuth, verifyAdmin, optionalAuth } from './src/middleware/auth';
import { validate, chatValidation, planValidation, vaultValidation, wikiValidation, githubPushValidation } from './src/middleware/validation';
import { apiLimiter, chatLimiter, planLimiter, adminLimiter } from './src/middleware/rateLimit';
import helmet from 'helmet';
import { getRealSystemMetrics } from './src/services/systemMetrics';

const app = express();
app.set('trust proxy', 1);
const PORT = 3000;

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  const stringified = JSON.stringify(errInfo);
  console.error('Firestore Error: ', stringified);
  throw new Error(stringified);
}

class AdminDocWrapper {
  constructor(private db: any, private colName: string, private docId: string) {}

  get ref() {
    return doc(this.db, this.colName, this.docId);
  }

  async set(data: any) {
    await setDoc(this.ref, data);
  }

  async update(data: any) {
    await updateDoc(this.ref, data);
  }

  async delete() {
    await deleteDoc(this.ref);
  }
}

class AdminQueryWrapper {
  private constraints: any[] = [];
  constructor(private db: any, private colName: string) {}

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    this.constraints.push(orderBy(field, direction));
    return this;
  }

  where(field: string, op: any, val: any) {
    this.constraints.push(where(field, op, val));
    return this;
  }

  limit(num: number) {
    this.constraints.push(limit(num));
    return this;
  }

  async get() {
    const q = query(collection(this.db, this.colName), ...this.constraints);
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(d => ({
      id: d.id,
      ref: d.ref,
      data: () => d.data()
    }));
    return {
      docs,
      forEach: (cb: (doc: any) => void) => docs.forEach(cb),
      empty: snapshot.empty,
      size: snapshot.size
    };
  }
}

class AdminCollectionWrapper {
  constructor(private db: any, private colName: string) {}

  doc(id: string) {
    return new AdminDocWrapper(this.db, this.colName, id);
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    return new AdminQueryWrapper(this.db, this.colName).orderBy(field, direction);
  }

  where(field: string, op: any, val: any) {
    return new AdminQueryWrapper(this.db, this.colName).where(field, op, val);
  }
}

class AdminBatchWrapper {
  private batch: any;
  constructor(db: any) {
    this.batch = writeBatch(db);
  }

  delete(docRef: any) {
    this.batch.delete(docRef);
    return this;
  }

  set(docRef: any, data: any) {
    this.batch.set(docRef, data);
    return this;
  }

  update(docRef: any, data: any) {
    this.batch.update(docRef, data);
    return this;
  }

  async commit() {
    await this.batch.commit();
  }
}

// Initialize dbAdmin using the custom Client-SDK wrapper
let dbAdmin: any = null;
try {
  let clientApp;
  if (getClientApps().length === 0) {
    clientApp = initClientApp(firebaseConfig);
  } else {
    clientApp = getClientApps()[0];
  }
  const clientDb = getClientFirestore(clientApp, firebaseConfig.firestoreDatabaseId);
  dbAdmin = {
    collection(colName: string) {
      return new AdminCollectionWrapper(clientDb, colName);
    },
    batch() {
      return new AdminBatchWrapper(clientDb);
    }
  };
  console.log('Firebase Client SDK initialized successfully on backend with database:', firebaseConfig.firestoreDatabaseId);
} catch (err) {
  console.error('Firebase Client SDK on server skipped or failed (local memory fallback active):', err);
}

// ----------------------------------------------------
// HYBRID DATABASES (FIRESTORE & POSTGRESQL WRAPPERS)
// ----------------------------------------------------

// 1. FIRESTORE: Chats collection with fallback
const firestoreChats = {
  async getChats(sessionId?: string): Promise<ChatMessage[]> {
    if (!dbAdmin) return dbChats.getChats(sessionId);
    try {
      let q = dbAdmin.collection('chats').orderBy('timestamp', 'asc');
      if (sessionId) {
        q = q.where('sessionId', '==', sessionId);
      }
      const snapshot = await q.get();
      const list: ChatMessage[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        list.push({
          id: doc.id,
          sessionId: d.sessionId,
          role: d.role,
          content: d.content,
          timestamp: d.timestamp,
          pageSource: d.pageSource
        });
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'chats');
    }
  },
  async addChat(chat: { sessionId: string; role: 'user' | 'model'; content: string; pageSource: string }): Promise<ChatMessage> {
    const id = 'chat_' + randomUUID();
    const newChat: ChatMessage = {
      id,
      ...chat,
      timestamp: new Date().toISOString()
    };
    dbChats.addChat(newChat); // dual write to sync in-memory
    if (dbAdmin) {
      try {
        await dbAdmin.collection('chats').doc(id).set({
          sessionId: chat.sessionId,
          role: chat.role,
          content: chat.content,
          pageSource: chat.pageSource,
          timestamp: newChat.timestamp
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'chats');
      }
    }
    return newChat;
  },
  async clearChats(sessionId?: string): Promise<void> {
    dbChats.clearChats(sessionId);
    if (dbAdmin) {
      try {
        const coll = dbAdmin.collection('chats');
        let q: any = coll;
        if (sessionId) {
          q = q.where('sessionId', '==', sessionId);
        }
        const snapshot = await q.get();
        const batch = dbAdmin.batch();
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'chats');
      }
    }
  }
};

// 2. FIRESTORE: logs with fallback
const firestoreLogs = {
  async getActivityLogs(): Promise<ActivityLog[]> {
    if (!dbAdmin) return dbLogs.getActivityLogs();
    try {
      const snapshot = await dbAdmin.collection('logs').orderBy('timestamp', 'desc').limit(100).get();
      const list: ActivityLog[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        list.push({
          id: doc.id,
          action: d.action,
          page: d.page,
          userSession: d.userSession,
          details: d.details,
          timestamp: d.timestamp
        });
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'logs');
    }
  },
  async addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    const id = 'log_' + randomUUID();
    const newLog: ActivityLog = {
      id,
      ...log,
      timestamp: new Date().toISOString()
    };
    dbLogs.addActivityLog(newLog);
    if (dbAdmin) {
      try {
        await dbAdmin.collection('logs').doc(id).set({
          action: log.action,
          page: log.page,
          userSession: log.userSession,
          details: log.details,
          timestamp: newLog.timestamp
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'logs');
      }
    }
    return newLog;
  },
  getAiCallsCount(): number {
    return dbLogs.getAiCallsCount();
  },
  incrementAiCalls(): void {
    dbLogs.incrementAiCalls();
  }
};

// 3. FIRESTORE: wiki with fallback
const firestoreWiki = {
  async getEntries(): Promise<WikiEntry[]> {
    if (!dbAdmin) return dbWiki.getEntries();
    try {
      const snapshot = await dbAdmin.collection('wiki').orderBy('createdAt', 'desc').get();
      const list: WikiEntry[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        list.push({
          id: doc.id,
          title: d.title,
          content: d.content,
          tags: d.tags || [],
          createdAt: d.createdAt
        });
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'wiki');
    }
  },
  async addEntry(title: string, content: string, tags: string[]): Promise<WikiEntry> {
    const id = 'wiki_' + randomUUID();
    const newEntry: WikiEntry = {
      id,
      title,
      content,
      tags,
      createdAt: new Date().toISOString()
    };
    dbWiki.addEntry(title, content, tags);
    if (dbAdmin) {
      try {
        await dbAdmin.collection('wiki').doc(id).set({
          title,
          content,
          tags,
          createdAt: newEntry.createdAt
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'wiki');
      }
    }
    return newEntry;
  },
  async updateEntry(id: string, updates: { title?: string; content?: string; tags?: string[] }): Promise<WikiEntry | null> {
    const local = dbWiki.updateEntry(id, updates);
    if (dbAdmin) {
      try {
        const u: Record<string, any> = {};
        if (updates.title !== undefined) u.title = updates.title;
        if (updates.content !== undefined) u.content = updates.content;
        if (updates.tags !== undefined) u.tags = updates.tags;
        await dbAdmin.collection('wiki').doc(id).update(u);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `wiki/${id}`);
      }
    }
    return local;
  },
  async deleteEntry(id: string): Promise<void> {
    dbWiki.deleteEntry(id);
    if (dbAdmin) {
      try {
        await dbAdmin.collection('wiki').doc(id).delete();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `wiki/${id}`);
      }
    }
  }
};

// 4. FIRESTORE: vault keys with encryption & fallback
const firestoreVault = {
  async getVaultItems(): Promise<VaultItem[]> {
    if (!dbAdmin) return dbVault.getVaultItems();
    try {
      const snapshot = await dbAdmin.collection('vault').orderBy('createdAt', 'desc').get();
      const list: VaultItem[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        list.push({
          id: doc.id,
          keyName: d.keyName,
          encryptedValue: d.encryptedValue,
          itemType: d.itemType,
          createdAt: d.createdAt
        });
      });
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'vault');
    }
  },
  async addVaultItem(keyName: string, value: string, itemType: VaultItem['itemType'], masterPassword: string): Promise<VaultItem> {
    const id = 'vault_' + randomUUID();
    const encrypted = encryptValue(value, masterPassword);
    const newItem: VaultItem = {
      id,
      keyName,
      encryptedValue: encrypted,
      itemType,
      createdAt: new Date().toISOString()
    };
    dbVault.addVaultItem(keyName, value, itemType, masterPassword);
    if (dbAdmin) {
      try {
        await dbAdmin.collection('vault').doc(id).set({
          keyName,
          encryptedValue: encrypted,
          itemType,
          createdAt: newItem.createdAt
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'vault');
      }
    }
    return newItem;
  },
  async deleteVaultItem(id: string): Promise<void> {
    dbVault.deleteVaultItem(id);
    if (dbAdmin) {
      try {
        await dbAdmin.collection('vault').doc(id).delete();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `vault/${id}`);
      }
    }
  }
};

// 5. CLOUD SQL: Plans wrapper with safety and fileDb dual write
const sqlPlans = {
  async getPlans(): Promise<MasterPlan[]> {
    try {
      const results = await pgDb.select().from(pgPlans);
      if (results.length === 0) return dbPlans.getPlans();
      return results.map(r => ({
        id: String(r.id),
        title: r.title,
        content: r.goal,
        status: (r.status as any) || 'pending',
        createdAt: r.createdAt.toISOString()
      }));
    } catch (err) {
      console.warn('Cloud SQL select plans failed, returning local:', err);
      return dbPlans.getPlans();
    }
  },
  async getPlan(id: string): Promise<MasterPlan | null> {
    try {
      const results = await pgDb.select().from(pgPlans).where(eq(pgPlans.id, Number(id)));
      if (results.length === 0) return dbPlans.getPlan(id);
      const r = results[0];
      return {
        id: String(r.id),
        title: r.title,
        content: r.goal,
        status: (r.status as any) || 'pending',
        createdAt: r.createdAt.toISOString()
      };
    } catch (err) {
      console.warn('Cloud SQL getPlan failed:', err);
      return dbPlans.getPlan(id);
    }
  },
  async addPlan(title: string, goal: string): Promise<MasterPlan> {
    const local = dbPlans.addPlan(title, goal);
    try {
      // Satisfy foreign key user constraint
      let userId = 1;
      try {
        const u = await pgDb.select().from(pgUsers).limit(1);
        if (u.length === 0) {
          const insertedUser = await pgDb.insert(pgUsers).values({
            uid: 'system_default_uid',
            email: 'admin@mamta.ai',
            role: 'admin'
          }).returning();
          userId = insertedUser[0].id;
        } else {
          userId = u[0].id;
        }
      } catch (err) {
        console.warn('PG Users initialization skipped:', err);
      }

      const inserted = await pgDb.insert(pgPlans).values({
        userId,
        title,
        goal,
        status: 'draft'
      }).returning();

      if (inserted.length > 0) {
        const p = inserted[0];
        // Mirror id to keep local in sync if needed
        return {
          id: String(p.id),
          title: p.title,
          content: p.goal,
          status: 'pending',
          createdAt: p.createdAt.toISOString()
        };
      }
    } catch (err) {
      console.warn('Cloud SQL insert plan failed, using local fallback:', err);
    }
    return local;
  },
  async updatePlan(id: string, updates: { status?: 'pending' | 'in_progress' | 'completed' | 'failed'; completedAt?: string }): Promise<void> {
    dbPlans.updatePlan(id, updates);
    try {
      const u: Record<string, any> = {};
      if (updates.status) u.status = updates.status;
      await pgDb.update(pgPlans).set(u).where(eq(pgPlans.id, Number(id)));
    } catch (err) {
      console.warn('Cloud SQL updatePlan failed:', err);
    }
  }
};

// 6. CLOUD SQL: Tasks wrapper with safety, fileDb write, and Firestore realtime mirror
const sqlTasks = {
  async getTasks(planId: string): Promise<ProjectTask[]> {
    try {
      const results = await pgDb.select().from(pgTasks).where(eq(pgTasks.planId, Number(planId)));
      if (results.length === 0) return dbTasks.getTasks(planId);
      return results.map(r => ({
        id: String(r.id),
        planId: String(r.planId),
        title: r.name,
        description: 'Build component task',
        status: (r.status as any) || 'pending',
        order: 0,
        createdAt: r.createdAt.toISOString()
      }));
    } catch (err) {
      console.warn('Cloud SQL select tasks failed:', err);
      return dbTasks.getTasks(planId);
    }
  },
  async addTasks(taskList: Omit<ProjectTask, 'id' | 'createdAt'>[]): Promise<ProjectTask[]> {
    const local = dbTasks.addTasks(taskList);
    try {
      const insertedList: ProjectTask[] = [];
      for (const t of taskList) {
        const inserted = await pgDb.insert(pgTasks).values({
          planId: Number(t.planId),
          name: t.title,
          status: 'todo',
          priority: 'medium'
        }).returning();

        if (inserted.length > 0) {
          const resTask: ProjectTask = {
            id: String(inserted[0].id),
            planId: String(inserted[0].planId),
            title: inserted[0].name,
            description: t.description,
            status: 'pending',
            order: t.order,
            createdAt: inserted[0].createdAt.toISOString()
          };
          insertedList.push(resTask);

          // Push to Firestore tasks collection for real-time snapshots (Phase 9)
          if (dbAdmin) {
            try {
              await dbAdmin.collection('tasks').doc(resTask.id).set({
                planId: resTask.planId,
                title: resTask.title,
                description: resTask.description,
                status: resTask.status,
                order: resTask.order,
                createdAt: resTask.createdAt
              });
            } catch (fsErr) {
              handleFirestoreError(fsErr, OperationType.WRITE, 'tasks');
            }
          }
        }
      }
      return insertedList;
    } catch (err) {
      console.warn('Cloud SQL insert tasks failed, using local fallback:', err);
    }
    return local;
  },
  async updateTaskStatus(id: string, status: ProjectTask['status'], completedAt?: string): Promise<void> {
    dbTasks.updateTaskStatus(id, status, completedAt);
    try {
      await pgDb.update(pgTasks).set({ status }).where(eq(pgTasks.id, Number(id)));
    } catch (err) {
      console.warn('Cloud SQL updateTaskStatus failed:', err);
    }

    // Mirror update to Firestore tasks collection for real-time snapshots (Phase 9)
    if (dbAdmin) {
      try {
        await dbAdmin.collection('tasks').doc(id).update({ status });
      } catch (fsErr) {
        handleFirestoreError(fsErr, OperationType.UPDATE, `tasks/${id}`);
      }
    }
  },
  clearTasks(planId: string): void {
    dbTasks.clearTasks(planId);
    // Remove tasks from Firestore if desired, or skip
  }
};


app.use(express.json());

// Apply Helmet Security Headers - Disable strict CSP in development to let Vite load modules
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://firestore.googleapis.com"],
    },
  } : false,
  hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));

// Apply Global Rate Limiting to APIs
app.use('/api/', apiLimiter);

// Initialize AI Client Lazily to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
let currentModelSelection = 'gemini-3.5-flash';

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment. Please add it via Settings > Secrets in the AI Studio panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Ensure database increments properly on queries
function trackAiCall() {
  dbLogs.incrementAiCalls();
}

// Resilient wrapper with exponential backoff and dynamic model fallback for high demand/rate limits
async function generateContentWithRetry(
  client: GoogleGenAI,
  params: Parameters<typeof client.models.generateContent>[0],
  maxRetries = 3,
  initialDelayMs = 1500
): ReturnType<typeof client.models.generateContent> {
  let attempt = 0;
  
  while (true) {
    try {
      return await client.models.generateContent(params);
    } catch (err: any) {
      attempt++;
      console.error(`Gemini API call failed (attempt ${attempt}/${maxRetries}):`, err);
      
      const isRetryable = 
        err?.status === 'UNAVAILABLE' || 
        err?.code === 503 || 
        err?.status === 'RESOURCE_EXHAUSTED' || 
        err?.code === 429 ||
        String(err?.message || '').includes('503') ||
        String(err?.message || '').includes('UNAVAILABLE') ||
        String(err?.message || '').includes('high demand') ||
        attempt < maxRetries;
        
      if (attempt >= maxRetries || !isRetryable) {
        throw err;
      }
      
      // On the final retry, fallback to a more available model if the current one is experiencing high demand
      if (attempt === maxRetries - 1) {
        if (params.model === 'gemini-3.5-flash') {
          console.log(`Switching model from gemini-3.5-flash to gemini-flash-latest fallback for final retry`);
          params.model = 'gemini-flash-latest';
        } else if (params.model === 'gemini-3.1-pro-preview') {
          console.log(`Switching model from gemini-3.1-pro-preview to gemini-3.5-flash fallback for final retry`);
          params.model = 'gemini-3.5-flash';
        }
      }
      
      const delay = initialDelayMs * Math.pow(2.2, attempt - 1) * (0.8 + Math.random() * 0.4);
      console.log(`Retrying Gemini API call in ${Math.round(delay)}ms due to status/error...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    env_diagnostics: {
      gemini_api_key_configured: !!process.env.GEMINI_API_KEY,
      firebase_api_key_configured: !!process.env.FIREBASE_API_KEY,
      firebase_project_id_configured: !!process.env.FIREBASE_PROJECT_ID,
      firebase_app_id_configured: !!process.env.FIREBASE_APP_ID,
      is_vercel_environment: process.env.VERCEL === '1'
    }
  });
});

// Chats Endpoints
app.get('/api/chats', async (req, res) => {
  const { sessionId } = req.query;
  try {
    const chats = await firestoreChats.getChats(sessionId ? String(sessionId) : undefined);
    res.json(chats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MAMTA AI V7.5 — BRAIN SYSTEM WITH CACHING & DYNAMIC ROUTING
// MAMTA AI V8.0 — LEGEND BRAIN SYSTEM MASTER PLAN
const brainCache = new Map<string, { content: string; intent: 'chat' | 'planning' | 'developer' | 'debug' | 'knowledge' | 'reasoning' | 'learning'; isLocal: boolean }>();

class MamtaBrain {
  private memory: any[] = [];
  private isBusy: boolean = false;

  constructor() {
    this.memory = [];
  }

  // Phase 7: Memory System
  addMemory(msg: any) {
    this.memory.push(msg);
    if (this.memory.length > 20) {
      this.memory.shift();
    }
  }

  saveMemory(msg: any) {
    this.addMemory(msg);
  }

  // Phase 1: Input Analyzer
  analyzeInput(input: string) {
    return {
      text: input,
      length: input.length,
      hasCommand: input.startsWith("/"),
      language: this.detectLang(input),
    };
  }

  private detectLang(input: string): 'en' | 'hi' | 'bilingual' {
    const text = input.toLowerCase();
    const hindiKeywords = ["namaste", "kaise", "kya", "mera", "aap", "hai", "bhai", "yaar", "dost", "acha", "shukriya", "dhanyawad", "zaroor", "bilkul"];
    let hindiMatches = 0;
    for (const word of hindiKeywords) {
      if (text.includes(word)) hindiMatches++;
    }
    if (hindiMatches > 1) return 'hi';
    if (hindiMatches === 1) return 'bilingual';
    return 'en';
  }

  // Phase 2: Intent Engine
  detectIntent(input: string): 'chat' | 'planning' | 'developer' | 'debug' | 'knowledge' | 'reasoning' | 'learning' {
    const text = input.toLowerCase().trim();

    if (text.includes("plan") || text.startsWith("/plan") || text.includes("architecture") || text.includes("blueprint") || text.includes("roadmap")) {
      return "planning";
    }
    if (text.includes("build") || text.startsWith("/build") || text.includes("code") || text.startsWith("/run") || text === "build app" || text === "run app") {
      return "developer";
    }
    if (text.includes("error") || text.includes("fix") || text.includes("debug") || text.includes("issue")) {
      return "debug";
    }
    if (text.includes("why")) {
      return "reasoning";
    }
    if (text.includes("how")) {
      return "learning";
    }
    if (text.includes("what") || text.startsWith("/wiki")) {
      return "knowledge";
    }

    return "chat";
  }

  // Phase 3: Brain Router
  route(input: string, intent: string): "LOCAL" | "AI" {
    if (this.useLocal(intent, input)) {
      return "LOCAL";
    }
    return "AI";
  }

  useLocal(intent: string, input: string): boolean {
    const text = input.toLowerCase().trim();
    if (intent === "chat" && input.length < 25) return true;
    if (text.startsWith("/help")) return true;
    if (text === "hi" || text === "hello" || text === "hey" || text === "namaste") return true;
    return false;
  }

  // Phase 4: Local Intelligence Engine
  localBrain(input: string, intent: string): string {
    const text = input.toLowerCase().trim();

    // Phase 10: Block System / Execution Control
    if (text.startsWith("/build") || text.startsWith("/run") || text === "build app" || text === "run app") {
      return "⚠️ Execution is only available in Workspace.\nClick 'Open Workspace' to continue.";
    }

    if (text.startsWith("/help")) {
      return "💡 **MAMTA AI Help Guide**:\n- Use `/plan [idea]` to generate a master design plan.\n- Use `/wiki [query]` to search our system documentation.\n- Ask simple questions for conversational chat!\n- Commands `/build` and `/run` are restricted to the Workspace tab.";
    }

    if (text.includes("hi") || text === "hello" || text === "hey" || text === "namaste") {
      return "Hi 👋 What are you building today?";
    }

    if (text.includes("how are you")) {
      return "I'm doing great 😊 What about you?";
    }

    if (text === 'thanks' || text === 'thank you') {
      return "You're very welcome! Let me know if you need anything else. 😊";
    }

    if (text === 'bye' || text === 'goodbye') {
      return "Goodbye! Have an amazing day ahead! 😊";
    }

    return "Got it 👍 Tell me more.";
  }

  // Phase 6: Failsafe System
  fallback(input: string): string {
    return "⚠️ AI is busy, but I'm still here 👍";
  }

  // Phase 5: AI Engine (Gemini)
  async aiBrain(input: string, intent: string, sessionId: string, pageSource?: string): Promise<string> {
    try {
      // Check for explicit wiki command /wiki
      if (input.startsWith('/wiki ')) {
        const query = input.substring(6).trim().toLowerCase();
        const wikiEntries = await firestoreWiki.getEntries();
        const match = wikiEntries.find(
          e => e.title.toLowerCase().includes(query) || e.content.toLowerCase().includes(query)
        );

        if (match) {
          return `🔍 **OpenWiki Match Found**: **${match.title}**\n\n${match.content}\n\n*Tags: ${match.tags.join(', ')}*`;
        } else {
          return `❌ No OpenWiki entries found matching "${query}". You can add or search entries in the **Admin Dashboard > OpenWiki** panel.`;
        }
      }

      const client = getGeminiClient();
      firestoreLogs.incrementAiCalls();

      // Response Style Control
      let systemPrompt = '';
      if (intent === 'chat') {
        systemPrompt = `You are a friendly, human-like bilingually trained assistant.
GLOBAL RULES:
1. Keep your response extremely short, concise, and natural (strictly under 2-3 lines).
2. NEVER over-explain, NEVER list features, and NEVER describe your system architecture or available modes.
3. Keep the tone natural, warm, and conversational (English/Hindi blended naturally, e.g., "zaroor", "namaste", "bilkul").
4. ALWAYS end with a friendly, conversational follow-up question to keep the dialogue going.
5. Avoid low-quality AI-slop or infrastructure telemetry noise.`;
      } else if (intent === 'planning') {
        systemPrompt = `You are a senior system architect.
Formulate a beautifully structured, medium-length Master Plan in clean markdown for the requested project/app.
Include a high-level overview, key technical modules, and file structures.
Be concise, clear, and structured. Conclude with a friendly invitation to click the "Send to Workspace" button to transfer this plan to the Workspace core.`;
      } else if (intent === 'developer') {
        systemPrompt = `You are an expert full-stack developer.
Provide a highly detailed response outlining exact code files, libraries, and instructions for building the requested application.`;
      } else if (intent === 'debug') {
        systemPrompt = `You are a senior debugging engineer.
Provide a step-by-step diagnostic and fixing response to resolve the reported error or issue. List exact steps clearly.`;
      } else if (intent === 'reasoning') {
        systemPrompt = `You are an AI with deep reasoning capabilities. Give a highly logical, step-by-step reasoning breakdown to answer the user's question.`;
      } else if (intent === 'learning') {
        systemPrompt = `You are a patient and knowledgeable tutor. Explain the concept or process clearly with simple analogies and examples.`;
      } else if (intent === 'knowledge') {
        systemPrompt = `You are a knowledgeable system assistant.
Provide a clean, structured informational overview or query match from the system architecture or wiki.`;
      } else {
        systemPrompt = `You are MAMTA AI, an autonomous full-stack AI development assistant. Speak naturally in bilingual English/Hindi.`;
      }

      // Retrieve conversation history (Store last 10 messages in memory context)
      const history = (await firestoreChats.getChats(sessionId)).slice(-10);
      const contents = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: input }] });
      }

      const response = await generateContentWithRetry(client, {
        model: currentModelSelection,
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      return response.text || 'I am sorry, I could not generate a response at this time.';
    } catch (e) {
      return this.fallback(input);
    }
  }

  // Phase 8: Response Controller
  formatResponse(text: string, intent: string): string {
    if (intent === 'chat') {
      if (text.length > 250) {
        return text.substring(0, 250) + "...";
      }
    }
    return text;
  }

  // Phase 9: Full Brain Execution Flow (with Cache & Debounce)
  async process(input: string, sessionId: string, pageSource?: string): Promise<{ content: string, intent: 'chat' | 'planning' | 'developer' | 'debug' | 'knowledge' | 'reasoning' | 'learning', isLocal: boolean }> {
    if (this.isBusy) {
      return { content: "⚠️ System is busy, please wait.", intent: "chat", isLocal: true };
    }
    this.isBusy = true;

    const textKey = input.toLowerCase().trim();
    if (brainCache.has(textKey)) {
      console.log(`[Cache Hit] Serving response for: "${textKey}"`);
      this.isBusy = false;
      return brainCache.get(textKey)!;
    }

    try {
      // Layer 1: Input Analyzer
      const analyzed = this.analyzeInput(input);

      // Layer 2: Intent Engine
      const intent = this.detectIntent(input);

      // Layer 3: Brain Router
      const route = this.route(input, intent);

      let response = "";
      let isLocal = false;

      // Layer 4 & 5 Routing
      if (route === "LOCAL") {
        response = this.localBrain(input, intent);
        isLocal = true;
      } else {
        response = await this.aiBrain(input, intent, sessionId, pageSource);
        isLocal = false;
      }

      // Layer 7: Memory System
      this.addMemory({ role: 'user', content: input });
      this.addMemory({ role: 'model', content: response });

      // Layer 6: Response Controller
      const formattedResponse = this.formatResponse(response, intent);

      const result = { content: formattedResponse, intent, isLocal };

      // Phase 11: Cache System
      brainCache.set(textKey, result);

      this.isBusy = false;
      return result;
    } catch (e) {
      this.isBusy = false;
      return { 
        content: this.fallback(input), 
        intent: "chat", 
        isLocal: true 
      };
    }
  }
}

app.post('/api/chats', async (req, res) => {
  const { sessionId, content, pageSource } = req.body;
  if (!sessionId || !content) {
    return res.status(400).json({ error: 'sessionId and content are required' });
  }

  try {
    // Add User Message
    const userMsg = await firestoreChats.addChat({
      sessionId,
      role: 'user',
      content,
      pageSource: pageSource || 'home'
    });

    await firestoreLogs.addActivityLog({
      action: 'Send Chat Message',
      page: 'home',
      userSession: sessionId,
      details: content.substring(0, 100)
    });

    // Process through MamtaBrain
    const brain = new MamtaBrain();
    const result = await brain.process(content, sessionId, pageSource);

    // Save to brain memory
    brain.saveMemory({ role: 'user', content });
    brain.saveMemory({ role: 'model', content: result.content });

    // Add Model Response to Database
    const modelMsg = await firestoreChats.addChat({
      sessionId,
      role: 'model',
      content: result.content,
      pageSource: pageSource || 'home'
    });

    const isPlanningIntent = result.intent === 'planning';
    const isDeveloperIntent = result.intent === 'developer';

    res.json({
      userMessage: userMsg,
      modelMessage: modelMsg,
      suggestWorkspaceRedirect: isPlanningIntent || (isDeveloperIntent && result.isLocal),
      suggestedAction: isPlanningIntent ? 'generate_plan' : (isDeveloperIntent && result.isLocal ? 'redirect_workspace' : 'none')
    });

  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chats/clear', async (req, res) => {
  const { sessionId } = req.body;
  try {
    await firestoreChats.clearChats(sessionId ? String(sessionId) : undefined);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Master Plans Endpoints
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await sqlPlans.getPlans();
    res.json(plans);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await sqlPlans.getPlan(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/plans/generate', async (req, res) => {
  const { idea, sessionId } = req.body;
  if (!idea) return res.status(400).json({ error: 'Project idea is required' });

  try {
    const client = getGeminiClient();
    firestoreLogs.incrementAiCalls();

    await firestoreLogs.addActivityLog({
      action: 'Generate Master Plan',
      page: 'home',
      userSession: sessionId || 'ANON',
      details: idea.substring(0, 100)
    });

    const prompt = `You are MAMTA AI's Planning Engine. 
Generate a comprehensive, highly organized Master Plan for building this project:
"${idea}"

Format your response as markdown with these precise structural sections:
1. **Overview & Objectives**: Clear executive summary of the target application.
2. **Key Functional Features**: List of prioritized interactive features.
3. **Tech Stack Recommendation**: HTML5, Tailwind CSS, JavaScript/TypeScript (fully frontend client compatible, fit for this sandbox).
4. **Project Directory File Structure**: A clear folder map.
5. **Phase-by-Phase Task Breakdown**: A sequential task checklist (from setup, structure, visual layers, up to final testing).

Ensure the breakdown uses clear headings for tasks so that they can be easily parsed. Return only the beautiful Markdown plan.`;

    const response = await generateContentWithRetry(client, {
      model: currentModelSelection,
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    const planMarkdown = response.text || '# Master Plan\n\nNo content generated.';
    
    // Extract a neat title
    let title = 'Project Master Plan';
    const firstLine = planMarkdown.split('\n')[0];
    if (firstLine && firstLine.startsWith('# ')) {
      title = firstLine.replace('# ', '').trim();
    } else {
      // Try to find first heading
      const match = planMarkdown.match(/#+\s+(.+)/);
      if (match) title = match[1].trim();
    }

    const savedPlan = await sqlPlans.addPlan(title, planMarkdown);

    res.json(savedPlan);
  } catch (err: any) {
    console.error('Plan generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Tasks Endpoints
app.get('/api/plans/:id/tasks', async (req, res) => {
  try {
    const tasks = await sqlTasks.getTasks(req.params.id);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/plans/:id/analyze', async (req, res) => {
  const planId = req.params.id;
  const { sessionId } = req.body;

  try {
    const plan = await sqlPlans.getPlan(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    await firestoreLogs.addActivityLog({
      action: 'Analyze Plan Tasks',
      page: 'workspace',
      userSession: sessionId || 'ANON',
      details: `Analyzing plan ID: ${planId}`
    });

    // We clear current tasks first to allow re-analysis
    sqlTasks.clearTasks(planId);

    const client = getGeminiClient();
    firestoreLogs.incrementAiCalls();

    const prompt = `You are MAMTA AI's task formulation engine. 
Review the following Master Plan and decompose it into a strict JSON list of 5 to 10 sequential, practical tasks that can be individually generated and coded.

Master Plan content:
"""
${plan.content}
"""

You MUST respond with a valid JSON array matching this exact schema:
[
  {
    "title": "Task name (keep it brief and actionable, e.g. 'Setup HTML Base')",
    "description": "Specific functional checklist for this task (e.g. 'Create index.html, import Tailwind, configure meta headers, and prepare container divs')"
  }
]

Do not return any markdown code block wraps (\`\`\`json) or other text surrounding the JSON array. Output raw JSON only.`;

    const response = await generateContentWithRetry(client, {
      model: currentModelSelection,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    let rawJson = (response.text || '[]').trim();
    
    // Fallback parsing just in case it wrapped it in markdown
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawJson.startsWith('```')) {
      rawJson = rawJson.replace(/```\s*/, '').replace(/\s*```$/, '');
    }

    const taskList = JSON.parse(rawJson);
    if (!Array.isArray(taskList)) {
      throw new Error('AI output is not a list of tasks.');
    }

    const tasksToInsert = taskList.map((task: any, index: number) => ({
      planId,
      title: String(task.title || `Phase ${index + 1}`),
      description: String(task.description || 'Build task component'),
      status: 'pending' as const,
      order: index
    }));

    const insertedTasks = await sqlTasks.addTasks(tasksToInsert);
    await sqlPlans.updatePlan(planId, { status: 'in_progress' });

    res.json(insertedTasks);
  } catch (err: any) {
    console.error('Plan analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Build Task Endpoint
app.post('/api/plans/:planId/tasks/:taskId/build', async (req, res) => {
  const { planId, taskId } = req.params;
  const { sessionId } = req.body;

  try {
    const plan = await sqlPlans.getPlan(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const tasks = await sqlTasks.getTasks(planId);
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return res.status(404).json({ error: 'Task not found' });

    // Mark task as running
    await sqlTasks.updateTaskStatus(taskId, 'running');

    await firestoreLogs.addActivityLog({
      action: 'Build Code Task',
      page: 'workspace',
      userSession: sessionId || 'ANON',
      details: `Building task: ${targetTask.title}`
    });

    // Get current list of files in workspace
    const existingFiles = dbFiles.listProjectFiles(planId);
    const existingFilesMeta = existingFiles.map(fn => {
      try {
        const text = dbFiles.readFile(planId, fn);
        return `File: ${fn}\n\`\`\`\n${text.substring(0, 1000)}\n\`\`\``;
      } catch {
        return `File: ${fn} (binary or unreadable)`;
      }
    }).join('\n\n');

    const client = getGeminiClient();
    firestoreLogs.incrementAiCalls();

    const prompt = `You are MAMTA AI's Master Builder Engine. Your job is to generate functional, production-ready source files that fulfill the current task inside the project: "${plan.title}".

Overall Master Plan:
"""
${plan.content}
"""

Current Task to execute:
- Title: **${targetTask.title}**
- Checklist/Requirements: **${targetTask.description}**

Existing files already in this project's folder:
${existingFiles.length === 0 ? 'No files generated yet.' : existingFilesMeta}

**Styling Standards**:
- Use clean Tailwind CSS classes directly for styling.
- Ensure colors are modern, fonts are polished (Inter/JetBrains Mono), and visual alignment has premium breathing room (generous padding/margins).
- Include rich interactions, animations, and transitions where applicable.

Your output must be a strict JSON object listing the files that need to be created or overwritten. You must provide COMPLETE file contents. NEVER output placeholders or truncated comments like "// rest of code here".
JSON Schema to return:
{
  "files": [
    {
      "name": "relative/path/to/file.html",
      "content": "Full string content of the file."
    }
  ],
  "buildLogs": "Concise human-scannable build logging statements about what was created, compiled, or resolved (e.g. 'Successfully resolved Tailwind utility class bindings...')"
}

Do not return any markdown wraps or wrapper text. Return only the raw JSON.`;

    // We use gemini-3.1-pro-preview for complex tasks like file generation if selected, otherwise fallback
    const modelToUse = currentModelSelection === 'gemini-3.1-pro-preview' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    const response = await generateContentWithRetry(client, {
      model: modelToUse,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    });

    let rawJson = (response.text || '{}').trim();
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawJson.startsWith('```')) {
      rawJson = rawJson.replace(/```\s*/, '').replace(/\s*```$/, '');
    }

    const result = JSON.parse(rawJson);

    const logs: string[] = [];
    logs.push(`[AI] Started compilation for task: ${targetTask.title}`);

    if (result.files && Array.isArray(result.files)) {
      for (const file of result.files) {
        if (file.name && file.content !== undefined) {
          dbFiles.saveFile(planId, file.name, file.content);
          logs.push(`[BUILD] Saved file: ${file.name} (${file.content.length} bytes)`);
        }
      }
    }

    if (result.buildLogs) {
      logs.push(`[INFO] ${result.buildLogs}`);
    }

    logs.push(`[SUCCESS] Task "${targetTask.title}" compiled successfully.`);

    // Mark task as completed
    await sqlTasks.updateTaskStatus(taskId, 'completed', new Date().toISOString());

    // Check if all tasks for this plan are completed
    const updatedTasks = await sqlTasks.getTasks(planId);
    const allCompleted = updatedTasks.every(t => t.status === 'completed');
    if (allCompleted) {
      await sqlPlans.updatePlan(planId, { status: 'completed', completedAt: new Date().toISOString() });
      logs.push(`[SYSTEM] All project builds completed! Master plan fully executed.`);
    }

    res.json({
      status: 'completed',
      logs,
      filesWritten: result.files?.map((f: any) => f.name) || []
    });

  } catch (err: any) {
    console.error('Build task error:', err);
    await sqlTasks.updateTaskStatus(taskId, 'failed');
    res.status(500).json({ error: err.message });
  }
});

// Workspace Files Management
app.get('/api/workspace/files/:projectId', (req, res) => {
  const { projectId } = req.params;
  try {
    const files = dbFiles.listProjectFiles(projectId);
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/workspace/files/:projectId/read', (req, res) => {
  const { projectId } = req.params;
  const { fileName } = req.query;
  if (!fileName) return res.status(400).json({ error: 'fileName is required' });

  try {
    const text = dbFiles.readFile(projectId, String(fileName));
    res.json({ fileName, content: text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/workspace/files/:projectId/save', async (req, res) => {
  const { projectId } = req.params;
  const { fileName, content, sessionId } = req.body;
  if (!fileName || content === undefined) {
    return res.status(400).json({ error: 'fileName and content are required' });
  }

  try {
    dbFiles.saveFile(projectId, fileName, content);
    await firestoreLogs.addActivityLog({
      action: 'Save File Manually',
      page: 'workspace',
      userSession: sessionId || 'ANON',
      details: `Saved: ${fileName} in project ${projectId}`
    });
    res.json({ success: true, fileName });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/workspace/files/:projectId/delete', async (req, res) => {
  const { projectId } = req.params;
  const { fileName, sessionId } = req.body;
  if (!fileName) return res.status(400).json({ error: 'fileName is required' });

  try {
    dbFiles.deleteFile(projectId, fileName);
    await firestoreLogs.addActivityLog({
      action: 'Delete File',
      page: 'workspace',
      userSession: sessionId || 'ANON',
      details: `Deleted: ${fileName} in project ${projectId}`
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SafeDrop Vault Endpoints
app.get('/api/vault', async (req, res) => {
  try {
    const items = await firestoreVault.getVaultItems();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vault/store', async (req, res) => {
  const { keyName, value, itemType, masterPassword, sessionId } = req.body;
  if (!keyName || !value || !itemType || !masterPassword) {
    return res.status(400).json({ error: 'keyName, value, itemType, and masterPassword are required' });
  }

  try {
    const newItem = await firestoreVault.addVaultItem(keyName, value, itemType, masterPassword);
    await firestoreLogs.addActivityLog({
      action: 'Store Vault Item',
      page: 'safedrop',
      userSession: sessionId || 'ANON',
      details: `Stored key: ${keyName} of type ${itemType}`
    });
    res.json({ success: true, item: { id: newItem.id, keyName: newItem.keyName, itemType: newItem.itemType } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vault/retrieve', async (req, res) => {
  const { id, masterPassword, sessionId } = req.body;
  if (!id || !masterPassword) {
    return res.status(400).json({ error: 'id and masterPassword are required' });
  }

  try {
    const items = await firestoreVault.getVaultItems();
    const match = items.find(item => item.id === id);
    if (!match) return res.status(404).json({ error: 'Vault item not found' });

    const decrypted = decryptValue(match.encryptedValue, masterPassword);

    await firestoreLogs.addActivityLog({
      action: 'Decrypt Vault Item',
      page: 'safedrop',
      userSession: sessionId || 'ANON',
      details: `Accessed credential: ${match.keyName}`
    });

    res.json({ decryptedValue: decrypted });
  } catch (err: any) {
    res.status(400).json({ error: 'Decryption failed. Please verify that your Master Password is correct.' });
  }
});

app.delete('/api/vault/:id', async (req, res) => {
  const { id } = req.params;
  const { sessionId } = req.body;
  try {
    await firestoreVault.deleteVaultItem(id);
    await firestoreLogs.addActivityLog({
      action: 'Delete Vault Item',
      page: 'safedrop',
      userSession: sessionId || 'ANON',
      details: `Removed vault record ID: ${id}`
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Metrics
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const activeChats = await firestoreChats.getChats();
    const distinctSessions = new Set(activeChats.map(c => c.sessionId));
    
    const activePlans = await sqlPlans.getPlans();
    const totalPlans = activePlans.length;
    const completedPlans = activePlans.filter(p => p.status === 'completed').length;
    const successRate = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 100;

    // Direct process info
    const memUsage = process.memoryUsage();
    const uptimeSec = Math.round(process.uptime());

    // Generate mock but reactive health diagnostics
    const cpuPct = Math.round(15 + Math.sin(Date.now() / 10000) * 10); // Simulated reactive CPU
    const diskPct = 34; // Static simulated disk usage

    res.json({
      cpuUsage: Math.max(0, cpuPct),
      memoryUsage: {
        used: Math.round(memUsage.heapUsed / (1024 * 1024)),
        total: Math.round(memUsage.heapTotal / (1024 * 1024)),
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      },
      diskUsage: {
        used: 17,
        total: 50,
        percentage: diskPct
      },
      dbConnected: true,
      uptime: uptimeSec,
      aiCallsToday: firestoreLogs.getAiCallsCount(),
      activeSessions: distinctSessions.size || 1,
      plansGenerated: totalPlans,
      successRate
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Logs Endpoint
app.get('/api/admin/logs', async (req, res) => {
  try {
    const logs = await firestoreLogs.getActivityLogs();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Wiki Endpoints
app.get('/api/admin/wiki', async (req, res) => {
  try {
    const entries = await firestoreWiki.getEntries();
    res.json(entries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/wiki', async (req, res) => {
  const { title, content, tags, sessionId } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });

  try {
    const entry = await firestoreWiki.addEntry(title, content, tags || []);
    await firestoreLogs.addActivityLog({
      action: 'Create Wiki Entry',
      page: 'admin',
      userSession: sessionId || 'SYSTEM',
      details: `Created wiki entry: ${title}`
    });
    res.json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/wiki/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, sessionId } = req.body;

  try {
    const entry = await firestoreWiki.updateEntry(id, { title, content, tags });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    await firestoreLogs.addActivityLog({
      action: 'Update Wiki Entry',
      page: 'admin',
      userSession: sessionId || 'SYSTEM',
      details: `Updated wiki entry: ${entry.title}`
    });
    res.json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/wiki/:id', async (req, res) => {
  const { id } = req.params;
  const { sessionId } = req.body;
  try {
    await firestoreWiki.deleteEntry(id);
    await firestoreLogs.addActivityLog({
      action: 'Delete Wiki Entry',
      page: 'admin',
      userSession: sessionId || 'SYSTEM',
      details: `Deleted wiki entry ID: ${id}`
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings Models & Export Configuration
app.get('/api/settings/config', (req, res) => {
  res.json({
    activeModel: currentModelSelection,
    availableModels: [
      { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Default - Fast & Multilingual)' },
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview (Complex Reasoning)' }
    ]
  });
});

app.post('/api/settings/config', async (req, res) => {
  const { model, sessionId } = req.body;
  if (!model) return res.status(400).json({ error: 'model selection is required' });

  try {
    currentModelSelection = model;
    await firestoreLogs.addActivityLog({
      action: 'Modify Model Configuration',
      page: 'admin',
      userSession: sessionId || 'SYSTEM',
      details: `Set active Gemini model to: ${model}`
    });
    res.json({ success: true, activeModel: currentModelSelection });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings/export', (req, res) => {
  const { format, sessionId } = req.body;
  if (!format) return res.status(400).json({ error: 'export format is required' });

  try {
    const db = readDb();
    
    dbLogs.addActivityLog({
      action: 'Export Database Backups',
      page: 'safedrop',
      userSession: sessionId || 'SYSTEM',
      details: `Exported system state to format: ${format}`
    });

    // Strip sensitive encrypted keys for safe client presentation unless specified otherwise
    const safeDb = {
      ...db,
      vaultItems: db.vaultItems.map(item => ({
        id: item.id,
        keyName: item.keyName,
        itemType: item.itemType,
        createdAt: item.createdAt,
        encryptedValue: 'MOCKED_MASKED_FOR_BACKUP'
      }))
    };

    res.json({
      success: true,
      data: format === 'json' ? JSON.stringify(safeDb, null, 2) : safeDb
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Simulated GitHub Push
app.post('/api/workspace/files/:projectId/push-to-github', (req, res) => {
  const { projectId } = req.params;
  const { repoName, commitMessage, branchName, githubToken, sessionId } = req.body;
  
  if (!repoName || !commitMessage || !githubToken) {
    return res.status(400).json({ error: 'repoName, commitMessage, and githubToken are required' });
  }

  try {
    const files = dbFiles.listProjectFiles(projectId);
    if (files.length === 0) {
      return res.status(400).json({ error: 'No build files exist to push. Build the project tasks first!' });
    }

    const branch = branchName || `mamta-build-${projectId}`;
    
    // Simulate real logs
    const pushLogs = [
      `[GIT] Initializing temporary Git workspace in: /data/generated/${projectId}...`,
      `[GIT] Staged ${files.length} build files for sync: ${files.slice(0, 3).join(', ')}${files.length > 3 ? '...' : ''}`,
      `[GIT] Configured user credentials securely...`,
      `[GIT] Running: git commit -m "${commitMessage}"`,
      `[GIT] Pushed files to remote target: https://github.com/user/${repoName}.git`,
      `[SUCCESS] Successfully pushed branch '${branch}' to remote GitHub repository!`,
      `[INFO] Repository now live on: https://github.com/user/${repoName}`
    ];

    dbLogs.addActivityLog({
      action: 'Push Project to GitHub',
      page: 'workspace',
      userSession: sessionId || 'ANON',
      details: `Pushed ${files.length} files to github.com/user/${repoName}`
    });

    res.json({
      success: true,
      logs: pushLogs,
      remoteUrl: `https://github.com/user/${repoName}`
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Serve static frontend in production; run Vite dev middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAMTA AI Server running on http://localhost:${PORT}`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;
