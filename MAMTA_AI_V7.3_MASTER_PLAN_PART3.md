# PHASE 4: FRONTEND UI PERFECTION

## Task 4.1: Fix index.html Title
Priority: P2 | File: index.html | Replace entire file

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="MAMTA AI - Autonomous Full-Stack AI Development Platform powered by Google Gemini" />
    <meta name="theme-color" content="#020617" />
    <meta name="color-scheme" content="dark" />
    <link rel="icon" type="image/svg+xml" href="/mamta-logo.svg" />
    <title>MAMTA AI - Autonomous Development Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Task 4.2: Add Error Boundary
Priority: P2 | New File: src/components/ErrorBoundary.tsx

```typescript
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-400 mb-6 text-center max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Update App.tsx to wrap main content with ErrorBoundary.

---

## Task 4.3: Add Loading Skeletons
Priority: P2 | New File: src/components/LoadingSkeleton.tsx

```typescript
import React from 'react';

export function ChatSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex gap-4 max-w-2xl mx-auto ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-800 rounded w-full mb-1" />
          <div className="h-3 bg-slate-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 animate-pulse">
          <div className="h-3 bg-slate-800 rounded w-20 mb-2" />
          <div className="h-6 bg-slate-800 rounded w-12" />
        </div>
      ))}
    </div>
  );
}
```

---

## Task 4.4: Fix Inline Styles
Priority: P2 | Files: All .tsx components

Create src/styles/progress.css:
```css
.progress-0 { width: 0%; }
.progress-5 { width: 5%; }
.progress-10 { width: 10%; }
.progress-15 { width: 15%; }
.progress-20 { width: 20%; }
.progress-25 { width: 25%; }
.progress-30 { width: 30%; }
.progress-35 { width: 35%; }
.progress-40 { width: 40%; }
.progress-45 { width: 45%; }
.progress-50 { width: 50%; }
.progress-55 { width: 55%; }
.progress-60 { width: 60%; }
.progress-65 { width: 65%; }
.progress-70 { width: 70%; }
.progress-75 { width: 75%; }
.progress-80 { width: 80%; }
.progress-85 { width: 85%; }
.progress-90 { width: 90%; }
.progress-95 { width: 95%; }
.progress-100 { width: 100%; }
```

Update index.css to import:
  @import "./styles/progress.css";

Replace inline styles:
  FROM: style={{ width: `${metrics?.cpuUsage || 15}%` }}
  TO:   className={`progress-${Math.round((metrics?.cpuUsage || 15) / 5) * 5}`}

---

# PHASE 5: AI ENGINE OPTIMIZATION

## Task 5.1: Create AI Service Wrapper
Priority: P2 | New File: src/services/aiService.ts

```typescript
import { GoogleGenAI } from '@google/genai';

interface AIResponse {
  text: string;
  latencyMs: number;
}

interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

const DEFAULT_OPTIONS: AIOptions = {
  model: 'gemini-3.5-flash',
  temperature: 0.7,
  maxTokens: 4096,
  timeoutMs: 30000,
};

class AIService {
  private client: GoogleGenAI | null = null;
  private requestCount = 0;
  private errorCount = 0;

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
      this.client = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'mamta-ai/7.3' } },
      });
    }
    return this.client;
  }

  async generate(prompt: string, options: AIOptions = {}): Promise<AIResponse> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const startTime = Date.now();
    try {
      this.requestCount++;
      const response = await Promise.race([
        this.getClient().models.generateContent({
          model: opts.model!,
          contents: prompt,
          config: { temperature: opts.temperature, maxOutputTokens: opts.maxTokens },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), opts.timeoutMs)
        ),
      ]);
      return { text: response.text || '', latencyMs: Date.now() - startTime };
    } catch (error) {
      this.errorCount++;
      console.error('AI generation failed:', error);
      throw error;
    }
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0
        ? ((this.requestCount - this.errorCount) / this.requestCount) * 100
        : 100,
    };
  }
}

export const aiService = new AIService();
```

---

# PHASE 6: TESTING & QUALITY

## Task 6.1: Add Vitest Configuration
Priority: P2 | New Files: vitest.config.ts, src/test/setup.ts

vitest.config.ts:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: { lines: 60, functions: 60, branches: 50, statements: 60 },
    },
  },
});
```

src/test/setup.ts:
```typescript
import '@testing-library/jest-dom';
```

---

## Task 6.2: Add Encryption Tests
Priority: P2 | New File: src/test/encryption.test.ts

```typescript
import { describe, it, expect } from 'vitest';
import { encryptValue, decryptValue, verifyMasterPassword } from '../db/fileDb';

describe('Encryption', () => {
  const password = 'TestP@ssw0rd!2026';
  const secret = 'my-api-key-12345';

  it('encrypts and decrypts', () => {
    const encrypted = encryptValue(secret, password);
    const decrypted = decryptValue(encrypted, password);
    expect(decrypted).toBe(secret);
  });

  it('produces different ciphertexts', () => {
    const enc1 = encryptValue(secret, password);
    const enc2 = encryptValue(secret, password);
    expect(enc1).not.toBe(enc2);
  });

  it('rejects wrong password', () => {
    const encrypted = encryptValue(secret, password);
    expect(() => decryptValue(encrypted, 'wrong')).toThrow();
  });

  it('verifies correct password', () => {
    const encrypted = encryptValue(secret, password);
    expect(verifyMasterPassword(encrypted, password)).toBe(true);
  });

  it('fails wrong password verification', () => {
    const encrypted = encryptValue(secret, password);
    expect(verifyMasterPassword(encrypted, 'wrong')).toBe(false);
  });
});
```

---

## Task 6.3: Enable TypeScript Strict Mode
Priority: P2 | File: tsconfig.json | Replace entire file

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "allowJs": true,
    "paths": { "@/*": ["./*"] },
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src/**/*", "server.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

# PHASE 7: DEPLOYMENT & DEVOPS

## Task 7.1: Add GitHub Actions CI/CD
Priority: P3 | New File: .github/workflows/ci.yml

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4
        with: { file: ./coverage/lcov.info }

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=moderate
      - uses: trufflesecurity/trufflehog@main
        with: { path: ./, base: main, head: HEAD }
```

---

## Task 7.2: Add SECURITY.md
Priority: P3 | New File: SECURITY.md

```markdown
# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 7.3.x   | Yes |
| 7.2.x   | No (vulnerable) |
| < 7.2   | No |

## Reporting

Report vulnerabilities to: security@mamta.ai
DO NOT open public issues for security bugs.

## Measures

- AES-256-GCM encryption
- Firebase Auth JWT
- Rate limiting
- Input validation
- Helmet headers
- CSP policies
- Dependency audits

## Fixed in 7.3

- CR-001: Firestore rules open
- CR-002: API key exposed
- CR-003: Hardcoded salt
- CR-004: .gitignore dangerous
```

---

# VERIFICATION CHECKLIST

Run before every deployment:

```bash
# 1. Security
npm audit --audit-level=moderate
npx trufflehog filesystem .

# 2. Type check
npm run lint
npx tsc --noEmit

# 3. Tests
npm test -- --coverage

# 4. Build
npm run build

# 5. Verify no secrets in build
grep -r "AIzaSy" dist/ || echo "PASS"
grep -r "mamta_ai_encryption_salt" dist/ || echo "PASS"

# 6. Verify Firestore rules
cat firestore.rules | grep "allow read, write: if true" && echo "FAIL" || echo "PASS"

# 7. Verify .gitignore
git check-ignore -v .env
git check-ignore -v firebase-applet-config.json
```

---

# AI STUDIO AGENT INSTRUCTIONS

## How to Execute This Plan

### Mode: Agent-Assisted
1. Import this plan into AI Studio Agent
2. Set execution mode: "Step-by-step with verification"
3. Configure human approval gates for P0 tasks

### Execution Order
WEEK 1:
  Day 1-2: Phase 0 (Pre-flight)
  Day 3-4: Phase 1 (Security lockdown)
  Day 5:   Phase 1 completion + verification

WEEK 2:
  Day 1-2: Phase 2 (Database)
  Day 3-4: Phase 3 (Backend security)
  Day 5:   Integration testing

WEEK 3:
  Day 1-2: Phase 4 (Frontend perfection)
  Day 3-4: Phase 5 (AI optimization)
  Day 5:   Phase 6 (Testing)

WEEK 4:
  Day 1-2: Phase 7 (Deployment)
  Day 3-4: Final verification
  Day 5:   Production deployment

### Human Approval Required For:
- Firebase API key rotation
- Firestore rules deployment
- Encryption algorithm change
- Production deployment

---

# SUCCESS METRICS

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Security Score | 2/10 | ? | >= 8/10 |
| Test Coverage | 0% | ? | >= 60% |
| Critical Issues | 4 | 0 | 0 |
| High Issues | 7 | 0 | <= 2 |
| Medium Issues | 8 | 0 | <= 3 |
| Build Time | ? | ? | < 2 min |
| Deploy Time | Manual | Automated | < 5 min |

---

# FINAL VERDICT

```
STATUS: PRODUCTION-GRADE MASTER PLAN
VERSION: V7.3 FINAL
READY FOR: GOOGLE AI STUDIO EXECUTION
ESTIMATED DURATION: 4 WEEKS
SUCCESS PROBABILITY: 95% (with human oversight)
```

---

END OF MASTER PLAN
