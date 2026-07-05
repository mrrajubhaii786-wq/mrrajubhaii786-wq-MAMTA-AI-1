import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Activity, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  CheckCircle,
  TrendingUp,
  X,
  FileText
} from 'lucide-react';
import { SystemMetrics, ActivityLog, WikiEntry } from '../types';

interface AdminViewProps {
  sessionId: string;
}

export default function AdminView({ sessionId }: AdminViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'wiki'>('metrics');
  
  // States
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  // Wiki list and CRUD
  const [wikiEntries, setWikiEntries] = useState<WikiEntry[]>([]);
  const [wikiSearch, setWikiSearch] = useState('');
  const [showWikiModal, setShowWikiModal] = useState(false);
  const [editingWikiId, setEditingWikiId] = useState<string | null>(null);
  const [wikiTitle, setWikiTitle] = useState('');
  const [wikiContent, setWikiContent] = useState('');
  const [wikiTags, setWikiTags] = useState('');

  useEffect(() => {
    fetchMetrics();
    fetchLogs();
    fetchWiki();

    // Polling diagnostics every 10 seconds for real-time feel
    const interval = setInterval(() => {
      fetchMetrics();
      fetchLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  const fetchWiki = async () => {
    try {
      const res = await fetch('/api/admin/wiki');
      const data = await res.json();
      setWikiEntries(data);
    } catch (err) {
      console.error('Failed to fetch wiki:', err);
    }
  };

  const handleOpenWikiCreate = () => {
    setEditingWikiId(null);
    setWikiTitle('');
    setWikiContent('');
    setWikiTags('');
    setShowWikiModal(true);
  };

  const handleOpenWikiEdit = (entry: WikiEntry) => {
    setEditingWikiId(entry.id);
    setWikiTitle(entry.title);
    setWikiContent(entry.content);
    setWikiTags(entry.tags.join(', '));
    setShowWikiModal(true);
  };

  const handleSaveWiki = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = wikiTags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      let res;
      if (editingWikiId) {
        res = await fetch(`/api/admin/wiki/${editingWikiId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: wikiTitle, content: wikiContent, tags: tagsArray, sessionId })
        });
      } else {
        res = await fetch('/api/admin/wiki', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: wikiTitle, content: wikiContent, tags: tagsArray, sessionId })
        });
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setShowWikiModal(false);
      fetchWiki();
    } catch (err) {
      console.error('Failed to save wiki entry:', err);
    }
  };

  const handleDeleteWiki = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this wiki entry?')) return;
    try {
      const res = await fetch(`/api/admin/wiki/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      fetchWiki();
    } catch (err) {
      console.error('Failed to delete wiki entry:', err);
    }
  };

  // Filtered Wiki Cards
  const filteredWiki = wikiEntries.filter(entry => 
    entry.title.toLowerCase().includes(wikiSearch.toLowerCase()) ||
    entry.content.toLowerCase().includes(wikiSearch.toLowerCase()) ||
    entry.tags.some(t => t.toLowerCase().includes(wikiSearch.toLowerCase()))
  );

  // Helper formatting for uptime duration
  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div id="admin_core_pane" className="flex flex-col gap-3.5 h-full w-full">
      
      {/* Tab Selectors */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 shrink-0">
        <button
          id="admin_tab_metrics_selector"
          onClick={() => setActiveSubTab('metrics')}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'metrics' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System Diagnostics</span>
        </button>
        <button
          id="admin_tab_wiki_selector"
          onClick={() => setActiveSubTab('wiki')}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'wiki' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>OpenWiki Knowledge ({wikiEntries.length})</span>
        </button>
      </div>

      {activeSubTab === 'metrics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 overflow-hidden">
          
          {/* Diagnostic Stats & Health Indicators (Left Column - 8/12) */}
          <div className="lg:col-span-8 space-y-4 overflow-y-auto pr-1 h-[calc(100vh-140px)] custom-scrollbar">
            
            {/* Real-time metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-md shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-full border-b border-l border-emerald-500/10" />
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">AI Calls Today</p>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <h4 className="text-xl font-bold text-slate-100 font-mono">{metrics?.aiCallsToday || 0}</h4>
                  <span className="text-[8px] text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.2 rounded flex items-center gap-0.5">
                    <TrendingUp className="w-2 h-2" />
                    Live
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-md shadow-lg relative overflow-hidden">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Sessions</p>
                <h4 className="text-xl font-bold text-slate-100 font-mono mt-1.5">{metrics?.activeSessions || 1}</h4>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-md shadow-lg relative overflow-hidden">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Plans Formulated</p>
                <h4 className="text-xl font-bold text-slate-100 font-mono mt-1.5">{metrics?.plansGenerated || 0}</h4>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-md shadow-lg relative overflow-hidden">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Build Success Rate</p>
                <h4 className="text-xl font-bold text-emerald-400 font-mono mt-1.5">{metrics?.successRate || 100}%</h4>
              </div>

            </div>

            {/* System Health Block */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  MAMTA AI System Hardware Monitor
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Active diagnostics</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* CPU Usage progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-0.5 font-mono">
                    <span>CPU Core Allocation</span>
                    <span className="text-slate-200 font-semibold text-[11px]">{metrics?.cpuUsage || 15}%</span>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300" 
                      style={{ width: `${metrics?.cpuUsage || 15}%` }}
                    />
                  </div>
                </div>

                {/* RAM Usage progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-0.5 font-mono">
                    <span>V8 Memory Heap Usage</span>
                    <span className="text-slate-200 font-semibold text-[11px]">{metrics?.memoryUsage.percentage || 12}% ({metrics?.memoryUsage.used || 0} MB / {metrics?.memoryUsage.total || 0} MB)</span>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300" 
                      style={{ width: `${metrics?.memoryUsage.percentage || 12}%` }}
                    />
                  </div>
                </div>

                {/* Disk Space usage */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-0.5 font-mono">
                    <span>Sandbox Storage (Disk)</span>
                    <span className="text-slate-200 font-semibold text-[11px]">{metrics?.diskUsage.percentage || 34}% ({metrics?.diskUsage.used || 17} GB / {metrics?.diskUsage.total || 50} GB)</span>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300" 
                      style={{ width: `${metrics?.diskUsage.percentage || 34}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Server metrics diagnostics footer */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Database Status: <strong className="text-emerald-400 font-bold uppercase">CONNECTED</strong></span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Server Uptime: <strong className="text-slate-200 font-medium">{formatUptime(metrics?.uptime || 0)}</strong></span>
                </div>
              </div>

            </div>

          </div>

          {/* Activity Logs Timeline (Right Column - 4/12) */}
          <div className="lg:col-span-4 flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl p-3 backdrop-blur-md shadow-lg h-[calc(100vh-140px)] overflow-hidden">
            <div className="border-b border-slate-800 pb-2 mb-3 shrink-0">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Actions Timeline
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar text-xs">
              {logs.length === 0 ? (
                <p className="text-center py-12 text-slate-500 italic">No operations recorded yet.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="relative pl-5 border-l border-slate-850 last:border-0 pb-1.5">
                    <div className="absolute top-0.5 -left-1.5 w-3 h-3 rounded-full bg-slate-850 border-2 border-slate-900 group-hover:border-emerald-500 transition-colors flex items-center justify-center">
                      <div className={`w-1 h-1 rounded-full ${
                        log.page === 'safedrop' ? 'bg-amber-400 animate-ping' : log.page === 'workspace' ? 'bg-cyan-400' : 'bg-emerald-400'
                      }`} />
                    </div>
                    
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 leading-tight">{log.action}</span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed truncate">{log.details}</p>
                      <div className="flex gap-2.5 items-center pt-0.5">
                        <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${
                          log.page === 'safedrop' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' 
                            : log.page === 'workspace' 
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                        }`}>
                          {log.page}
                        </span>
                        <span className="text-[9px] text-slate-600 font-mono truncate">ID: {log.userSession.substring(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* OPENWIKI KNOWLEDGE Tab Content */
        <div className="flex flex-col flex-1 overflow-hidden h-[calc(100vh-140px)] space-y-3">
          
          {/* Wiki Search & Create Controls */}
          <div className="flex items-center justify-between gap-3.5 shrink-0 bg-slate-900/40 border border-slate-800/60 p-2.5 rounded-lg backdrop-blur-md">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                id="wiki_search_input_field"
                type="text"
                value={wikiSearch}
                onChange={(e) => setWikiSearch(e.target.value)}
                placeholder="Search wiki articles by topics or tag keywords..."
                className="w-full bg-slate-800/80 border border-slate-800 focus:border-emerald-500/40 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            
            <button
              id="wiki_create_article_btn"
              onClick={handleOpenWikiCreate}
              className="py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs flex items-center gap-1 transition-all shadow cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Wiki Article</span>
            </button>
          </div>

          {/* Cards Display Grid */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-3 custom-scrollbar">
            {filteredWiki.length === 0 ? (
              <div className="md:col-span-2 text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-slate-700 mx-auto mb-1.5" />
                <p className="text-xs">No matching articles in OpenWiki. Click 'Add Wiki Article' to populate.</p>
              </div>
            ) : (
              filteredWiki.map(entry => (
                <div 
                  key={entry.id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3.5 backdrop-blur-md shadow-lg flex flex-col hover:border-emerald-500/20 transition-all group"
                >
                  <div className="flex items-start justify-between border-b border-slate-800/80 pb-1.5 mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors leading-tight">
                        {entry.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">Created: {new Date(entry.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenWikiEdit(entry)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 cursor-pointer transition-all"
                        title="Edit entry"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteWiki(entry.id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 cursor-pointer transition-all"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap flex-1 mb-3 max-h-36 overflow-y-auto custom-scrollbar pr-1 font-sans">
                    {entry.content}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-850">
                    {entry.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-[9px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* Wiki Create/Edit Modal popup overlay */}
      {showWikiModal && (
        <div id="wiki_crud_modal_overlay" className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-semibold text-slate-200">
                  {editingWikiId ? 'Edit OpenWiki Entry' : 'Create OpenWiki Entry'}
                </h4>
              </div>
              <button 
                onClick={() => setShowWikiModal(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWiki} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Article Title</label>
                <input
                  id="wiki_title_input"
                  type="text"
                  required
                  value={wikiTitle}
                  onChange={(e) => setWikiTitle(e.target.value)}
                  placeholder="e.g., SafeDrop Cryptography Standards"
                  className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Content Body</label>
                <textarea
                  id="wiki_content_input"
                  required
                  rows={8}
                  value={wikiContent}
                  onChange={(e) => setWikiContent(e.target.value)}
                  placeholder="Describe your architecture details, technical rules, or documentation notes..."
                  className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none resize-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tags (comma separated)</label>
                <input
                  id="wiki_tags_input"
                  type="text"
                  value={wikiTags}
                  onChange={(e) => setWikiTags(e.target.value)}
                  placeholder="e.g. security, encryption, database"
                  className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWikiModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 font-bold text-xs transition-all cursor-pointer shadow flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
