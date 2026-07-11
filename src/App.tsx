import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Briefcase, 
  Settings, 
  ShieldAlert, 
  Cpu, 
  Menu, 
  X,
  Bot,
  Terminal,
  Clock,
  Sparkles,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-views
import HomeView from './components/HomeView';
import WorkspaceView from './components/WorkspaceView';
import AdminView from './components/AdminView';
import SafeDropView from './components/SafeDropView';
import LaunchHubView from './components/LaunchHubView';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'admin' | 'safedrop' | 'launch'>('home');
  const [sessionId, setSessionId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Generate or fetch a stable sessionId
    let sid = sessionStorage.getItem('mamta_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('mamta_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans select-none antialiased text-slate-200">
      
      {/* Background Decorative Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.06),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.04),transparent_35%)] pointer-events-none" />

      {/* 1. LEFT NAVIGATION SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-slate-900/50 border-r border-slate-900 p-4 backdrop-blur-xl relative z-10">
        
        {/* Glowing Logo Block */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-900">
          <div className="relative shrink-0">
            <svg viewBox="0 0 100 100" className="w-8 h-8 animate-[spin_12s_linear_infinite]">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="none" stroke="url(#logo-grad)" strokeWidth="8" strokeDasharray="180 60" />
              <path d="M50 25 L65 50 L50 75 L35 50 Z" fill="url(#logo-grad)" />
            </svg>
            <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full -z-10" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-slate-100 font-display flex items-center gap-1 uppercase">
              MAMTA AI
              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded-md lowercase normal-case tracking-normal">v16.0 SaaS</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-wider font-semibold">AUTONOMOUS CORE</p>
          </div>
        </div>

        {/* Navigation core buttons */}
        <nav className="flex-1 py-4 space-y-1.5">
          
          <button
            id="nav_link_home"
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'home' 
                ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/15 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Home Chat</span>
          </button>

          <button
            id="nav_link_workspace"
            onClick={() => { setActiveTab('workspace'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'workspace' 
                ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/15 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span>Workspace IDE</span>
          </button>

          <button
            id="nav_link_launch"
            onClick={() => { setActiveTab('launch'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'launch' 
                ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/15 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 shrink-0" />
            <span>SaaS Launch Hub</span>
          </button>

          <button
            id="nav_link_admin"
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'admin' 
                ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/15 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span>Admin Dashboard</span>
          </button>

          <button
            id="nav_link_safedrop"
            onClick={() => { setActiveTab('safedrop'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'safedrop' 
                ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/15 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
            }`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span>SafeDrop Vault</span>
          </button>

        </nav>

        {/* Sidebar Footer details */}
        <div className="border-t border-slate-900 pt-3 text-[9px] text-slate-600 font-mono space-y-1">
          <div className="flex items-center justify-between">
            <span>Server Mode:</span>
            <span className="text-emerald-400 font-bold uppercase">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Bilingual Core:</span>
            <span className="text-slate-400">English/Hindi</span>
          </div>
        </div>

      </aside>

      {/* MOBILE HEADER (Lg screen hidden) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950/80 border-b border-slate-900 backdrop-blur-md z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-7 h-7">
            <defs>
              <linearGradient id="m-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="none" stroke="url(#m-logo-grad)" strokeWidth="10" strokeDasharray="180 60" />
          </svg>
          <span className="text-sm font-bold tracking-wider font-display text-slate-100 uppercase">MAMTA AI</span>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE NAVIGATION SIDEBAR SLIDEOVER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-950/95 border-r border-slate-900 p-5 z-40 flex flex-col pt-20"
          >
            <nav className="flex-1 space-y-2">
              <button
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'home' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home Chat</span>
              </button>

              <button
                onClick={() => { setActiveTab('workspace'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'workspace' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Workspace IDE</span>
              </button>

              <button
                onClick={() => { setActiveTab('launch'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'launch' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400'
                }`}
              >
                <Rocket className="w-4 h-4" />
                <span>SaaS Launch Hub</span>
              </button>

              <button
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={() => { setActiveTab('safedrop'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'safedrop' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>SafeDrop Vault</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CORE VIEW CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col p-2.5 lg:p-3.5 pt-16 lg:pt-3.5 overflow-hidden relative z-10">
        
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              {activeTab === 'home' && (
                <HomeView 
                  sessionId={sessionId} 
                  onSelectPlan={handleSelectPlan}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'workspace' && (
                <WorkspaceView 
                  sessionId={sessionId} 
                  selectedPlanId={selectedPlanId}
                  onSelectPlan={handleSelectPlan}
                />
              )}
              {activeTab === 'admin' && (
                <AdminView sessionId={sessionId} />
              )}
              {activeTab === 'safedrop' && (
                <SafeDropView sessionId={sessionId} />
              )}
              {activeTab === 'launch' && (
                <LaunchHubView sessionId={sessionId} />
              )}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>

      </main>

    </div>
  );
}
