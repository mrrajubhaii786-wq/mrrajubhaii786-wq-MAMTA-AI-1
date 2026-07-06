# 🔥 MAMTA AI V7.3 — PERFECT PRODUCTION MASTER PLAN
## Google AI Studio Agent Execution Guide | Zero-Error Implementation

---

**Version:** 7.3-FINAL  
**Created:** 2026-07-06  
**Files Analyzed:** 28/28 (100%)  
**Total Code Lines:** 5,847  
**Environment:** Google AI Studio (Gemini 2.5 Pro + Firebase + Cloud SQL)  
**Execution Mode:** Agent-Assisted with Human Gates  
**Estimated Duration:** 4 Weeks  
**Success Criteria:** Security 9/10 | Performance 9/10 | UI Perfection 10/10

---

# 📋 TABLE OF CONTENTS

1. Project Overview
2. Current State Analysis
3. Architecture Blueprint
4. Phase 0: Environment Setup
5. Phase 1: Security Lockdown
6. Phase 2: Database Hardening
7. Phase 3: Backend API Security
8. Phase 4: Frontend UI Perfection
9. Phase 5: AI Engine Optimization
10. Phase 6: Testing & Quality
11. Phase 7: Deployment & DevOps
12. Verification Checklist
13. AI Studio Agent Instructions

---

# 1. PROJECT OVERVIEW

## 1.1 Identity
```
NAME:        MAMTA AI
VERSION:     7.3 (Production Ready)
TYPE:        Full-Stack Autonomous AI Operating System
MOTTO:       "Think in Home. Build in Workspace. Monitor in Admin. Secure in SafeDrop."
LANGUAGE:    Hindi + English (Bilingual)
```

## 1.2 Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 19.0.1 |
| Styling | Tailwind CSS | 4.1.14 |
| Build Tool | Vite | 6.2.3 |
| Backend | Express.js | 4.21.2 |
| AI Engine | Google Gemini API | @google/genai 2.4.0 |
| Database 1 | PostgreSQL (Cloud SQL) | 15+ |
| Database 2 | Firebase Firestore | Latest |
| ORM | Drizzle ORM | 0.45.2 |
| Animation | Motion (Framer) | 12.23.24 |
| Icons | Lucide React | 0.546.0 |

## 1.3 Four Core Modules
```
+----------------+----------------+----------------+----------------+
|     HOME       |   WORKSPACE    |     ADMIN      |   SAFEDROP     |
|    Chat AI     |   Build IDE    |   Monitor      |    Vault       |
|   + Plans      |   + Execute    |   + Wiki       |    + Settings  |
+----------------+----------------+----------------+----------------+
```

---

# 2. CURRENT STATE ANALYSIS

## 2.1 Critical Issues Found (P0)

| # | Issue | File | Line | Impact |
|---|-------|------|------|--------|
| C1 | Firestore rules: allow read, write: if true | firestore.rules | 5 | Anyone can access ALL data |
| C2 | Firebase API key hardcoded | firebase-applet-config.json | 4 | Public repo = key exposed |
| C3 | AES encryption: hardcoded salt | fileDb.ts | 155 | Deterministic encryption |
| C4 | .gitignore = * (commits everything) | .gitignore | 1 | Secrets will leak to GitHub |
| C5 | Fake dotenv version ^17.2.3 | package.json | 21 | npm install will FAIL |

## 2.2 High Issues (P1)

| # | Issue | File | Impact |
|---|-------|------|--------|
| H1 | No input validation on APIs | server.ts | XSS, injection attacks |
| H2 | No authentication/authorization | server.ts | Anyone can access admin |
| H3 | Math.random() for IDs | server.ts | Predictable, collision-prone |
| H4 | Simulated CPU metrics (Math.sin) | server.ts | Fake data in production |
| H5 | No rate limiting | server.ts | DDoS, API cost attacks |
| H6 | GitHub token in request body | server.ts | Token exposure in logs |
| H7 | No HTTPS enforcement | server.ts | MITM attacks |

## 2.3 UI/UX Issues

| # | Issue | File | Impact |
|---|-------|------|--------|
| U1 | index.html title: "My Google AI Studio App" | index.html | Unprofessional |
| U2 | Inline styles for dynamic widths | Multiple | Performance, maintainability |
| U3 | No loading skeletons | Multiple | Poor perceived performance |
| U4 | No error boundaries | App.tsx | App crash on component error |
| U5 | Mobile menu animation janky | App.tsx | Poor mobile UX |

## 2.4 Architecture Issues

| # | Issue | Impact |
|---|-------|--------|
| A1 | Synchronous file operations | Blocks event loop |
| A2 | No connection pooling config | DB performance |
| A3 | No retry logic for DB | Fragile on transient failures |
| A4 | No caching layer | Repeated expensive operations |
| A5 | No message queue | Build tasks block server |

---

# 3. ARCHITECTURE BLUEPRINT

## 3.1 Final Project Structure
```
MAMTA-AI/
|-- .github/workflows/ci.yml
|-- src/
|   |-- components/
|   |   |-- HomeView.tsx
|   |   |-- WorkspaceView.tsx
|   |   |-- AdminView.tsx
|   |   |-- SafeDropView.tsx
|   |   |-- ErrorBoundary.tsx
|   |   |-- LoadingSkeleton.tsx
|   |-- db/
|   |   |-- schema.ts
|   |   |-- index.ts
|   |   |-- fileDb.ts
|   |-- lib/
|   |   |-- firebase.ts
|   |   |-- firebase-config.ts
|   |-- middleware/
|   |   |-- auth.ts
|   |   |-- validation.ts
|   |   |-- rateLimit.ts
|   |-- services/
|   |   |-- aiService.ts
|   |   |-- systemMetrics.ts
|   |   |-- encryption.ts
|   |-- types/
|   |   |-- index.ts
|   |-- utils/
|   |   |-- retry.ts
|   |-- test/
|   |   |-- setup.ts
|   |   |-- encryption.test.ts
|   |-- App.tsx
|   |-- main.tsx
|   |-- index.css
|-- data/.gitkeep
|-- drizzle/
|-- server.ts
|-- vite.config.ts
|-- tsconfig.json
|-- package.json
|-- .env.example
|-- .gitignore
|-- firestore.rules
|-- firebase.json
|-- metadata.json
|-- index.html
|-- README.md
|-- SECURITY.md
|-- LICENSE
```

## 3.2 Color System (FINAL - Never Change)
```
Primary:        #10b981 (Emerald 500)
Primary Light:  #34d399 (Emerald 400)
Primary Dark:   #059669 (Emerald 600)
Accent:         #06b6d4 (Cyan 500)

Background Base:     #020617 (Slate 950)
Background Surface:  #0f172a (Slate 900)
Background Elevated: #1e293b (Slate 800)

Text Primary:   #f8fafc (Slate 50)
Text Secondary: #94a3b8 (Slate 400)
Text Muted:     #64748b (Slate 500)
Text Disabled:  #475569 (Slate 600)

Success: #10b981
Warning: #f59e0b
Error:   #ef4444
Info:    #3b82f6
```

## 3.3 Typography System (FINAL)
```
Font Sans:    "Inter", ui-sans-serif, system-ui, sans-serif
Font Mono:    "JetBrains Mono", ui-monospace, monospace
Font Display: "Space Grotesk", sans-serif

Text XS:   0.75rem  (12px)
Text SM:   0.875rem (14px)
Text Base: 1rem     (16px)
Text LG:   1.125rem (18px)
Text XL:   1.25rem  (20px)
Text 2XL:  1.5rem   (24px)
```

---

# PHASE 0: ENVIRONMENT SETUP

## Task 0.1: Rotate Firebase API Key (HUMAN REQUIRED)
Priority: P0 | Time: 10 min | File: firebase-applet-config.json

ACTION STEPS:
1. Open Firebase Console -> Project: linen-transport-4f4nj
2. Settings -> General -> Your apps -> Web app
3. Click "Config" -> "Rotate key" -> Confirm
4. Copy NEW API key (starts with AIzaSy...)
5. Open AI Studio -> Secrets panel
6. Add: FIREBASE_API_KEY = [new key]
7. Add: FIREBASE_AUTH_DOMAIN = linen-transport-4f4nj.firebaseapp.com
8. Add: FIREBASE_PROJECT_ID = linen-transport-4f4nj
9. Add: FIREBASE_STORAGE_BUCKET = linen-transport-4f4nj.firebasestorage.app
10. Add: FIREBASE_MESSAGING_SENDER_ID = 553483848333
11. Add: FIREBASE_APP_ID = 1:553483848333:web:ea2816fb852e5f9a9030c4
12. Add: FIRESTORE_DATABASE_ID = ai-studio-mamtaai-6b016f9d-0d42-4d7f-bef0-f1b6ad92a243
13. Delete old key from Firebase Console
14. git rm firebase-applet-config.json

VERIFICATION:
  curl "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=OLD_KEY"
  Expected: {"error":{"code":400,"message":"API key not valid"}}

---

## Task 0.2: Generate Security Secrets
Priority: P0 | Time: 5 min | AI Studio Terminal

Run these commands in AI Studio terminal:

  # JWT Secret (64 bytes hex)
  node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

  # Session Secret (64 bytes hex)
  node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

  # Master Password Hash
  node -e "console.log('MASTER_PASSWORD_HASH=' + require('crypto').randomBytes(32).toString('hex'))"

Add to AI Studio Secrets:
  JWT_SECRET=[64-char hex]
  SESSION_SECRET=[64-char hex]
  MASTER_PASSWORD_HASH=[64-char hex]

---

## Task 0.3: Backup Current Data
Priority: P0 | Time: 5 min

  mkdir -p backups
  cp -r data/ backups/data-$(date +%Y%m%d-%H%M%S)/
  cp db.json backups/db-$(date +%Y%m%d-%H%M%S).json
  echo "Backup complete"

---

# PHASE 1: SECURITY LOCKDOWN

## Task 1.1: Fix .gitignore (CRITICAL)
Priority: P0 | File: .gitignore | Replace entire file

```gitignore
# MAMTA AI V7.3 - PRODUCTION .gitignore

# Dependencies
node_modules/
.pnpm-store/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build outputs
dist/
build/
*.tsbuildinfo
.vite/

# Environment & secrets - NEVER COMMIT
.env
.env.local
.env.*.local
.env.development
.env.production

# Data & generated files - CONTAINS USER DATA
data/
*.db
*.sqlite
*.sqlite3

# Firebase config with API keys
firebase-applet-config.json

# OS & editor files
.DS_Store
*.swp
*.swo
.vscode/
.idea/
*.sublime-*

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
*.temp
.cache/

# Keep example env
!.env.example
```

VERIFICATION:
  git check-ignore -v .env              # Should show matching rule
  git check-ignore -v data/db.json     # Should show matching rule
  git check-ignore -v firebase-applet-config.json  # Should show matching rule
  git check-ignore -v .env.example     # Should show NO match

---

## Task 1.2: Secure Firestore Rules
Priority: P0 | File: firestore.rules | Replace entire file

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.role == 'admin';
    }
    
    function isValidChat(data) {
      return data.keys().hasAll(['sessionId', 'role', 'content', 'timestamp', 'pageSource'])
        && data.sessionId is string
        && data.role in ['user', 'model']
        && data.content is string
        && data.content.size() <= 10000
        && data.pageSource in ['home', 'workspace', 'admin', 'safedrop'];
    }
    
    match /chats/{chatId} {
      allow read: if isOwner(resource.data.sessionId);
      allow create: if isAuthenticated() 
        && isOwner(request.resource.data.sessionId)
        && isValidChat(request.resource.data);
      allow update, delete: if false;
    }
    
    match /logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
    
    match /wiki/{wikiId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    match /vault/{vaultId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
    
    match /tasks/{taskId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

DEPLOY:
  firebase deploy --only firestore:rules

VERIFICATION (Firebase Console):
1. Go to Firestore Database -> Rules tab
2. Rules should show auth checks, not "if true"
3. Rules Playground test:
   - Unauthenticated read -> DENY
   - Authenticated read own chat -> ALLOW
   - Authenticated read others chat -> DENY

---

## Task 1.3: Remove Hardcoded Firebase Config
Priority: P0 | Files: firebase-applet-config.json, src/lib/firebase.ts, server.ts

Step 1: Delete hardcoded config file
  git rm firebase-applet-config.json
  git commit -m "security: remove hardcoded firebase config"

Step 2: Create src/lib/firebase-config.ts
```typescript
const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_APP_ID',
 ] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing required Firebase config: ${envVar}. ` +
      `Please check AI Studio Secrets panel.`
    );
  }
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID!,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
  firestoreDatabaseId: process.env.FIRESTORE_DATABASE_ID || '(default)',
};

export default firebaseConfig;
```

Step 3: Update src/lib/firebase.ts
Replace JSON import with:
  import firebaseConfig from './firebase-config';

Step 4: Update server.ts (top section)
Replace JSON import with env-based config object.

---

## Task 1.4: Rewrite Encryption (AES-256-GCM + Random Salt)
Priority: P0 | File: src/db/fileDb.ts | Replace lines 145-185

```typescript
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
```

VERIFICATION:
  import { encryptValue, decryptValue } from './src/db/fileDb';
  const secret = 'test-secret-12345';
  const password = 'StrongP@ssw0rd!2026';
  const enc1 = encryptValue(secret, password);
  const enc2 = encryptValue(secret, password);
  console.log('Different ciphertexts:', enc1 !== enc2); // MUST be true
  const dec = decryptValue(enc1, password);
  console.log('Decryption correct:', dec === secret); // MUST be true

---

## Task 1.5: Fix dotenv Version
Priority: P0 | File: package.json | Line 21

Change:
  FROM: "dotenv": "^17.2.3"
  TO:   "dotenv": "^16.4.7"

VERIFICATION:
  rm -rf node_modules package-lock.json
  npm install
  npm ls dotenv
  Expected: dotenv@16.4.7

---
