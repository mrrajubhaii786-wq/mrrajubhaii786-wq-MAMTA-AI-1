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
  Rocket,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Shield,
  Zap,
  LogIn,
  LogOut,
  Activity,
  Check,
  ExternalLink,
  Globe,
  Database,
  Code,
  Compass,
  Brain,
  Network,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-views
import HomeView from './components/HomeView';
import WorkspaceView from './components/WorkspaceView';
import AdminView from './components/AdminView';
import SafeDropView from './components/SafeDropView';
import LaunchHubView from './components/LaunchHubView';
import EmpireView from './components/EmpireView';
import CivilizationView from './components/CivilizationView';
import WorldView from './components/WorldView';
import UniverseView from './components/UniverseView';
import MultiverseView from './components/MultiverseView';
import AgiView from './components/AgiView';
import WillView from './components/WillView';
import ErrorBoundary from './components/ErrorBoundary';
import EvolutionView from './components/EvolutionView';
import ConsciousnessView from './components/ConsciousnessView';
import MetaIntelligenceView from './components/MetaIntelligenceView';
import SystemGovernorView from './components/SystemGovernorView';
import UnifiedCoreView from './components/UnifiedCoreView';
import DistributedCoreView from './components/DistributedCoreView';
import GlobalNetworkView from './components/GlobalNetworkView';
import ExecutionLayerView from './components/ExecutionLayerView';
import HumanIntegrationView from './components/HumanIntegrationView';
import EcosystemLayerView from './components/EcosystemLayerView';
import EconomicLayerView from './components/EconomicLayerView';
import { MamtaBrainReal } from './brain/MamtaBrainReal';
import Toast from './components/Toast';
import SaasPlatformView from './components/SaasPlatformView';

export default function App() {
  const [brain] = useState(() => new MamtaBrainReal());
  const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'admin' | 'safedrop' | 'launch' | 'saas' | 'empire' | 'civilization' | 'world' | 'universe' | 'multiverse' | 'agi' | 'will' | 'evolution' | 'consciousness' | 'meta-intelligence' | 'system-governor' | 'unified-core' | 'distributed-core' | 'global-network' | 'execution-layer' | 'human-layer' | 'ecosystem-layer' | 'economic-layer'>('home');
  const [sessionId, setSessionId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('desktop_sidebar_open');
    return saved !== 'false';
  });

  // Hoisted User Auth and Subscription States (Global Home of the User)
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('user_email') || 'rajveersinghm675@gmail.com';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') !== 'false';
  });
  const [subscriptionMetrics, setSubscriptionMetrics] = useState<any>({
    planName: 'Free Tier',
    usage: 0,
    limit: 10,
    remaining: 10,
    pricing: 'Free'
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [isProfileHubOpen, setIsProfileHubOpen] = useState<boolean>(false);
  const [bilingualLanguage, setBilingualLanguage] = useState<'en_hi' | 'hi'>('en_hi');

  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    (window as any).showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
      const event = new CustomEvent('show-toast', { detail: { message, type } });
      window.dispatchEvent(event);
    };

    const handleShowToast = (e: any) => {
      if (e.detail) {
        setToast({
          message: e.detail.message,
          type: e.detail.type || 'error'
        });
      }
    };
    window.addEventListener('show-toast' as any, handleShowToast);
    return () => {
      window.removeEventListener('show-toast' as any, handleShowToast);
      try {
        delete (window as any).showToast;
      } catch (err) {}
    };
  }, []);

  const fetchSubscriptionMetrics = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/payments/dashboard?sessionId=${sessionId}`);
      const data = await res.json();
      if (data && !data.error) {
        setSubscriptionMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch subscription details in App:', err);
    }
  };

  const handleLogin = () => {
    const simulatedEmail = prompt("Enter your email address to log in securely:", userEmail);
    if (simulatedEmail && simulatedEmail.trim()) {
      const trimmed = simulatedEmail.trim();
      setUserEmail(trimmed);
      setIsLoggedIn(true);
      localStorage.setItem('user_email', trimmed);
      localStorage.setItem('is_logged_in', 'true');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('is_logged_in', 'false');
  };

  const handleToggleSidebar = (val: boolean) => {
    setDesktopSidebarOpen(val);
    localStorage.setItem('desktop_sidebar_open', String(val));
  };

  useEffect(() => {
    // Generate or fetch a stable sessionId
    let sid = sessionStorage.getItem('mamta_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('mamta_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchSubscriptionMetrics();
    }
  }, [sessionId]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans select-none antialiased text-slate-200">
      
      {/* Background Decorative Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.06),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.04),transparent_35%)] pointer-events-none" />

      {/* 1. LEFT NAVIGATION SIDEBAR (Desktop) */}
      {desktopSidebarOpen ? (
        <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-slate-900/50 border-r border-slate-900 p-4 backdrop-blur-xl relative z-10 animate-fade-in">
          
          {/* Glowing Logo Block with Collapse Trigger */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-900">
            <div className="flex items-center gap-2.5 overflow-hidden">
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
              <div className="truncate">
                <h1 className="text-xs font-bold tracking-tight text-slate-100 font-display flex items-center gap-1 uppercase truncate">
                  MAMTA AI
                </h1>
                <p className="text-[8px] text-slate-500 font-mono tracking-wider font-semibold truncate">AUTONOMOUS CORE</p>
              </div>
            </div>

            <button
              onClick={() => handleToggleSidebar(false)}
              className="p-1.5 rounded-lg bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-900/60 hover:border-slate-800 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Close Sidebar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
              id="nav_link_saas_platform"
              onClick={() => { setActiveTab('saas'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'saas' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/5 text-cyan-400 border border-cyan-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 shrink-0 text-cyan-400 animate-[pulse_2s_infinite]" />
              <span className="font-bold text-cyan-400">🏆 MAMTA SaaS Startup</span>
            </button>

            <button
              id="nav_link_empire"
              onClick={() => { setActiveTab('empire'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'empire' 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-400 border border-emerald-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>AI Empire Control</span>
            </button>

            <button
              id="nav_link_civilization"
              onClick={() => { setActiveTab('civilization'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'civilization' 
                  ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 text-amber-400 border border-amber-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>AI Civilization OS</span>
            </button>

            <button
              id="nav_link_world"
              onClick={() => { setActiveTab('world'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'world' 
                  ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/5 text-blue-400 border border-blue-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>AI World Simulator</span>
            </button>

            <button
              id="nav_link_universe"
              onClick={() => { setActiveTab('universe'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'universe' 
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5 text-indigo-400 border border-indigo-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0 text-indigo-400 animate-spin" style={{ animationDuration: '30s' }} />
              <span>AI Universe Simulator</span>
            </button>

            <button
              id="nav_link_multiverse"
              onClick={() => { setActiveTab('multiverse'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'multiverse' 
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/5 text-purple-400 border border-purple-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0 text-purple-400 animate-spin" style={{ animationDuration: '60s' }} />
              <span>AI Multiverse AGI</span>
            </button>

            <button
              id="nav_link_agi"
              onClick={() => { setActiveTab('agi'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'agi' 
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5 text-indigo-400 border border-indigo-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Brain className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>AGI Consciousness Core</span>
            </button>

            <button
              id="nav_link_will"
              onClick={() => { setActiveTab('will'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'will' 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-purple-500/5 text-emerald-400 border border-emerald-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Autonomous Will AGI</span>
            </button>

            <button
              id="nav_link_evolution"
              onClick={() => { setActiveTab('evolution'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'evolution' 
                  ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/5 text-teal-400 border border-teal-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-teal-400 animate-pulse" />
              <span>Self-Directed Evolution</span>
            </button>

            <button
              id="nav_link_consciousness"
              onClick={() => { setActiveTab('consciousness'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'consciousness' 
                  ? 'bg-gradient-to-r from-indigo-500/15 to-teal-500/5 text-indigo-400 border border-indigo-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Brain className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>AGI Consciousness Layer</span>
            </button>

            <button
              id="nav_link_meta_intelligence"
              onClick={() => { setActiveTab('meta-intelligence'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'meta-intelligence' 
                  ? 'bg-gradient-to-r from-indigo-500/15 to-teal-500/5 text-indigo-400 border border-indigo-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>AGI Meta-Intelligence</span>
            </button>

            <button
              id="nav_link_system_governor"
              onClick={() => { setActiveTab('system-governor'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'system-governor' 
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/5 text-cyan-400 border border-cyan-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>AGI System Governor</span>
            </button>

            <button
              id="nav_link_unified_core"
              onClick={() => { setActiveTab('unified-core'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'unified-core' 
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-400 border border-cyan-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>AGI Unified Core</span>
            </button>

            <button
              id="nav_link_distributed_core"
              onClick={() => { setActiveTab('distributed-core'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'distributed-core' 
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-400 border border-cyan-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>AGI Distributed Brain</span>
            </button>

            <button
              id="nav_link_global_network"
              onClick={() => { setActiveTab('global-network'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'global-network' 
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-400 border border-cyan-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Network className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>AGI Global Network</span>
            </button>

            <button
              id="nav_link_execution_layer"
              onClick={() => { setActiveTab('execution-layer'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'execution-layer' 
                  ? 'bg-gradient-to-r from-amber-500/15 to-indigo-500/15 text-amber-400 border border-amber-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>AGI Execution Layer</span>
            </button>

            <button
              id="nav_link_human_layer"
              onClick={() => { setActiveTab('human-layer'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'human-layer' 
                  ? 'bg-gradient-to-r from-amber-500/15 to-indigo-500/15 text-amber-400 border border-amber-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Brain className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>AGI Human Layer</span>
            </button>

            <button
              id="nav_link_ecosystem_layer"
              onClick={() => { setActiveTab('ecosystem-layer'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'ecosystem-layer' 
                  ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-400 border border-indigo-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>AGI Ecosystem Layer</span>
            </button>

            <button
              id="nav_link_economic_layer"
              onClick={() => { setActiveTab('economic-layer'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'economic-layer' 
                  ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/15 text-amber-400 border border-amber-500/15 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <Coins className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>AGI Economic Layer</span>
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

          {/* Permanent User Profile Section (The User's Home Hub) */}
          <div className="border-t border-slate-900 pt-3 pb-2 mb-2">
            <button
              onClick={() => setIsProfileHubOpen(true)}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-slate-900/60 hover:border-slate-800 transition-all text-left group cursor-pointer"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-300 group-hover:border-emerald-500/50 transition-colors">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                {isLoggedIn && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950 animate-pulse" />
                )}
              </div>
              <div className="truncate flex-1">
                <p className="text-[10px] font-bold text-slate-200 truncate leading-tight group-hover:text-emerald-400 transition-colors">
                  {isLoggedIn ? userEmail.split('@')[0] : 'Guest User'}
                </p>
                <p className="text-[8px] font-mono text-slate-500 leading-none mt-0.5 truncate uppercase tracking-wider">
                  {isLoggedIn ? 'Verified Core' : 'Guest Account'}
                </p>
              </div>
            </button>
          </div>

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
      ) : null}

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProfileHubOpen(true)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Open Profile Hub"
          >
            <User className="w-4 h-4 text-emerald-400" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
                onClick={() => { setActiveTab('saas'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'saas' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' : 'text-slate-400'
                }`}
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">🏆 MAMTA SaaS Startup</span>
              </button>

              <button
                onClick={() => { setActiveTab('empire'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'empire' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>AI Empire Control</span>
              </button>

              <button
                onClick={() => { setActiveTab('civilization'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'civilization' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'text-slate-400'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>AI Civilization OS</span>
              </button>

              <button
                onClick={() => { setActiveTab('world'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'world' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15' : 'text-slate-400'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>AI World Simulator</span>
              </button>

              <button
                onClick={() => { setActiveTab('universe'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'universe' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' : 'text-slate-400'
                }`}
              >
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '30s' }} />
                <span>AI Universe Simulator</span>
              </button>

              <button
                onClick={() => { setActiveTab('multiverse'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'multiverse' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/15' : 'text-slate-400'
                }`}
              >
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '60s' }} />
                <span>AI Multiverse AGI</span>
              </button>

              <button
                onClick={() => { setActiveTab('agi'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'agi' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' : 'text-slate-400'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>AGI Consciousness Core</span>
              </button>

              <button
                onClick={() => { setActiveTab('will'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'will' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'text-slate-400'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Autonomous Will AGI</span>
              </button>

              <button
                onClick={() => { setActiveTab('evolution'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'evolution' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/15' : 'text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Self-Directed Evolution</span>
              </button>

              <button
                onClick={() => { setActiveTab('consciousness'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'consciousness' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' : 'text-slate-400'
                }`}
              >
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>AGI Consciousness Layer</span>
              </button>

              <button
                onClick={() => { setActiveTab('meta-intelligence'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'meta-intelligence' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' : 'text-slate-400'
                }`}
              >
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>AGI Meta-Intelligence</span>
              </button>

              <button
                onClick={() => { setActiveTab('system-governor'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'system-governor' ? 'bg-[#06b6d4]/10 text-cyan-400 border border-[#06b6d4]/15' : 'text-slate-400'
                }`}
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>AGI System Governor</span>
              </button>

              <button
                onClick={() => { setActiveTab('unified-core'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'unified-core' ? 'bg-[#06b6d4]/10 text-cyan-400 border border-[#06b6d4]/15' : 'text-slate-400'
                }`}
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>AGI Unified Core</span>
              </button>

              <button
                onClick={() => { setActiveTab('distributed-core'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'distributed-core' ? 'bg-[#06b6d4]/10 text-cyan-400 border border-[#06b6d4]/15' : 'text-slate-400'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>AGI Distributed Brain</span>
              </button>

              <button
                onClick={() => { setActiveTab('global-network'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'global-network' ? 'bg-[#06b6d4]/10 text-cyan-400 border border-[#06b6d4]/15' : 'text-slate-400'
                }`}
              >
                <Network className="w-4 h-4 text-cyan-400" />
                <span>AGI Global Network</span>
              </button>

              <button
                onClick={() => { setActiveTab('execution-layer'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'execution-layer' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'text-slate-400'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>AGI Execution Layer</span>
              </button>

              <button
                onClick={() => { setActiveTab('human-layer'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'human-layer' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'text-slate-400'
                }`}
              >
                <Brain className="w-4 h-4 text-amber-400" />
                <span>AGI Human Layer</span>
              </button>

              <button
                onClick={() => { setActiveTab('ecosystem-layer'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'ecosystem-layer' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' : 'text-slate-400'
                }`}
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>AGI Ecosystem Layer</span>
              </button>

              <button
                onClick={() => { setActiveTab('economic-layer'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                  activeTab === 'economic-layer' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'text-slate-400'
                }`}
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>AGI Economic Layer</span>
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

            {/* Mobile Profile Trigger Footer */}
            <div className="border-t border-slate-900 pt-4 mt-auto">
              <button
                onClick={() => { setIsProfileHubOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 leading-tight">
                    {isLoggedIn ? userEmail : 'Guest User'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                    {isLoggedIn ? 'Manage Profile Hub' : 'Click to Log In'}
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CORE VIEW CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col p-2.5 lg:p-3.5 pt-16 lg:pt-3.5 overflow-hidden relative z-10">
        
        {/* Desktop Top Header Bar (Only visible when sidebar is closed) */}
        {!desktopSidebarOpen && (
          <div className="hidden lg:flex items-center justify-between h-12 shrink-0 bg-slate-900/40 border border-slate-800/80 px-4 rounded-xl backdrop-blur-md mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleSidebar(true)}
                className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-all cursor-pointer flex items-center gap-2 group text-xs font-semibold"
                title="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span>Open Menu</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <svg viewBox="0 0 100 100" className="w-5 h-5 animate-[spin_12s_linear_infinite]">
                    <defs>
                      <linearGradient id="logo-grad-mini" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#logo-grad-mini)" strokeWidth="8" strokeDasharray="180 60" />
                    <path d="M50 25 L65 50 L50 75 L35 50 Z" fill="url(#logo-grad-mini)" />
                  </svg>
                </div>
                <span className="text-xs font-bold tracking-wider font-display text-slate-100 uppercase">MAMTA AI</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 text-[10px] text-slate-500 font-mono border-r border-slate-800/80 pr-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Core Operational</span>
              </div>
              <button
                onClick={() => setIsProfileHubOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-850 hover:border-slate-800 transition-all cursor-pointer text-xs font-semibold text-slate-300 hover:text-emerald-400 group"
              >
                <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                  <User className="w-2.5 h-2.5" />
                </div>
                <span>Profile Hub</span>
              </button>
            </div>
          </div>
        )}
        
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
                  isLoggedIn={isLoggedIn}
                  userEmail={userEmail}
                  setIsLoggedIn={setIsLoggedIn}
                  setUserEmail={setUserEmail}
                  subscriptionMetrics={subscriptionMetrics}
                  setSubscriptionMetrics={setSubscriptionMetrics}
                  showUpgradeModal={showUpgradeModal}
                  setShowUpgradeModal={setShowUpgradeModal}
                  fetchSubscriptionMetrics={fetchSubscriptionMetrics}
                  brain={brain}
                />
              )}
              {activeTab === 'workspace' && (
                <WorkspaceView 
                  sessionId={sessionId} 
                  selectedPlanId={selectedPlanId}
                  onSelectPlan={handleSelectPlan}
                  brain={brain}
                  userEmail={userEmail}
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
              {activeTab === 'saas' && (
                <SaasPlatformView sessionId={sessionId} />
              )}
              {activeTab === 'empire' && (
                <EmpireView />
              )}
              {activeTab === 'civilization' && (
                <CivilizationView />
              )}
              {activeTab === 'world' && (
                <WorldView />
              )}
              {activeTab === 'universe' && (
                <UniverseView />
              )}
              {activeTab === 'multiverse' && (
                <MultiverseView />
              )}
              {activeTab === 'agi' && (
                <AgiView />
              )}
              {activeTab === 'will' && (
                <WillView />
              )}
              {activeTab === 'evolution' && (
                <EvolutionView />
              )}
              {activeTab === 'consciousness' && (
                <ConsciousnessView />
              )}
              {activeTab === 'meta-intelligence' && (
                <MetaIntelligenceView />
              )}
              {activeTab === 'system-governor' && (
                <SystemGovernorView />
              )}
              {activeTab === 'unified-core' && (
                <UnifiedCoreView />
              )}
              {activeTab === 'distributed-core' && (
                <DistributedCoreView />
              )}
              {activeTab === 'global-network' && (
                <GlobalNetworkView />
              )}
              {activeTab === 'execution-layer' && (
                <ExecutionLayerView />
              )}
              {activeTab === 'human-layer' && (
                <HumanIntegrationView />
              )}
              {activeTab === 'ecosystem-layer' && (
                <EcosystemLayerView />
              )}
              {activeTab === 'economic-layer' && (
                <EconomicLayerView />
              )}


            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>

      </main>

      {/* 3. MAMTA PROFILE & ACCOUNT HUB MODAL (The User's Core Home) */}
      <AnimatePresence>
        {isProfileHubOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileHubOpen(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden relative z-10 shadow-2xl flex flex-col text-slate-100 font-sans"
            >
              {/* Header with neon styling */}
              <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-900/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 tracking-tight">User Account Hub</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">MAMTA Core Dashboard</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsProfileHubOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                {/* 1. Profile Core Info */}
                <div className="p-5 bg-gradient-to-r from-slate-950/80 to-slate-950/40 border border-slate-800/60 rounded-2xl flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                  
                  {/* Glowing Animated Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500/30 flex items-center justify-center text-slate-300 relative z-10 overflow-hidden shadow-lg shadow-emerald-500/5">
                      <User className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full animate-pulse" />
                    {isLoggedIn && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 z-20" />
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{isLoggedIn ? userEmail : "Guest Session"}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider self-center ${isLoggedIn ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border border-slate-700 text-slate-500'}`}>
                        {isLoggedIn ? 'Verified Core Member' : 'Guest Core'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Session ID: <span className="text-indigo-400">{sessionId}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Welcome back! This is your autonomous command center. Your chats, workspace configurations, and active plans are preserved securely here.
                    </p>
                  </div>
                </div>

                {/* 2. Bandwidth & Active Limits Progress */}
                <div className="p-5 bg-slate-950/30 border border-slate-800/60 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> Subscription Bandwidth
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {subscriptionMetrics.planName}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Monthly Prompt Token Limits:</span>
                      <span className="font-semibold text-slate-200">
                        {subscriptionMetrics.usage} / {subscriptionMetrics.limit === null || subscriptionMetrics.limit === Infinity ? 'Unlimited' : subscriptionMetrics.limit}
                      </span>
                    </div>
                    
                    {/* Progress slider bar */}
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${subscriptionMetrics.limit === Infinity || subscriptionMetrics.limit === null ? 0 : Math.min(100, (subscriptionMetrics.usage / subscriptionMetrics.limit) * 100)}%` 
                        }}
                      />
                    </div>
                    
                    <p className="text-[10px] text-slate-500 font-mono text-right leading-none pt-1">
                      {subscriptionMetrics.limit === Infinity || subscriptionMetrics.limit === null 
                        ? 'Unlimited access active' 
                        : `${Math.max(0, subscriptionMetrics.limit - subscriptionMetrics.usage)} API calls remaining in current period`}
                    </p>
                  </div>
                </div>

                {/* 3. Interactive Stats Grid & System Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Chat Status</span>
                    <span className="text-xs font-bold text-slate-200">Connected</span>
                  </div>

                  <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Database Ingress</span>
                    <span className="text-xs font-bold text-slate-200">Firestore Live</span>
                  </div>

                  <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                    <Code className="w-5 h-5 text-teal-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Workspace IDE</span>
                    <span className="text-xs font-bold text-slate-200">Sandbox Ready</span>
                  </div>
                </div>

                {/* 4. Bilingual Settings Control */}
                <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Preferred System Language</p>
                      <p className="text-[10px] text-slate-500 font-mono">Preferred translation core for outputs</p>
                    </div>
                  </div>
                  <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setBilingualLanguage('en_hi')}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded font-mono uppercase tracking-wider transition-all cursor-pointer ${bilingualLanguage === 'en_hi' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Bilingual
                    </button>
                    <button
                      onClick={() => setBilingualLanguage('hi')}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded font-mono uppercase tracking-wider transition-all cursor-pointer ${bilingualLanguage === 'hi' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Hindi Only
                    </button>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-slate-800/60">
                  {isLoggedIn ? (
                    <button
                      onClick={() => { handleLogout(); setIsProfileHubOpen(false); }}
                      className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out from Core</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { handleLogin(); }}
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In to Secure Profile</span>
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setIsProfileHubOpen(false); setActiveTab('home'); setShowUpgradeModal(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/10 transition-all font-mono"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>UPGRADE PLAN</span>
                    </button>
                    <button
                      onClick={() => setIsProfileHubOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium cursor-pointer transition-all"
                    >
                      Close Hub
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
