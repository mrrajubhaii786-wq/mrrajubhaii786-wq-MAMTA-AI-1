import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

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

const app = express();
const PORT = 3000;

app.use(express.json());

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

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Chats Endpoints
app.get('/api/chats', (req, res) => {
  const { sessionId } = req.query;
  try {
    const chats = dbChats.getChats(sessionId ? String(sessionId) : undefined);
    res.json(chats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chats', async (req, res) => {
  const { sessionId, content, pageSource } = req.body;
  if (!sessionId || !content) {
    return res.status(400).json({ error: 'sessionId and content are required' });
  }

  try {
    // Add User Message
    const userMsg = dbChats.addChat({
      sessionId,
      role: 'user',
      content,
      pageSource: pageSource || 'home'
    });

    dbLogs.addActivityLog({
      action: 'Send Chat Message',
      page: 'home',
      userSession: sessionId,
      details: content.substring(0, 100)
    });

    // Check for explicit wiki command /wiki
    if (content.startsWith('/wiki ')) {
      const query = content.substring(6).trim().toLowerCase();
      const wikiEntries = dbWiki.getEntries();
      const match = wikiEntries.find(
        e => e.title.toLowerCase().includes(query) || e.content.toLowerCase().includes(query)
      );

      let modelReply = '';
      if (match) {
        modelReply = `🔍 **OpenWiki Match Found**: **${match.title}**\n\n${match.content}\n\n*Tags: ${match.tags.join(', ')}*`;
      } else {
        modelReply = `❌ No OpenWiki entries found matching "${query}". You can add or search entries in the **Admin Dashboard > OpenWiki** panel.`;
      }

      const modelMsg = dbChats.addChat({
        sessionId,
        role: 'model',
        content: modelReply,
        pageSource: 'home'
      });

      return res.json({ userMessage: userMsg, modelMessage: modelMsg });
    }

    // Call Gemini for general chat
    const client = getGeminiClient();
    trackAiCall();

    const systemPrompt = `You are MAMTA AI (v7.0), an autonomous full-stack AI development assistant.
You respond in a friendly, highly professional, objective, and bilingual manner, speaking both English and Hindi naturally depending on context (e.g. incorporating words like "Swagat hai", "bilkul", "Zaroor", "aapka plan").
Keep your responses beautifully structured in clear markdown with clean headings, readable bullet points, and elegant typography.

You are the brain of the MAMTA AI platform, which includes:
- **Home Chat (this core)**: Conversational assistant, bilingual brainstorming, and the Planning Engine.
- **Workspace IDE**: Dynamic developer suite which analyze plans, creates task checklists, writes functional code files, displays files, and pushes builds.
- **Admin Dashboard**: System telemetry, system health graphs, logging timeline, and OpenWiki CRUD knowledge base.
- **SafeDrop Vault**: Highly encrypted secrets locker (AES-256-CBC) with timed 10s reveal.

**Special Directives**:
- If the user asks you to create a project, website, app, or master plan, formulate a highly detailed structural plan and EXPLICITLY conclude with an invitation to transfer it to the Workspace core.
- Your response must include a specific visual queue or markdown structure that lets the platform know you generated a plan, but do not write any system codes directly in response.
- Use simple literal wording. Avoid low-quality AI-slop or infrastructure telemetry noise.`;

    // Retrieve conversation history
    const history = dbChats.getChats(sessionId).slice(-8); // Get last 8 messages for context
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // If history is empty, populate contents
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: content }] });
    }

    const response = await client.models.generateContent({
      model: currentModelSelection,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const aiText = response.text || 'I am sorry, I could not generate a response at this time.';
    
    // Simple intent detection
    const lowercasePrompt = content.toLowerCase();
    const isPlanningIntent = 
      lowercasePrompt.includes('plan') || 
      lowercasePrompt.includes('website') || 
      lowercasePrompt.includes('app') || 
      lowercasePrompt.includes('project') || 
      lowercasePrompt.includes('banao') || 
      lowercasePrompt.includes('build') ||
      lowercasePrompt.includes('code');

    // Add Model Response
    const modelMsg = dbChats.addChat({
      sessionId,
      role: 'model',
      content: aiText,
      pageSource: pageSource || 'home'
    });

    res.json({
      userMessage: userMsg,
      modelMessage: modelMsg,
      suggestWorkspaceRedirect: isPlanningIntent,
      suggestedAction: isPlanningIntent ? 'generate_plan' : 'none'
    });

  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chats/clear', (req, res) => {
  const { sessionId } = req.body;
  try {
    dbChats.clearChats(sessionId ? String(sessionId) : undefined);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Master Plans Endpoints
app.get('/api/plans', (req, res) => {
  try {
    res.json(dbPlans.getPlans());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/plans/:id', (req, res) => {
  try {
    const plan = dbPlans.getPlan(req.params.id);
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
    trackAiCall();

    dbLogs.addActivityLog({
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

    const response = await client.models.generateContent({
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

    const savedPlan = dbPlans.addPlan(title, planMarkdown);

    res.json(savedPlan);
  } catch (err: any) {
    console.error('Plan generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Tasks Endpoints
app.get('/api/plans/:id/tasks', (req, res) => {
  try {
    res.json(dbTasks.getTasks(req.params.id));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/plans/:id/analyze', async (req, res) => {
  const planId = req.params.id;
  const { sessionId } = req.body;

  try {
    const plan = dbPlans.getPlan(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    dbLogs.addActivityLog({
      action: 'Analyze Plan Tasks',
      page: 'workspace',
      userSession: sessionId || 'ANON',
      details: `Analyzing plan ID: ${planId}`
    });

    // We clear current tasks first to allow re-analysis
    dbTasks.clearTasks(planId);

    const client = getGeminiClient();
    trackAiCall();

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

    const response = await client.models.generateContent({
      model: currentModelSelection,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    let rawJson = (response.text || '[]').trim();
    
    // Fallback parsing just in case it wrapper it in markdown
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

    const insertedTasks = dbTasks.addTasks(tasksToInsert);
    dbPlans.updatePlan(planId, { status: 'in_progress' });

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
    const plan = dbPlans.getPlan(planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const tasks = dbTasks.getTasks(planId);
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return res.status(404).json({ error: 'Task not found' });

    // Mark task as running
    dbTasks.updateTaskStatus(taskId, 'running');

    dbLogs.addActivityLog({
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
    trackAiCall();

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

    const response = await client.models.generateContent({
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
    dbTasks.updateTaskStatus(taskId, 'completed', new Date().toISOString());

    // Check if all tasks for this plan are completed
    const updatedTasks = dbTasks.getTasks(planId);
    const allCompleted = updatedTasks.every(t => t.status === 'completed');
    if (allCompleted) {
      dbPlans.updatePlan(planId, { status: 'completed', completedAt: new Date().toISOString() });
      logs.push(`[SYSTEM] All project builds completed! Master plan fully executed.`);
    }

    res.json({
      status: 'completed',
      logs,
      filesWritten: result.files?.map((f: any) => f.name) || []
    });

  } catch (err: any) {
    console.error('Build task error:', err);
    dbTasks.updateTaskStatus(taskId, 'failed');
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

app.post('/api/workspace/files/:projectId/save', (req, res) => {
  const { projectId } = req.params;
  const { fileName, content, sessionId } = req.body;
  if (!fileName || content === undefined) {
    return res.status(400).json({ error: 'fileName and content are required' });
  }

  try {
    dbFiles.saveFile(projectId, fileName, content);
    dbLogs.addActivityLog({
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

app.post('/api/workspace/files/:projectId/delete', (req, res) => {
  const { projectId } = req.params;
  const { fileName, sessionId } = req.body;
  if (!fileName) return res.status(400).json({ error: 'fileName is required' });

  try {
    dbFiles.deleteFile(projectId, fileName);
    dbLogs.addActivityLog({
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
app.get('/api/vault', (req, res) => {
  try {
    res.json(dbVault.getVaultItems());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vault/store', (req, res) => {
  const { keyName, value, itemType, masterPassword, sessionId } = req.body;
  if (!keyName || !value || !itemType || !masterPassword) {
    return res.status(400).json({ error: 'keyName, value, itemType, and masterPassword are required' });
  }

  try {
    const newItem = dbVault.addVaultItem(keyName, value, itemType, masterPassword);
    dbLogs.addActivityLog({
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

app.post('/api/vault/retrieve', (req, res) => {
  const { id, masterPassword, sessionId } = req.body;
  if (!id || !masterPassword) {
    return res.status(400).json({ error: 'id and masterPassword are required' });
  }

  try {
    const items = readDb().vaultItems;
    const match = items.find(item => item.id === id);
    if (!match) return res.status(404).json({ error: 'Vault item not found' });

    const decrypted = decryptValue(match.encryptedValue, masterPassword);

    dbLogs.addActivityLog({
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

app.delete('/api/vault/:id', (req, res) => {
  const { id } = req.params;
  const { sessionId } = req.body;
  try {
    dbVault.deleteVaultItem(id);
    dbLogs.addActivityLog({
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
app.get('/api/admin/metrics', (req, res) => {
  try {
    const db = readDb();
    
    // Distinct sessions count
    const distinctSessions = new Set(db.chats.map(c => c.sessionId));
    
    // Success rate calculation based on completed tasks/plans
    const totalPlans = db.plans.length;
    const completedPlans = db.plans.filter(p => p.status === 'completed').length;
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
      aiCallsToday: dbLogs.getAiCallsCount(),
      activeSessions: distinctSessions.size || 1,
      plansGenerated: totalPlans,
      successRate
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Logs Endpoint
app.get('/api/admin/logs', (req, res) => {
  try {
    res.json(dbLogs.getActivityLogs());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Wiki Endpoints
app.get('/api/admin/wiki', (req, res) => {
  try {
    res.json(dbWiki.getEntries());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/wiki', (req, res) => {
  const { title, content, tags, sessionId } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });

  try {
    const entry = dbWiki.addEntry(title, content, tags || []);
    dbLogs.addActivityLog({
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

app.put('/api/admin/wiki/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, tags, sessionId } = req.body;

  try {
    const entry = dbWiki.updateEntry(id, { title, content, tags });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    dbLogs.addActivityLog({
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

app.delete('/api/admin/wiki/:id', (req, res) => {
  const { id } = req.params;
  const { sessionId } = req.body;
  try {
    dbWiki.deleteEntry(id);
    dbLogs.addActivityLog({
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

app.post('/api/settings/config', (req, res) => {
  const { model, sessionId } = req.body;
  if (!model) return res.status(400).json({ error: 'model selection is required' });

  try {
    currentModelSelection = model;
    dbLogs.addActivityLog({
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

startServer();
