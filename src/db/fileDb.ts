import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  ChatMessage, 
  MasterPlan, 
  ProjectTask, 
  VaultItem, 
  WikiEntry, 
  ActivityLog 
} from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const GENERATED_DIR = path.join(DATA_DIR, 'generated');

interface DbSchema {
  chats: ChatMessage[];
  plans: MasterPlan[];
  tasks: ProjectTask[];
  vaultItems: VaultItem[];
  wikiEntries: WikiEntry[];
  activityLogs: ActivityLog[];
  aiCallsCount: number;
}

// Default Seed Data
const DEFAULT_WIKI_ENTRIES: WikiEntry[] = [
  {
    id: 'wiki_1',
    title: 'MAMTA AI System Architecture',
    content: 'MAMTA AI v7.0 is an autonomous AI companion designed for structured thinking and automated coding. It consists of four integrated cores: \n\n1. **Home Chat**: For conversational ideation, bilingual reasoning (Hindi + English), and high-level project formulation.\n2. **Workspace IDE**: A 3-column system acting as an AI code generator, editor, task checklist executive, and live build console.\n3. **Admin Dashboard**: Real-time system monitoring, server diagnostics, activity tracking, and OpenWiki editing.\n4. **SafeDrop Vault**: Crytographically secured credential locker for API keys and access tokens.\n\n*Motto: Think in Home. Build in Workspace. Monitor in Admin. Secure in SafeDrop. Powered by Google AI Studio.*',
    tags: ['Architecture', 'System', 'MAMTA'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'wiki_2',
    title: 'Google AI Studio & Gemini Models',
    content: 'MAMTA AI utilizes modern Google AI Studio models to perform deep reasoning, code generation, and intent classification:\n\n- **Gemini 3.5 Flash (`gemini-3.5-flash`)**: High-speed, bilingual text generator and intent classifier used for Home Chat and instant summaries.\n- **Gemini 3.1 Pro Preview (`gemini-3.1-pro-preview`)**: Advanced reasoning and multi-file code generator, used in Workspace IDE to translate plans into actual functional software.\n\n*Tip: Never hardcode your API keys. Store them in the SafeDrop Vault where they are encrypted with AES-256-GCM before hitting the database.*',
    tags: ['Gemini', 'Google AI Studio', 'Models'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'wiki_3',
    title: 'SafeDrop Encrypted Vault Details',
    content: 'Security is paramount. The SafeDrop Vault employs **AES-256-CBC** symmetric encryption via Node.js native `crypto` module.\n\n- **Encryption Process**: When storing a secret, MAMTA AI derives a secure 256-bit key from the Master Password. It then encrypts the plain text alongside a randomly generated Initialization Vector (IV).\n- **Decryption Process**: Values are decrypted purely on-demand when clicked and are never saved in plain text on disk. \n- **Timed Reveal**: The UI automatically masks revealed passwords after 10 seconds to protect against shoulder-surfing.',
    tags: ['Security', 'SafeDrop', 'Encryption'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'wiki_4',
    title: 'Workspace IDE Tasks & Automation',
    content: 'Workspace acts as the active executor of Master Plans. \n\n1. **Analyze Plan**: Sends the plan to Gemini 3.1 Pro to output a strict JSON list of 5-15 logical tasks.\n2. **Task Checklist**: Tracks completion progress (`pending` -> `running` -> `completed` -> `failed`).\n3. **Task Build**: Feeds the code-generation prompt containing current task specs, the project folder context, and styling standards to Gemini to generate functional source files.\n4. **Disk Persistence**: Saves physical files locally in `data/generated/{project_id}/`. They are fully previewable and editable in the central code viewer.',
    tags: ['Workspace', 'Automation', 'IDE'],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_DB: DbSchema = {
  chats: [],
  plans: [],
  tasks: [],
  vaultItems: [],
  wikiEntries: DEFAULT_WIKI_ENTRIES,
  activityLogs: [
    {
      id: 'log_init',
      action: 'System Initialization',
      page: 'admin',
      userSession: 'SYSTEM',
      details: 'MAMTA AI File DB initialized successfully and populated with initial OpenWiki entries.',
      timestamp: new Date().toISOString()
    }
  ],
  aiCallsCount: 0
};

// Ensure directories exist
function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
}

// Low-level DB access
export function readDb(): DbSchema {
  ensureDirs();
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
    return INITIAL_DB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read database, returning initial schema:', err);
    return INITIAL_DB;
  }
}

export function writeDb(db: DbSchema) {
  ensureDirs();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database to disk:', err);
  }
}

// Cryptography Helpers
const ALGORITHM = 'aes-256-gcm';
const PBKDF2_ITERATIONS = 600000;
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;

export function encryptValue(plainText: string, masterPassword: string): string {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.pbkdf2Sync(
      masterPassword, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha512'
    );
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `v2:${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    throw new Error('Encryption failed. Verify master password strength.');
  }
}

export function decryptValue(encryptedPayload: string, masterPassword: string): string {
  try {
    if (encryptedPayload.startsWith('v2:')) {
      const parts = encryptedPayload.split(':');
      const [, saltHex, ivHex, authTagHex, encrypted] = parts;
      const salt = Buffer.from(saltHex, 'hex');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const key = crypto.pbkdf2Sync(
        masterPassword, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha512'
      );
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
    // Legacy fallback
    return decryptLegacy(encryptedPayload, masterPassword);
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Decryption failed. Invalid master password.');
  }
}

function decryptLegacy(encryptedHex: string, masterPassword: string): string {
  const LEGACY_SALT = 'mamta_ai_encryption_salt_2026';
  const key = crypto.pbkdf2Sync(masterPassword, LEGACY_SALT, 10000, 32, 'sha256');
  const iv = crypto.pbkdf2Sync(masterPassword, LEGACY_SALT + '_iv', 5000, 16, 'sha256');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function verifyMasterPassword(encryptedPayload: string, masterPassword: string): boolean {
  try {
    decryptValue(encryptedPayload, masterPassword);
    return true;
  } catch {
    return false;
  }
}

// --- Chats Operations ---
export const dbChats = {
  getChats: (sessionId?: string) => {
    const db = readDb();
    if (sessionId) {
      return db.chats.filter(c => c.sessionId === sessionId);
    }
    return db.chats;
  },
  addChat: (chat: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const db = readDb();
    const newChat: ChatMessage = {
      ...chat,
      id: 'chat_' + crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    db.chats.push(newChat);
    writeDb(db);
    return newChat;
  },
  clearChats: (sessionId?: string) => {
    const db = readDb();
    if (sessionId) {
      db.chats = db.chats.filter(c => c.sessionId !== sessionId);
    } else {
      db.chats = [];
    }
    writeDb(db);
  }
};

// --- Plans Operations ---
export const dbPlans = {
  getPlans: () => readDb().plans,
  getPlan: (id: string) => readDb().plans.find(p => p.id === id),
  addPlan: (title: string, content: string) => {
    const db = readDb();
    const newPlan: MasterPlan = {
      id: 'plan_' + Date.now(),
      title,
      content,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.plans.push(newPlan);
    writeDb(db);
    return newPlan;
  },
  updatePlan: (id: string, updates: Partial<MasterPlan>) => {
    const db = readDb();
    const index = db.plans.findIndex(p => p.id === id);
    if (index !== -1) {
      db.plans[index] = { ...db.plans[index], ...updates };
      writeDb(db);
      return db.plans[index];
    }
    return null;
  }
};

// --- Tasks Operations ---
export const dbTasks = {
  getTasks: (planId: string) => {
    const db = readDb();
    return db.tasks
      .filter(t => t.planId === planId)
      .sort((a, b) => a.order - b.order);
  },
  addTasks: (tasks: Omit<ProjectTask, 'id' | 'createdAt'>[]) => {
    const db = readDb();
    const createdTasks: ProjectTask[] = tasks.map(t => ({
      ...t,
      id: 'task_' + crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }));
    db.tasks.push(...createdTasks);
    writeDb(db);
    return createdTasks;
  },
  updateTaskStatus: (taskId: string, status: ProjectTask['status'], completedAt?: string) => {
    const db = readDb();
    const index = db.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      db.tasks[index].status = status;
      if (completedAt) db.tasks[index].completedAt = completedAt;
      writeDb(db);
      return db.tasks[index];
    }
    return null;
  },
  clearTasks: (planId: string) => {
    const db = readDb();
    db.tasks = db.tasks.filter(t => t.planId !== planId);
    writeDb(db);
  }
};

// --- Vault Operations ---
export const dbVault = {
  getVaultItems: () => {
    const db = readDb();
    // Return items WITHOUT revealing the actual encrypted content directly, or return them but mask them in frontend
    return db.vaultItems.map(item => ({
      id: item.id,
      keyName: item.keyName,
      itemType: item.itemType,
      createdAt: item.createdAt,
      encryptedValue: item.encryptedValue // Still need to return the encrypted block so client can decrypt on demand
    }));
  },
  addVaultItem: (keyName: string, plainValue: string, itemType: VaultItem['itemType'], masterPassword: string) => {
    const db = readDb();
    const encrypted = encryptValue(plainValue, masterPassword);
    const newItem: VaultItem = {
      id: 'vault_' + crypto.randomUUID(),
      keyName,
      itemType,
      encryptedValue: encrypted,
      createdAt: new Date().toISOString()
    };
    db.vaultItems.push(newItem);
    writeDb(db);
    return newItem;
  },
  deleteVaultItem: (id: string) => {
    const db = readDb();
    db.vaultItems = db.vaultItems.filter(item => item.id !== id);
    writeDb(db);
  }
};

// --- OpenWiki Operations ---
export const dbWiki = {
  getEntries: () => readDb().wikiEntries,
  getEntry: (id: string) => readDb().wikiEntries.find(e => e.id === id),
  addEntry: (title: string, content: string, tags: string[]) => {
    const db = readDb();
    const newEntry: WikiEntry = {
      id: 'wiki_' + Date.now(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString()
    };
    db.wikiEntries.push(newEntry);
    writeDb(db);
    return newEntry;
  },
  updateEntry: (id: string, updates: Partial<WikiEntry>) => {
    const db = readDb();
    const index = db.wikiEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      db.wikiEntries[index] = { ...db.wikiEntries[index], ...updates };
      writeDb(db);
      return db.wikiEntries[index];
    }
    return null;
  },
  deleteEntry: (id: string) => {
    const db = readDb();
    db.wikiEntries = db.wikiEntries.filter(e => e.id !== id);
    writeDb(db);
  }
};

// --- Logging Operations ---
export const dbLogs = {
  getActivityLogs: () => readDb().activityLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const db = readDb();
    const newLog: ActivityLog = {
      ...log,
      id: 'act_' + crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    db.activityLogs.push(newLog);
    // Prune log length to 100 entries to save disk/RAM
    if (db.activityLogs.length > 100) {
      db.activityLogs = db.activityLogs.slice(-100);
    }
    writeDb(db);
    return newLog;
  },
  incrementAiCalls: () => {
    const db = readDb();
    db.aiCallsCount = (db.aiCallsCount || 0) + 1;
    writeDb(db);
    return db.aiCallsCount;
  },
  getAiCallsCount: () => readDb().aiCallsCount || 0
};

// --- File Generation Utilities ---
export const dbFiles = {
  getGeneratedDir: () => GENERATED_DIR,
  getProjectDir: (projectId: string) => path.join(GENERATED_DIR, projectId),
  
  saveFile: (projectId: string, fileName: string, content: string) => {
    const projDir = path.join(GENERATED_DIR, projectId);
    if (!fs.existsSync(projDir)) {
      fs.mkdirSync(projDir, { recursive: true });
    }
    const filePath = path.join(projDir, fileName);
    
    // Create nested subdirectories if the fileName contains directories (e.g. templates/home.html)
    const fileDir = path.dirname(filePath);
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  },

  readFile: (projectId: string, fileName: string): string => {
    const filePath = path.join(GENERATED_DIR, projectId, fileName);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    throw new Error(`File not found: ${fileName}`);
  },

  deleteFile: (projectId: string, fileName: string) => {
    const filePath = path.join(GENERATED_DIR, projectId, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },

  listProjectFiles: (projectId: string): string[] => {
    const projDir = path.join(GENERATED_DIR, projectId);
    if (!fs.existsSync(projDir)) {
      return [];
    }

    const files: string[] = [];
    const walk = (dir: string, relativePath = '') => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const rel = relativePath ? `${relativePath}/${item}` : item;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath, rel);
        } else {
          files.push(rel);
        }
      }
    };
    walk(projDir);
    return files;
  },

  listProjects: (): string[] => {
    ensureDirs();
    return fs.readdirSync(GENERATED_DIR).filter(item => {
      const fullPath = path.join(GENERATED_DIR, item);
      return fs.statSync(fullPath).isDirectory();
    });
  }
};
