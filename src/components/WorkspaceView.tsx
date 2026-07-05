import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
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
  Bot
} from 'lucide-react';
import { MasterPlan, ProjectTask } from '../types';

interface WorkspaceViewProps {
  sessionId: string;
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
}

export default function WorkspaceView({ sessionId, selectedPlanId, onSelectPlan }: WorkspaceViewProps) {
  // DB & State lists
  const [plans, setPlans] = useState<MasterPlan[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlanId) {
      fetchPlanDetails();
    }
  }, [selectedPlanId]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  };

  const handleReadFile = async (fileName: string) => {
    if (!selectedPlanId) return;
    try {
      const res = await fetch(`/api/workspace/files/${selectedPlanId}/read?fileName=${fileName}`);
      const data = await res.json();
      setSelectedFile(fileName);
      setFileContent(data.content);
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
      addLog(`[SYSTEM] Manually committed custom edits to disk: ${selectedFile}`);
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
    <div id="workspace_core_pane" className="grid grid-cols-1 xl:grid-cols-12 gap-3 h-full w-full">
      
      {/* 1. LEFT SIDEBAR: Plan Task checklist (3 Cols) */}
      <div className="xl:col-span-3 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md shadow-xl h-[calc(100vh-80px)] lg:h-[calc(100vh-50px)] overflow-hidden">
        
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
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500" 
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

            {/* Quick Action Executor Bar */}
            {tasks.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-800 shrink-0">
                <button
                  id="execute_compilation_build_btn"
                  onClick={handleBuildSequential}
                  disabled={isBuilding}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isBuilding ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling Tasks...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-slate-900" />
                      <span>Build Project Codes</span>
                    </>
                  )}
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

      {/* 2. CENTER PIECE: IDE Editor, File Tree & Terminal (6 Cols) */}
      <div className="xl:col-span-6 flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-50px)] space-y-3 overflow-hidden">
        
        {/* Editor & Explorer Split container */}
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
          <div className="md:col-span-9 flex flex-col h-full">
            
            {/* Editor Action Headers */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 shrink-0 bg-slate-950/15">
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

            {/* Dynamic textarea compiler */}
            <div className="flex-1 bg-slate-950/40 p-2.5 font-mono text-xs overflow-hidden">
              <textarea
                id="workspace_file_editor_area"
                value={fileContent}
                onChange={(e) => {
                  setFileContent(e.target.value);
                  setIsEditing(true);
                }}
                disabled={!selectedFile}
                placeholder="// Active source files compiled by your Builder tasks will view or edit here. Choose any file from the explorer on the left or hit 'Build' to generate file assets."
                className="w-full h-full bg-transparent text-slate-300 resize-none focus:outline-none placeholder-slate-600 leading-relaxed custom-scrollbar selection:bg-emerald-500/20 selection:text-emerald-300"
              />
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

        {/* 3. TERMINAL CONSOLE: Live Compiler logs (3 Cols) */}
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
          
          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar leading-relaxed">
            {consoleLogs.map((log, i) => (
              <div 
                key={i} 
                className={`${
                  log.includes('[ERROR]') 
                    ? 'text-rose-400' 
                    : log.includes('[SUCCESS]') 
                    ? 'text-emerald-400 font-semibold' 
                    : log.includes('[AI]')
                    ? 'text-cyan-400'
                    : log.includes('[INFO]')
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

      </div>

      {/* 3. RIGHT PANEL: IDE Conversational Assistant Core (3 Cols) */}
      <div className="xl:col-span-3 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 backdrop-blur-md shadow-xl h-[calc(100vh-80px)] lg:h-[calc(100vh-50px)] overflow-hidden">
        
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3 shrink-0">
          <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Dev Assistant</h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 mb-4 custom-scrollbar text-xs">
          {contextChat.length === 0 ? (
            <div className="text-center py-10 px-2 space-y-3 text-slate-500">
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
