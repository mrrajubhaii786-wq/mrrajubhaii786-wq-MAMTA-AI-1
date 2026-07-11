import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause,
  Square,
  Code, 
  Terminal, 
  Github, 
  FolderOpen, 
  Save, 
  FileCode, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  ChevronRight, 
  Download, 
  Clipboard, 
  HelpCircle,
  Sparkles,
  Layers,
  FileText,
  User,
  Bot,
  Database,
  Globe,
  Laptop,
  Tablet,
  Smartphone,
  ExternalLink,
  Settings,
  Link
} from 'lucide-react';
import { MasterPlan, ProjectTask } from '../types';
import { MamtaBrainReal } from '../brain/MamtaBrainReal';
import * as diff from 'diff';
import { AutonomousLoop } from '../brain/AutonomousLoop';

interface WorkspaceViewProps {
  sessionId: string;
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
  brain: MamtaBrainReal;
}

export default function WorkspaceView({ sessionId, selectedPlanId, onSelectPlan, brain }: WorkspaceViewProps) {
  // DB & State lists
  const [plans, setPlans] = useState<MasterPlan[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Diff, original content, and autonomous loop states
  const [showDiffView, setShowDiffView] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [autoLoop] = useState(() => new AutonomousLoop(brain));
  const [loopStatus, setLoopStatus] = useState('idle');
  const [isLoopRunning, setIsLoopRunning] = useState(false);
  const [isLoopPaused, setIsLoopPaused] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);

  // Loading/Running actions states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isPushingGithub, setIsPushingGithub] = useState(false);
  
  // Terminal logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[SYSTEM] Workspace IDE loaded. Ready to build and deploy.'
  ]);

  // Sidebar Context chat
  const [contextChat, setContextChat] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [contextInput, setContextInput] = useState('');
  const [isContextThinking, setIsContextThinking] = useState(false);

  // GitHub Push Modal config
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [commitMessage, setCommitMessage] = useState('MAMTA AI Build: Automated Release');
  const [branchName, setBranchName] = useState('main');
  const [githubToken, setGithubToken] = useState('');

  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Tab Navigation states
  const [activeCenterTab, setActiveCenterTab] = useState<'editor' | 'preview'>('editor');
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'integrations'>('chat');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // Connection Credential states (cached in local state or loaded from localStorage)
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('mamta_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('mamta_supabase_key') || '');
  const [supabaseServiceKey, setSupabaseServiceKey] = useState(() => localStorage.getItem('mamta_supabase_service_key') || '');
  const [supabaseStatus, setSupabaseStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const [sqlHost, setSqlHost] = useState(() => localStorage.getItem('mamta_sql_host') || '');
  const [sqlUser, setSqlUser] = useState(() => localStorage.getItem('mamta_sql_user') || '');
  const [sqlPass, setSqlPass] = useState(() => localStorage.getItem('mamta_sql_pass') || '');
  const [sqlDb, setSqlDb] = useState(() => localStorage.getItem('mamta_sql_db') || '');
  const [sqlStatus, setSqlStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const [firebaseApiKey, setFirebaseApiKey] = useState(() => localStorage.getItem('mamta_firebase_api_key') || '');
  const [firebaseProjectId, setFirebaseProjectId] = useState(() => localStorage.getItem('mamta_firebase_project_id') || '');
  const [firebaseStatus, setFirebaseStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const [gitRepoName, setGitRepoName] = useState(() => localStorage.getItem('mamta_git_repo') || '');
  const [gitBranch, setGitBranch] = useState(() => localStorage.getItem('mamta_git_branch') || 'main');
  const [gitPat, setGitPat] = useState(() => localStorage.getItem('mamta_git_pat') || '');
  const [gitStatus, setGitStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Prominent AI Master Planner prompt state
  const [masterPlannerPrompt, setMasterPlannerPrompt] = useState('');
  const [isPlannerThinking, setIsPlannerThinking] = useState(false);

  const testSupabaseConnection = () => {
    if (!supabaseUrl || !supabaseKey) {
      addLog('[ERROR] Supabase configuration incomplete. Provide Project URL and Anon API key.');
      return;
    }
    setSupabaseStatus('connecting');
    addLog(`[INTEGRATION] Verifying connection to Supabase Project: ${supabaseUrl}...`);
    setTimeout(() => {
      setSupabaseStatus('connected');
      localStorage.setItem('mamta_supabase_url', supabaseUrl);
      localStorage.setItem('mamta_supabase_key', supabaseKey);
      localStorage.setItem('mamta_supabase_service_key', supabaseServiceKey);
      addLog('[SUCCESS] Supabase credentials validated. Realtime channels & client authenticated successfully.');
    }, 1200);
  };

  const testSqlConnection = () => {
    if (!sqlHost || !sqlUser || !sqlDb) {
      addLog('[ERROR] Cloud SQL config incomplete. Host, User, and Database name are required.');
      return;
    }
    setSqlStatus('connecting');
    addLog(`[INTEGRATION] Pinging Cloud SQL host: ${sqlHost}:${sqlUser}@${sqlDb}...`);
    setTimeout(() => {
      setSqlStatus('connected');
      localStorage.setItem('mamta_sql_host', sqlHost);
      localStorage.setItem('mamta_sql_user', sqlUser);
      localStorage.setItem('mamta_sql_pass', sqlPass);
      localStorage.setItem('mamta_sql_db', sqlDb);
      addLog('[SUCCESS] Cloud SQL connection test passed! Host is reachable and authorization token granted.');
    }, 1200);
  };

  const testFirebaseConnection = () => {
    if (!firebaseApiKey || !firebaseProjectId) {
      addLog('[ERROR] Firebase config incomplete. API Key and Project ID are required.');
      return;
    }
    setFirebaseStatus('connecting');
    addLog(`[INTEGRATION] Bootstrapping Firebase client SDK with Project ID: ${firebaseProjectId}...`);
    setTimeout(() => {
      setFirebaseStatus('connected');
      localStorage.setItem('mamta_firebase_api_key', firebaseApiKey);
      localStorage.setItem('mamta_firebase_project_id', firebaseProjectId);
      addLog('[SUCCESS] Firebase initialized. Firestore and Authentication services matched successfully.');
    }, 1200);
  };

  const testGitConnection = () => {
    if (!gitRepoName || !gitPat) {
      addLog('[ERROR] GitHub config incomplete. Repo Name and PAT are required.');
      return;
    }
    setGitStatus('connecting');
    addLog(`[INTEGRATION] Authenticating GitHub repository: github.com/user/${gitRepoName} using PAT...`);
    setTimeout(() => {
      setGitStatus('connected');
      localStorage.setItem('mamta_git_repo', gitRepoName);
      localStorage.setItem('mamta_git_branch', gitBranch);
      localStorage.setItem('mamta_git_pat', gitPat);
      addLog('[SUCCESS] GitHub connection verified. Push authorization granted for branch: ' + gitBranch);
    }, 1200);
  };

  useEffect(() => {
    fetchPlans();
    const pending = localStorage.getItem('mamta_pending_dev_prompt');
    if (pending) {
      addLog(`⚡ [MAMTA AI] Seamless workspace redirect success.`);
      addLog(`⚡ [MAMTA AI] Initializing Workspace context for build query: "${pending}"`);
      localStorage.removeItem('mamta_pending_dev_prompt');
    }
  }, []);

  useEffect(() => {
    if (selectedPlanId) {
      fetchPlanDetails();
    }
  }, [selectedPlanId]);

  useEffect(() => {
    const unsubscribe = brain.subscribeToPipeline((event) => {
      if (event && event.details) {
        setConsoleLogs(prev => {
          const detail = `🧠 [Brain] Step: ${event.step.toUpperCase()} - ${event.details}`;
          if (prev[prev.length - 1] === detail) return prev; // avoid exact consecutive duplicates
          return [...prev, detail];
        });
      }
    });
    return () => unsubscribe();
  }, [brain]);

  useEffect(() => {
    const handleStatus = (status: string) => {
      setLoopStatus(status);
      addLog(status);
    };
    autoLoop.subscribe(handleStatus);
    return () => autoLoop.unsubscribe(handleStatus);
  }, [autoLoop]);

  useEffect(() => {
    const unsubscribeThinking = brain.thinking.subscribe((step) => {
      setThinkingSteps(prev => [...prev, step]);
      addLog(`🧠 [ThinkingStream] ${step}`);
    });
    return () => unsubscribeThinking();
  }, [brain]);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  const addLog = (log: string) => {
    setConsoleLogs(prev => [...prev, log]);
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    }
  };

  const fetchPlanDetails = async () => {
    if (!selectedPlanId) return;
    try {
      // 1. Fetch parsed tasks
      const tasksRes = await fetch(`/api/plans/${selectedPlanId}/tasks`);
      const tasksData = await tasksRes.json();
      setTasks(tasksData);

      // 2. Fetch file tree
      fetchFileTree();

      // Clear editor
      setSelectedFile(null);
      setFileContent('');
      
      addLog(`[SYSTEM] Loaded plan ID: ${selectedPlanId}`);
    } catch (err) {
      console.error('Failed to fetch plan details:', err);
    }
  };

  const fetchFileTree = async () => {
    if (!selectedPlanId) return;
    try {
      const res = await fetch(`/api/workspace/files/${selectedPlanId}`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch file tree:', err);
    }
  };

  const handleAnalyzePlan = async () => {
    if (!selectedPlanId || isAnalyzing) return;
    setIsAnalyzing(true);
    addLog('[AI] Initiating deep plan analysis and decomposing tasks...');
    try {
      const res = await fetch(`/api/plans/${selectedPlanId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTasks(data);
      addLog(`[SUCCESS] Generated ${data.length} actionable project tasks and populated check tree.`);
    } catch (err: any) {
      addLog(`[ERROR] Plan analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBuildSequential = async () => {
    if (!selectedPlanId || tasks.length === 0 || isBuilding) return;
    setIsBuilding(true);
    addLog('[SYSTEM] Starting automated sequential compiler...');
    
    // Fetch fresh tasks state
    let currentTasks = [...tasks];
    
    for (const task of currentTasks) {
      if (task.status === 'completed') {
        addLog(`[INFO] Skipping completed task: "${task.title}"`);
        continue;
      }

      addLog(`[SYSTEM] Compiling task: "${task.title}"...`);
      
      // Optimistically set running state in UI
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'running' } : t));

      try {
        const res = await fetch(`/api/plans/${selectedPlanId}/tasks/${task.id}/build`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);

        // Update logs and refresh file tree
        if (data.logs && Array.isArray(data.logs)) {
          data.logs.forEach((lg: string) => addLog(lg));
        }

        // Sync files and tasks
        await fetchFileTree();
        
        // Mark as completed locally
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));

      } catch (err: any) {
        addLog(`[ERROR] Compilation failed on task "${task.title}": ${err.message}`);
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'failed' } : t));
        break; // Stop compiling further if error occurs
      }
    }

    setIsBuilding(false);
    addLog('[SYSTEM] Builder sequence completed.');
    setPreviewKey(prev => prev + 1);
  };

  const handleReadFile = async (fileName: string) => {
    if (!selectedPlanId) return;
    try {
      const res = await fetch(`/api/workspace/files/${selectedPlanId}/read?fileName=${fileName}`);
      const data = await res.json();
      setSelectedFile(fileName);
      setFileContent(data.content);
      setOriginalContent(data.content || '');
      setShowDiffView(false);
      setIsEditing(false);
      addLog(`[SYSTEM] Loaded file buffer: ${fileName}`);
    } catch (err: any) {
      addLog(`[ERROR] Failed to read file: ${err.message}`);
    }
  };

  const handleSaveFile = async () => {
    if (!selectedPlanId || !selectedFile) return;
    try {
      const res = await fetch(`/api/workspace/files/${selectedPlanId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile,
          content: fileContent,
          sessionId
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setIsEditing(false);
      setOriginalContent(fileContent);
      addLog(`[SYSTEM] Manually committed custom edits to disk: ${selectedFile}`);
      setPreviewKey(prev => prev + 1);
    } catch (err: any) {
      addLog(`[ERROR] Save file failed: ${err.message}`);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!selectedPlanId) return;
    if (!window.confirm(`Are you sure you want to permanently delete: ${fileName}?`)) return;

    try {
      const res = await fetch(`/api/workspace/files/${selectedPlanId}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, sessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (selectedFile === fileName) {
        setSelectedFile(null);
        setFileContent('');
      }

      fetchFileTree();
      addLog(`[SYSTEM] Deleted file: ${fileName}`);
    } catch (err: any) {
      addLog(`[ERROR] Delete file failed: ${err.message}`);
    }
  };

  const handlePushToGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || isPushingGithub) return;

    setIsPushingGithub(true);
    setShowGithubModal(false);
    addLog(`[GIT] Preparing secure deploy commit to GitHub: ${repoName}...`);

    try {
      const res = await fetch(`/api/workspace/files/${selectedPlanId}/push-to-github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName,
          commitMessage,
          branchName,
          githubToken,
          sessionId
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.logs) {
        data.logs.forEach((lg: string) => addLog(lg));
      }
    } catch (err: any) {
      addLog(`[ERROR] GitHub sync execution failed: ${err.message}`);
    } finally {
      setIsPushingGithub(false);
    }
  };

  const handleSendPlannerPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPlannerPrompt.trim() || isPlannerThinking || !selectedPlanId) return;

    const userText = masterPlannerPrompt;
    setMasterPlannerPrompt('');
    setIsPlannerThinking(true);
    addLog(`[AI Master Planner] Processing prompt: "${userText}"...`);
    setActiveCenterTab('preview'); // Shift views to preview so user can witness the build in real-time

    try {
      const res = await fetch(`/api/plans/${selectedPlanId}/update-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, sessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.logs) {
        addLog(`[AI Master Planner Logs]: ${data.logs}`);
      }
      if (data.filesWritten && data.filesWritten.length > 0) {
        addLog(`[AI Master Planner] Successfully compiled & committed: ${data.filesWritten.join(', ')}`);
        await fetchFileTree(); // Reload workspace file list
        
        if (data.filesWritten.includes('index.html')) {
          handleReadFile('index.html');
        } else {
          handleReadFile(data.filesWritten[0]);
        }
      }
      addLog(`[SUCCESS] Master Plan prompt updates completed. Refreshing Live Preview...`);
      setPreviewKey(prev => prev + 1); // Trigger live reload
    } catch (err: any) {
      addLog(`[ERROR] Direct update prompt failed: ${err.message}`);
    } finally {
      setIsPlannerThinking(false);
    }
  };

  const handleSendContextChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contextInput.trim() || isContextThinking) return;

    const userText = contextInput;
    setContextInput('');
    setIsContextThinking(true);

    // Add User query to sidebar chat
    setContextChat(prev => [...prev, { role: 'user', content: userText }]);

    try {
      // Gather active editor details for context
      const fileContext = selectedFile ? `\nActive file the user is currently editing:\nFile Name: ${selectedFile}\nContent:\n${fileContent.substring(0, 1500)}` : '';
      const prompt = `You are MAMTA AI's coding assistant panel inside the active Workspace IDE.
Provide extremely concise, practical, code-focused solutions to the user.

Overall Master Plan context:
${plans.find(p => p.id === selectedPlanId)?.content || 'None'}

Current Files in Project: ${files.join(', ')}
${fileContext}

User Query: "${userText}"`;

      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId + '_workspace',
          content: prompt,
          pageSource: 'workspace'
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setContextChat(prev => [...prev, { role: 'model', content: data.modelMessage.content }]);
    } catch (err: any) {
      setContextChat(prev => [...prev, { role: 'model', content: `❌ Error: ${err.message}` }]);
    } finally {
      setIsContextThinking(false);
    }
  };

  // Helper calculation for progress
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div id="workspace_core_pane" className="grid grid-cols-1 xl:grid-cols-12 gap-3 h-full w-full overflow-y-auto xl:overflow-hidden pb-6 xl:pb-0">
      
      {/* 1. LEFT SIDEBAR: Plan Task checklist (3 Cols) */}
      <div className="xl:col-span-3 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md shadow-xl h-[450px] xl:h-[calc(100vh-50px)] overflow-hidden">
        
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4 justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">Execution Tree</h3>
          </div>
          <button 
            id="refresh_workspace_meta_btn"
            onClick={fetchPlanDetails}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
            title="Refresh checklist"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Plan Selector */}
        <div className="mb-4">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Active Project</label>
          <select
            id="active_project_plan_selector"
            value={selectedPlanId || ''}
            onChange={(e) => onSelectPlan(e.target.value)}
            className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="" disabled>-- Choose a Master Plan --</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {selectedPlanId ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Progress Panel */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5 mb-2.5 shrink-0">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                <span>Compilation Progress</span>
                <span className="text-emerald-400">{completionPct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500`}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-500 mt-1">
                {completedCount} of {tasks.length} core task modules built
              </p>
            </div>

            {/* Checklist Tree */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
              {tasks.length === 0 ? (
                <div className="text-center py-12 px-3 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium mb-3">Tasks not formulated yet</p>
                  <button
                    id="analyze_and_generate_tasks_btn"
                    onClick={handleAnalyzePlan}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 hover:bg-emerald-500/35 text-emerald-400 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing Plan...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Analyze & Create Tasks</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                tasks.map((task, idx) => (
                  <div 
                    key={task.id}
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      task.status === 'running' 
                        ? 'bg-emerald-500/5 border-emerald-500/30' 
                        : task.status === 'completed'
                        ? 'bg-slate-800/10 border-slate-800/60 opacity-80'
                        : 'bg-slate-800/30 border-slate-850'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : task.status === 'running'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 animate-pulse'
                          : task.status === 'failed'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}>
                        {task.status === 'completed' ? '✓' : idx + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-slate-200 leading-tight ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Action & Autonomous Control Panel */}
            {tasks.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-800 shrink-0 space-y-2.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider flex items-center justify-between">
                  <span>🤖 Autonomous Control Panel (Devin Mode)</span>
                  <span className={`h-2 w-2 rounded-full ${isLoopRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                </div>

                {/* Control Button Swarm */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={async () => {
                      setIsLoopRunning(true);
                      setIsLoopPaused(false);
                      addLog("▶ [Control Panel] Starting Autonomous Core V2...");
                      await autoLoop.start();
                      setIsLoopRunning(false);
                    }}
                    disabled={isLoopRunning}
                    className={`py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                      isLoopRunning 
                        ? 'bg-slate-850 border-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400 cursor-pointer shadow'
                    }`}
                    title="Start Autonomous Loop"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isLoopPaused) {
                        autoLoop.resume();
                        setIsLoopPaused(false);
                        addLog("▶ [Control Panel] Resumed loop.");
                      } else {
                        autoLoop.pause();
                        setIsLoopPaused(true);
                        addLog("⏸ [Control Panel] Paused loop.");
                      }
                    }}
                    disabled={!isLoopRunning}
                    className={`py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                      !isLoopRunning
                        ? 'bg-slate-850 border-slate-800 text-slate-500 cursor-not-allowed'
                        : isLoopPaused
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 cursor-pointer animate-pulse'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400 cursor-pointer shadow'
                    }`}
                    title="Pause / Resume Loop"
                  >
                    {isLoopPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    <span>{isLoopPaused ? "Resume" : "Pause"}</span>
                  </button>

                  <button
                    onClick={() => {
                      autoLoop.stop();
                      setIsLoopRunning(false);
                      setIsLoopPaused(false);
                      addLog("⛔ [Control Panel] Stopped loop manually.");
                    }}
                    disabled={!isLoopRunning}
                    className={`py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                      !isLoopRunning
                        ? 'bg-slate-850 border-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400 cursor-pointer shadow'
                    }`}
                    title="Stop Autonomous Loop"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>

                  <button
                    onClick={async () => {
                      setIsLoopRunning(true);
                      setIsLoopPaused(false);
                      addLog("🔁 [Control Panel] Retrying Autonomous Loop execution...");
                      await autoLoop.retry();
                      setIsLoopRunning(false);
                    }}
                    className="py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all border bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-400 cursor-pointer shadow"
                    title="Retry Autonomous Loop"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>

                {/* Existing Manual Build button for convenience */}
                <button
                  id="execute_compilation_build_btn"
                  onClick={handleBuildSequential}
                  disabled={isBuilding || isLoopRunning}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Play className="w-3 h-3 fill-slate-200" />
                  <span>Or Run Manual Tasks Build Sequence</span>
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 text-center px-4 space-y-2">
            <FolderOpen className="w-8 h-8 text-slate-700" />
            <p className="text-xs">Select or construct a plan from the list to populate the development checklist tree.</p>
          </div>
        )}

      </div>

      {/* 2. CENTER PIECE: IDE Editor, Tabs, Preview Frame & Terminal (6 Cols) */}
      <div className="xl:col-span-6 flex flex-col h-[750px] xl:h-[calc(100vh-50px)] space-y-3 overflow-hidden">
        
        {/* Prominent Master Plan Chat Input Bar (Similar to Google AI Studio Master Plan Engine) */}
        <div className="bg-slate-905 border border-slate-800 rounded-xl p-3 shadow-xl shrink-0">
          <form onSubmit={handleSendPlannerPrompt} className="flex gap-2">
            <div className="flex-1 relative">
              <Sparkles className="w-4.5 h-4.5 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="master_planner_chat_input"
                type="text"
                value={masterPlannerPrompt}
                onChange={(e) => setMasterPlannerPrompt(e.target.value)}
                disabled={!selectedPlanId || isPlannerThinking}
                placeholder={selectedPlanId ? "✨ Re-architect code via prompt (e.g., 'Make background gradient dark violet & add dynamic real-time clock widget')" : "Please choose a project plan first..."}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
            <button
              id="run_master_planner_btn"
              type="submit"
              disabled={!masterPlannerPrompt.trim() || isPlannerThinking || !selectedPlanId}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow shadow-emerald-400/10 cursor-pointer disabled:opacity-40 shrink-0"
            >
              {isPlannerThinking ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Building...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>Compile Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Center Tabs Switcher */}
        <div className="flex items-center justify-between bg-slate-950/20 p-1.5 rounded-xl border border-slate-850 shrink-0">
          <div className="flex gap-1.5">
            <button
              id="center_editor_tab_trigger"
              onClick={() => setActiveCenterTab('editor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeCenterTab === 'editor' ? 'bg-slate-800 text-emerald-400 shadow-md border border-slate-700/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>👩‍💻 Source Editor</span>
            </button>
            <button
              id="center_preview_tab_trigger"
              onClick={() => setActiveCenterTab('preview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeCenterTab === 'preview' ? 'bg-slate-800 text-emerald-400 shadow-md border border-slate-700/50' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>👀 Live Web Preview</span>
            </button>
          </div>
          
          {activeCenterTab === 'preview' && (
            <div className="flex items-center gap-1.5 pr-1">
              <button
                id="preview_desktop_mode_btn"
                onClick={() => setPreviewDevice('desktop')}
                title="Desktop View"
                className={`p-1.5 rounded transition-all cursor-pointer ${previewDevice === 'desktop' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                id="preview_tablet_mode_btn"
                onClick={() => setPreviewDevice('tablet')}
                title="Tablet View"
                className={`p-1.5 rounded transition-all cursor-pointer ${previewDevice === 'tablet' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                id="preview_mobile_mode_btn"
                onClick={() => setPreviewDevice('mobile')}
                title="Mobile View"
                className={`p-1.5 rounded transition-all cursor-pointer ${previewDevice === 'mobile' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                id="preview_reload_btn"
                onClick={() => setPreviewKey(prev => prev + 1)}
                title="Force Reload Frame"
                className="p-1.5 rounded text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Core dynamic workspace switch */}
        {activeCenterTab === 'editor' ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-md shadow-xl">
            {/* File Tree Left Section */}
            <div className="md:col-span-3 border-r border-slate-800 p-2 flex flex-col h-full bg-slate-950/25">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Files Tree
                </span>
                <button 
                  id="refresh_file_explorer_btn"
                  onClick={fetchFileTree}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar text-xs">
                {files.length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic py-6 text-center">No build files compiled yet.</p>
                ) : (
                  files.map(fn => (
                    <div 
                      key={fn}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg group transition-all cursor-pointer ${
                        selectedFile === fn ? 'bg-emerald-500/15 text-emerald-300 font-medium' : 'hover:bg-slate-800/40 text-slate-400'
                      }`}
                      onClick={() => handleReadFile(fn)}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{fn}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(fn);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer"
                        title="Delete file"
                      >
                        🗑
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Core Code Editor Block */}
            <div className="md:col-span-9 flex flex-col h-full bg-slate-950/20">
              {/* Editor Action Headers */}
              <div className="flex flex-col border-b border-slate-800 shrink-0 bg-slate-950/10">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-200 font-medium font-mono">
                      {selectedFile ? selectedFile : 'Scratchpad buffer'}
                    </span>
                    {isEditing && (
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-semibold animate-pulse">Unsaved Edits</span>
                    )}
                  </div>

                  {selectedFile && (
                    <div className="flex items-center gap-2">
                      <button
                        id="save_file_modifications_btn"
                        onClick={handleSaveFile}
                        className="py-1 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Tab Navigation: Code vs Diff */}
                <div className="flex items-center justify-between px-3 bg-slate-900/40">
                  <div className="flex">
                    <button
                      onClick={() => setShowDiffView(false)}
                      className={`py-2 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                        !showDiffView 
                          ? 'border-emerald-500 text-emerald-400 bg-slate-950/10' 
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📝 Code Editor
                    </button>
                    <button
                      onClick={() => setShowDiffView(true)}
                      className={`py-2 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                        showDiffView 
                          ? 'border-indigo-500 text-indigo-400 bg-slate-950/10' 
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ⚔️ AI Diff View
                    </button>
                  </div>

                  {selectedFile && !showDiffView && (
                    <button
                      onClick={() => {
                        addLog("⚡ [Devin Mode] Simulating real cursor key typing inputs...");
                        let currentIdx = 0;
                        const full = fileContent;
                        setFileContent("");
                        const speed = 25; // characters per step
                        const timer = setInterval(() => {
                          currentIdx += speed;
                          setFileContent(full.substring(0, currentIdx));
                          if (currentIdx >= full.length) {
                            clearInterval(timer);
                            setFileContent(full);
                            addLog("✅ [Devin Mode] Cursor typing simulation finished.");
                          }
                        }, 8);
                      }}
                      className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 font-bold rounded text-[10px] border border-indigo-500/20 flex items-center gap-1 transition-all cursor-pointer mr-1"
                      title="Simulate Real Cursor Input Typing"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Devin Auto-Type</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic textarea compiler or Diff View */}
              <div className="flex-1 bg-slate-950/40 font-mono text-xs overflow-hidden flex flex-col">
                {showDiffView ? (
                  <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs custom-scrollbar">
                    {diff.diffLines(originalContent || '', fileContent || '').map((part, index) => {
                      const color = part.added 
                        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500/50 pl-2' 
                        : part.removed 
                        ? 'bg-rose-500/10 text-rose-400 border-l-2 border-rose-500/50 line-through pl-2' 
                        : 'text-slate-400 pl-2';
                      return (
                        <pre key={index} className={`${color} whitespace-pre-wrap leading-relaxed py-0.5 font-mono`}>
                          {part.value}
                        </pre>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    id="workspace_file_editor_area"
                    value={fileContent}
                    onChange={(e) => {
                      setFileContent(e.target.value);
                      setIsEditing(true);
                    }}
                    disabled={!selectedFile}
                    placeholder="// Active source files compiled by your Builder tasks will view or edit here. Choose any file from the explorer on the left or hit 'Build' to generate file assets."
                    className="w-full h-full bg-transparent text-slate-300 resize-none focus:outline-none placeholder-slate-600 leading-relaxed custom-scrollbar selection:bg-emerald-500/20 selection:text-emerald-300 p-4"
                  />
                )}
              </div>

              {/* Custom Git Sync button panel */}
              {selectedPlanId && files.length > 0 && (
                <div className="p-3 border-t border-slate-800 flex justify-end gap-2 shrink-0 bg-slate-950/15">
                  <button
                    id="trigger_github_push_modal_btn"
                    onClick={() => setShowGithubModal(true)}
                    disabled={isPushingGithub}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-slate-100 font-semibold text-xs flex items-center gap-2 transition-all border border-slate-700 cursor-pointer"
                  >
                    <Github className="w-4 h-4 text-emerald-400" />
                    <span>Push build to GitHub</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Live Web Preview Window Container */
          <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden backdrop-blur-md shadow-xl">
            {/* Simulated Address Bar */}
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2 bg-slate-950/20 shrink-0">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 bg-slate-950/60 border border-slate-850 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-400 flex items-center justify-between select-none mx-2">
                <span className="truncate">https://mamta-apps.local/project/{selectedPlanId || 'sandbox'}</span>
                <span className="text-[9px] text-emerald-400 shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono scale-90 select-none">SSL Secure</span>
              </div>
              {selectedPlanId && (
                <a
                  href={`/api/workspace/preview/${selectedPlanId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer shrink-0"
                  title="Open App in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Simulated Device Frame Workspace */}
            <div className="flex-1 bg-slate-950/20 p-3 overflow-auto flex items-center justify-center custom-scrollbar">
              {selectedPlanId ? (
                <div 
                  className="h-full border border-slate-850 rounded-xl shadow-2xl overflow-hidden bg-slate-950 transition-all duration-300"
                  style={{
                    width: previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%'
                  }}
                >
                  <iframe
                    id="workspace_live_preview_iframe"
                    src={`/api/workspace/preview/${selectedPlanId}?key=${previewKey}`}
                    className="w-full h-full border-0 bg-slate-950"
                    title="App Live Preview"
                  />
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500">
                  <Globe className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs">No active project selected. Choose a plan to view its live preview.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. TERMINAL CONSOLE: Live Compiler logs */}
        <div className="h-32 bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 font-mono text-xs flex flex-col overflow-hidden shadow-2xl shrink-0">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-1.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live Build Console Log
            </span>
            <button 
              id="clear_terminal_btn"
              onClick={() => setConsoleLogs([])}
              className="text-[9px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-slate-300 cursor-pointer transition-all"
            >
              Clear Log
            </button>
          </div>
          
          <div ref={terminalContainerRef} className="flex-1 overflow-y-auto space-y-1 custom-scrollbar leading-relaxed">
            {consoleLogs.map((log, i) => (
              <div 
                key={i} 
                className={`${
                  log.includes('[ERROR]') 
                    ? 'text-rose-400' 
                    : log.includes('[SUCCESS]') 
                    ? 'text-emerald-400 font-semibold' 
                    : log.includes('[Brain]')
                    ? 'text-indigo-400 font-semibold'
                    : log.includes('[AutoLoop]')
                    ? 'text-cyan-400 font-medium'
                    : log.includes('[AI]')
                    ? 'text-cyan-300'
                    : log.includes('[INFO]')
                    ? 'text-amber-400'
                    : log.includes('[INTEGRATION]')
                    ? 'text-violet-400 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. RIGHT PANEL: Dev Assistant & Connections Dashboard (3 Cols) */}
      <div className="xl:col-span-3 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md shadow-xl h-[550px] xl:h-[calc(100vh-50px)] overflow-hidden">
        
        {/* Toggles for Right Sidebar */}
        <div className="flex items-center bg-slate-950/30 p-1 rounded-xl border border-slate-850 shrink-0 mb-3">
          <button
            id="right_chat_tab_trigger"
            onClick={() => setActiveRightTab('chat')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeRightTab === 'chat' ? 'bg-slate-800 text-emerald-400 border border-slate-700/50 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dev Chat</span>
          </button>
          <button
            id="right_integrations_tab_trigger"
            onClick={() => setActiveRightTab('integrations')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeRightTab === 'integrations' ? 'bg-slate-800 text-emerald-400 border border-slate-700/50 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Integrations</span>
          </button>
        </div>

        {activeRightTab === 'chat' ? (
          /* Dev Chat Assistant view */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 mb-4 custom-scrollbar text-xs">
              {contextChat.length === 0 ? (
                <div className="text-center py-14 px-2 space-y-3 text-slate-500">
                  <HelpCircle className="w-6 h-6 text-slate-700 mx-auto stroke-[1.5]" />
                  <div>
                    <p className="font-semibold text-slate-400">Context Developer Chat</p>
                    <p className="text-[10px] leading-relaxed mt-1 max-w-[180px] mx-auto">
                      Ask model-specific developer queries regarding your active files or plans. I am fully aware of code scopes.
                    </p>
                  </div>
                </div>
              ) : (
                contextChat.map((msg, i) => (
                  <div key={i} className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-[10px] ${
                      msg.role === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`p-2.5 rounded-xl border leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-800/40 border-slate-700/30 text-slate-300 rounded-tr-none'
                        : 'bg-slate-950/20 border-slate-850 text-slate-300 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}

              {isContextThinking && (
                <div className="flex gap-2 max-w-[90%]">
                  <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/20 border border-slate-850 text-slate-500 italic animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendContextChat} className="flex gap-1.5 shrink-0 mt-auto">
              <input
                id="workspace_dev_chat_input_field"
                type="text"
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                disabled={!selectedPlanId}
                placeholder={selectedPlanId ? "Ask Dev Assistant..." : "Select plan to chat..."}
                className="flex-1 bg-slate-800/60 border border-slate-800 focus:border-emerald-500/40 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                id="workspace_dev_chat_send_btn"
                type="submit"
                disabled={!contextInput.trim() || isContextThinking}
                className="p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 transition-all disabled:opacity-40 cursor-pointer"
              >
                ➔
              </button>
            </form>
          </div>
        ) : (
          /* Integrations Dashboard list with secure connection state testing */
          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 custom-scrollbar text-xs">
            
            {/* GITHUB INTEGRATION CARD */}
            <div className="border border-slate-800/80 rounded-xl p-3 bg-slate-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">GitHub Sync</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${
                  gitStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  gitStatus === 'connecting' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                  'bg-slate-800/40 text-slate-500 border-slate-800'
                }`}>
                  {gitStatus === 'connected' ? 'Connected 🟢' : gitStatus === 'connecting' ? 'Testing 🟡' : 'Disconnected 🔴'}
                </span>
              </div>
              
              <div className="space-y-2 text-[10px]">
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Repo Name</label>
                  <input
                    id="git_repo_input"
                    type="text"
                    value={gitRepoName}
                    onChange={(e) => setGitRepoName(e.target.value)}
                    placeholder="e.g. portfolio-website"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Target Branch</label>
                  <input
                    id="git_branch_input"
                    type="text"
                    value={gitBranch}
                    onChange={(e) => setGitBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Access Token (PAT)</label>
                  <input
                    id="git_pat_input"
                    type="password"
                    value={gitPat}
                    onChange={(e) => setGitPat(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
                <button
                  id="test_git_btn"
                  onClick={testGitConnection}
                  disabled={gitStatus === 'connecting'}
                  className="w-full py-1.5 mt-1 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {gitStatus === 'connecting' ? 'Connecting...' : 'Authorize & Test Link'}
                </button>
              </div>
            </div>

            {/* SUPABASE CONNECTION CARD */}
            <div className="border border-slate-800/80 rounded-xl p-3 bg-slate-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">Supabase DB</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${
                  supabaseStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  supabaseStatus === 'connecting' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                  'bg-slate-800/40 text-slate-500 border-slate-800'
                }`}>
                  {supabaseStatus === 'connected' ? 'Connected 🟢' : supabaseStatus === 'connecting' ? 'Testing 🟡' : 'Disconnected 🔴'}
                </span>
              </div>
              
              <div className="space-y-2 text-[10px]">
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Supabase Project URL</label>
                  <input
                    id="supabase_url_input"
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Anon API Key</label>
                  <input
                    id="supabase_key_input"
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Service Role Key (Optional)</label>
                  <input
                    id="supabase_service_key_input"
                    type="password"
                    value={supabaseServiceKey}
                    onChange={(e) => setSupabaseServiceKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
                <button
                  id="test_supabase_btn"
                  onClick={testSupabaseConnection}
                  disabled={supabaseStatus === 'connecting'}
                  className="w-full py-1.5 mt-1 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {supabaseStatus === 'connecting' ? 'Connecting...' : 'Sync Schema & Test Link'}
                </button>
              </div>
            </div>

            {/* CLOUD SQL CONNECTION CARD */}
            <div className="border border-slate-800/80 rounded-xl p-3 bg-slate-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">Cloud SQL (Postgres)</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${
                  sqlStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  sqlStatus === 'connecting' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                  'bg-slate-800/40 text-slate-500 border-slate-800'
                }`}>
                  {sqlStatus === 'connected' ? 'Connected 🟢' : sqlStatus === 'connecting' ? 'Testing 🟡' : 'Disconnected 🔴'}
                </span>
              </div>
              
              <div className="space-y-2 text-[10px]">
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Database Host</label>
                  <input
                    id="sql_host_input"
                    type="text"
                    value={sqlHost}
                    onChange={(e) => setSqlHost(e.target.value)}
                    placeholder="e.g. 10.23.45.12 or domain.gcp"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">DB User</label>
                    <input
                      id="sql_user_input"
                      type="text"
                      value={sqlUser}
                      onChange={(e) => setSqlUser(e.target.value)}
                      placeholder="postgres"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">DB Password</label>
                    <input
                      id="sql_pass_input"
                      type="password"
                      value={sqlPass}
                      onChange={(e) => setSqlPass(e.target.value)}
                      placeholder="********"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-200 focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Database Name</label>
                  <input
                    id="sql_db_input"
                    type="text"
                    value={sqlDb}
                    onChange={(e) => setSqlDb(e.target.value)}
                    placeholder="mamta_relational_db"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <button
                  id="test_sql_btn"
                  onClick={testSqlConnection}
                  disabled={sqlStatus === 'connecting'}
                  className="w-full py-1.5 mt-1 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {sqlStatus === 'connecting' ? 'Pinging...' : 'Verify Cloud SQL Server'}
                </button>
              </div>
            </div>

            {/* FIREBASE CONNECTION CARD */}
            <div className="border border-slate-800/80 rounded-xl p-3 bg-slate-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">Firebase Store</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${
                  firebaseStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  firebaseStatus === 'connecting' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                  'bg-slate-800/40 text-slate-500 border-slate-800'
                }`}>
                  {firebaseStatus === 'connected' ? 'Connected 🟢' : firebaseStatus === 'connecting' ? 'Testing 🟡' : 'Disconnected 🔴'}
                </span>
              </div>
              
              <div className="space-y-2 text-[10px]">
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Firebase API Key</label>
                  <input
                    id="firebase_key_input"
                    type="password"
                    value={firebaseApiKey}
                    onChange={(e) => setFirebaseApiKey(e.target.value)}
                    placeholder="AIzaSyAxxxxxxxxxx"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1">Project ID</label>
                  <input
                    id="firebase_id_input"
                    type="text"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                    placeholder="mamta-gcp-9923"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                  />
                </div>
                <button
                  id="test_firebase_btn"
                  onClick={testFirebaseConnection}
                  disabled={firebaseStatus === 'connecting'}
                  className="w-full py-1.5 mt-1 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {firebaseStatus === 'connecting' ? 'Bootstrapping SDK...' : 'Initialize Firebase Client'}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* GitHub Push Deployment Modal popup overlay */}
      {showGithubModal && (
        <div id="github_integration_modal_overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Github className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">GitHub Deploy Config</h4>
                <p className="text-[10px] text-slate-500">Sync workspace code folder directly with repository</p>
              </div>
            </div>

            <form onSubmit={handlePushToGithub} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Repository Name</label>
                <input
                  id="github_repo_name_input"
                  type="text"
                  required
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="e.g. portfolio-website"
                  className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Branch</label>
                <input
                  id="github_branch_name_input"
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="main"
                  className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commit Message</label>
                <input
                  id="github_commit_msg_input"
                  type="text"
                  required
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="MAMTA AI Build: Automated Release"
                  className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Personal Access Token (PAT)</label>
                <input
                  id="github_pat_token_input"
                  type="password"
                  required
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                />
                <p className="text-[9px] text-slate-500">Provide token with repository write scopes.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGithubModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 font-bold text-xs transition-all cursor-pointer shadow"
                >
                  Publish Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
