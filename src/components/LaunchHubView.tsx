import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Check, 
  Share2, 
  Users, 
  Award, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Play, 
  FileText, 
  Eye, 
  Edit3, 
  Info, 
  DollarSign, 
  UserPlus, 
  Layers, 
  Target,
  Smartphone,
  Flame,
  Copy,
  Radio,
  Tv,
  Calendar,
  Send,
  Image,
  BarChart2,
  CheckCircle2,
  Loader2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContentEngine } from '../growth/ContentEngine';
import { ViralEngine } from '../growth/ViralEngine';
import { DistributionEngine } from '../growth/DistributionEngine';
import { GrowthAutomation } from '../growth/GrowthAutomation';
import MamtaVoiceStudio from './MamtaVoiceStudio';


interface LaunchHubViewProps {
  sessionId: string;
}

export default function LaunchHubView({ sessionId }: LaunchHubViewProps) {
  // Subscription stats
  const [subscriptionMetrics, setSubscriptionMetrics] = useState<any>({
    planName: 'Free Tier',
    usage: 0,
    limit: 10,
    remaining: 10,
    pricing: 'Free'
  });
  
  // Real-time custom branding inputs for the Landing Page
  const [productName, setProductName] = useState('FinSight OS');
  const [tagline, setTagline] = useState('Build, deploy, and monetize custom micro-SaaS structures with autonomous multi-agent systems.');
  const [isEditingLanding, setIsEditingLanding] = useState(false);
  
  // Viral simulation state
  const [simInvites, setSimInvites] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Marketing metrics simulation
  const [views, setViews] = useState(1280);
  const [signups, setSignups] = useState(184);
  const [upgrades, setUpgrades] = useState(12);
  const [revenue, setRevenue] = useState(5988); // in INR

  // Growth automation engine states
  const [automationTopic, setAutomationTopic] = useState('AI FinTech Agent');
  const [autoContent, setAutoContent] = useState<any>(null);
  const [autoScript, setAutoScript] = useState<string>('');
  const [autoLogs, setAutoLogs] = useState<string[]>([]);
  const [isAutomating, setIsAutomating] = useState(false);
  const [proMarketingResult, setProMarketingResult] = useState<any>(null);
  const [marketingStep, setMarketingStep] = useState<string>('');
  const [isAddingToQueue, setIsAddingToQueue] = useState(false);

  // Real Auto Post Queue States
  const [growthQueue, setGrowthQueue] = useState<any[]>([]);
  const [schedulerLogs, setSchedulerLogs] = useState<any[]>([]);
  const [queueTitle, setQueueTitle] = useState('My AI Product Launch');
  const [queueReel, setQueueReel] = useState('This new app creates full-stack applications in seconds! 😳');
  const [queueCaption, setQueueCaption] = useState('Check out how Mamta AI generates full code and deploys it live in one click. 🚀 Link in bio!');
  const [queueHashtags, setQueueHashtags] = useState('#AI #SaaS #Coding #Startup');
  const [isQueuePosting, setIsQueuePosting] = useState(false);
  const [isTriggeringScheduler, setIsTriggeringScheduler] = useState(false);

  const fetchGrowthQueue = async () => {
    try {
      const res = await fetch('/api/growth/queue');
      const data = await res.json();
      if (data && !data.error) {
        setGrowthQueue(data.queue || []);
        setSchedulerLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch growth queue:', err);
    }
  };

  useEffect(() => {
    fetchGrowthQueue();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchGrowthQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleQueuePost = async () => {
    if (!queueTitle.trim() || !queueReel.trim()) return;
    setIsQueuePosting(true);
    try {
      const res = await fetch('/api/growth/queue-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: queueTitle,
          reel: queueReel,
          caption: queueCaption,
          hashtags: queueHashtags,
          sessionId
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`📥 Successfully added "${queueTitle}" to the automatic posting queue!`);
        // Reset form slightly
        setQueueTitle('Viral Reel Topic');
        setQueueReel('Another amazing tech hook... 🚀');
        await fetchGrowthQueue();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQueuePosting(false);
    }
  };

  const handleTriggerScheduler = async () => {
    setIsTriggeringScheduler(true);
    try {
      const res = await fetch('/api/growth/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      if (data.status === 'dispatched') {
        alert(`🚀 Scheduler Dispatched!\n- Twitter status: Sent\n- YouTube status: Uploaded\n- Instagram: Action Ready!`);
      } else if (data.status === 'empty') {
        alert('ℹ️ Scheduler tick completed. Queue is empty! No posts to send.');
      }
      await fetchGrowthQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggeringScheduler(false);
    }
  };

  const handleClearQueue = async () => {
    if (!confirm('Are you sure you want to clear the automatic posting queue?')) return;
    try {
      await fetch('/api/growth/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      await fetchGrowthQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAutoGrowth = async () => {
    if (!automationTopic.trim()) return;
    setIsAutomating(true);
    setProMarketingResult(null);
    setAutoLogs(["⏳ [SYSTEM] Initializing PRO MAX AI Marketing System...", "🚀 [PIPELINE] Preparing multi-engine generation..."]);
    setMarketingStep('init');

    const addLog = (msg: string) => {
      setAutoLogs(prev => [...prev, msg]);
    };

    try {
      // Step 1: Video Engine
      setTimeout(() => {
        setMarketingStep('video');
        addLog("🎥 [VideoEngine] Analyzing topic parameters & formulating script visual scenes...");
      }, 1000);

      // Step 2: Reel Engine
      setTimeout(() => {
        setMarketingStep('reel');
        addLog("🎬 [ReelEngine] Customizing Reel hooks, caption wording, and social metadata...");
      }, 2500);

      // Step 3: Thumbnail Engine
      setTimeout(() => {
        setMarketingStep('thumb');
        addLog("🖼️ [ThumbnailEngine] Rendering contrast overlays, background gradients, and optimal thumbnail emojis...");
      }, 4000);

      // Step 4: Analytics Brain
      setTimeout(() => {
        setMarketingStep('analytics');
        addLog("📊 [AnalyticsEngine] Auditing current traffic patterns (Views, Signups) & calculating conversion optimization targets...");
      }, 5500);

      // Call Backend API
      const res = await fetch('/api/marketing/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: automationTopic,
          metrics: { views, signups, upgrades, revenue },
          sessionId
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTimeout(() => {
        setMarketingStep('complete');
        addLog("🔁 [AutoMarketing Pipeline] Assembled all modular structures. Campaign is ready!");
        addLog("🚀 [GROWTH MACHINE] Complete PRO MAX automated generation finished! Simulated viral traffic injected.");
        
        setProMarketingResult(data);
        
        // Boost metrics dynamically
        setViews(prev => prev + Math.floor(Math.random() * 450) + 200);
        setSignups(prev => prev + Math.floor(Math.random() * 45) + 15);
        setRevenue(prev => prev + (Math.random() > 0.5 ? 499 : 0));
        
        setIsAutomating(false);
      }, 7000);

    } catch (err: any) {
      addLog("❌ Error during pipeline: " + err.message);
      setIsAutomating(false);
    }
  };

  const handleAddToQueue = async () => {
    if (!proMarketingResult) return;
    setIsAddingToQueue(true);
    try {
      const res = await fetch('/api/growth/queue-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: proMarketingResult.video.title,
          reel: proMarketingResult.video.voiceover,
          caption: proMarketingResult.reel.caption,
          hashtags: proMarketingResult.reel.hashtags,
          sessionId
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Successfully dispatched AI Marketing campaign to live scheduler queue!");
        await fetchGrowthQueue();
      } else {
        alert("Error dispatching post: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsAddingToQueue(false);
    }
  };

  const fetchSubscriptionMetrics = async () => {
    try {
      const res = await fetch(`/api/payments/dashboard?sessionId=${sessionId}`);
      const data = await res.json();
      if (data && !data.error) {
        setSubscriptionMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch subscription details:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptionMetrics();
  }, [sessionId]);

  const handleCreateOrderAndUpgrade = async (planKey: 'pro' | 'premium', amount: number) => {
    try {
      // 1. Create order on the backend (Razorpay SDK)
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, sessionId })
      });
      const order = await orderRes.json();
      if (order.error) throw new Error(order.error);

      // 2. Simulated secure UPI popup gateway validation
      alert(`💸 [Razorpay Gateway] Loaded Order ID: ${order.id}\n- Amount: ₹${amount}\n- Target Plan: ${planKey.toUpperCase()}\n\nClick OK to simulate instant secured UPI checkout...`);

      // 3. Confirm and commit subscription upgrade to state
      const upgradeRes = await fetch('/api/payments/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planKey, amount })
      });
      const upgradeData = await upgradeRes.json();
      if (upgradeData.error) throw new Error(upgradeData.error);

      alert(`🎉 Gateway Success! Account securely upgraded to "${planKey.toUpperCase()}"!`);
      
      // Update simulated marketing telemetry
      setUpgrades(prev => prev + 1);
      setRevenue(prev => prev + amount);

      await fetchSubscriptionMetrics();
    } catch (err: any) {
      alert("Payment Transaction failed: " + err.message);
    }
  };

  const simulateInvite = () => {
    setSimInvites(prev => {
      const newVal = prev + 1;
      if (newVal === 3) {
        // Unlock Pro automatically via Viral Loop Strategy
        triggerViralProUnlock();
      }
      return newVal;
    });
  };

  const triggerViralProUnlock = async () => {
    try {
      const upgradeRes = await fetch('/api/payments/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planKey: 'pro', amount: 0 })
      });
      const upgradeData = await upgradeRes.json();
      if (!upgradeData.error) {
        alert("🔥 [VIRAL LOOP ACTIVATED] Congratulations! You simulated 3 referrals! Mamta AI has unlocked your Pro Tier upgrade completely free of charge! 🚀");
        await fetchSubscriptionMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-6 pb-12 custom-scrollbar pr-1 animate-[fadeIn_0.3s_ease]">
      
      {/* Upper Status Ribbon */}
      <div className="w-full bg-slate-900/30 border border-slate-900 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 flex items-center gap-1 uppercase tracking-wider">
              SaaS Launch Hub
              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">LIVE CONVERSION MODE</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">Current Account Tier: <span className="text-emerald-400 font-bold">{subscriptionMetrics.planName}</span></p>
          </div>
        </div>

        {/* Dynamic Launch Telemetry */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-950/60 p-2 rounded-lg border border-slate-900/40 w-full md:w-auto">
          <div className="text-center px-2">
            <p className="text-[9px] text-slate-500 font-mono">Views</p>
            <p className="text-xs font-bold text-indigo-400">{views}</p>
          </div>
          <div className="text-center px-2 border-x border-slate-900">
            <p className="text-[9px] text-slate-500 font-mono">Signups</p>
            <p className="text-xs font-bold text-emerald-400">{signups}</p>
          </div>
          <div className="text-center px-2">
            <p className="text-[9px] text-slate-500 font-mono">Revenue</p>
            <p className="text-xs font-bold text-amber-400">₹{revenue}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Landing Page Live Sandbox & Builder (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-xl">
            
            {/* Header Controls */}
            <div className="p-4 border-b border-slate-900 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-200">HIGH-CONVERSION LANDING PAGE</h3>
              </div>
              <button 
                onClick={() => setIsEditingLanding(!isEditingLanding)}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isEditingLanding ? <Eye className="w-3 h-3 text-emerald-400" /> : <Edit3 className="w-3 h-3 text-indigo-400" />}
                <span>{isEditingLanding ? 'Preview Live Mockup' : 'Edit Text'}</span>
              </button>
            </div>

            {/* Editable Input Drawer */}
            <AnimatePresence>
              {isEditingLanding && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-950/80 border-b border-slate-900 p-4 space-y-3.5 overflow-hidden"
                >
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1.5">Product / Brand Name</label>
                    <input 
                      type="text" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1.5">Sales Pitch Tagline</label>
                    <textarea 
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Interactive Landing Page Mockup */}
            <div className="p-6 bg-slate-950/90 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
              
              {/* Fake Nav */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-900/40">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 tracking-wider uppercase font-display">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {productName}
                </span>
                <span className="text-[9px] text-slate-500 font-mono uppercase bg-slate-900/60 px-2 py-0.5 rounded">⚡ Demo Page</span>
              </div>

              {/* Hero Section */}
              <div className="text-center py-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider animate-pulse">
                  <Flame className="w-3 h-3 fill-current" /> Launching Globally
                </div>
                
                <h1 className="text-xl md:text-2xl font-black text-slate-100 leading-tight tracking-tight font-display max-w-lg mx-auto">
                  Automate and Deploy Your Vision Instantly
                </h1>
                
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {tagline}
                </p>

                <div className="pt-2 flex justify-center gap-3">
                  <button 
                    onClick={() => {
                      setSignups(prev => prev + 1);
                      alert(`🚀 [Simulation Sign-up] A user just joined through your static CTA on "${productName}"!`);
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/15"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => alert(`🌐 [Demo Player] Launching 90-second automated video presentation...`)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-800 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch Demo</span>
                  </button>
                </div>
              </div>

              {/* Grid Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-slate-900/60">
                <div className="p-3 bg-slate-900/20 rounded-xl border border-slate-900 text-center">
                  <p className="text-[14px] mb-1">💡</p>
                  <h4 className="text-[10px] font-bold text-slate-200 uppercase">Generate Ideas</h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">Brainstorm models with Mamta AI v16.0</p>
                </div>
                <div className="p-3 bg-slate-900/20 rounded-xl border border-slate-900 text-center">
                  <p className="text-[14px] mb-1">🧠</p>
                  <h4 className="text-[10px] font-bold text-slate-200 uppercase">Build Projects</h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">Live modular code in IDE</p>
                </div>
                <div className="p-3 bg-slate-900/20 rounded-xl border border-slate-900 text-center">
                  <p className="text-[14px] mb-1">🚀</p>
                  <h4 className="text-[10px] font-bold text-slate-200 uppercase">Launch Instantly</h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">Automated deployment engine</p>
                </div>
              </div>

            </div>

          </div>

          {/* FIRST 100 USERS STRATEGY WORKBOOK */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">ORGANIC ACQUISITION WORKBOOK</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Achieving your first ₹10,000 in revenue starts with getting highly targeted eyes on your product. Utilize these proven high-engagement launch scripts:
            </p>

            <div className="space-y-3">
              <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider">YT SHORTS / REELS</span>
                <p className="text-[11px] font-semibold text-slate-200 mt-2">"This AI built my complete startup in exactly 60 seconds... 😳"</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1 leading-normal">
                  **Visual Hook:** Show a screen of code building dynamically. Highlight the Razorpay payment pop-up appearing instantly. Direct them to the bio link.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                <span className="text-[8px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider">REDDIT / INDIE HACKERS</span>
                <p className="text-[11px] font-semibold text-slate-200 mt-2">"How I launched an AI-driven FinTech application using Node & Razorpay in 1 weekend."</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1 leading-normal">
                  **Visual Hook:** Write a detailed post detailing building roadblocks, how you integrated simulated webhook gateways, and sharing transparent launch statistics.
                </p>
              </div>
            </div>
          </div>

          {/* 🎙️ MAMTA VOICE AI STUDIO */}
          <MamtaVoiceStudio sessionId={sessionId} />

          {/* 🚀🔥 FULL AUTOMATION AI MARKETING SYSTEM (PRO MAX) */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">AI MARKETING SYSTEM</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  LEVEL: <span className="text-indigo-400 font-extrabold">PRO MAX</span> • GOAL: <span className="text-amber-400 font-extrabold">VIRAL MACHINE 🤯</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[8px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">VIDEO ENGINE</span>
                <span className="text-[8px] bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">REEL ENGINE</span>
                <span className="text-[8px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">THUMBNAIL ENGINE</span>
                <span className="text-[8px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">ANALYTICS BRAIN</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Unleash a multi-engine autonomous viral loop! Provide any topic, and watch our interconnected AI micro-services design clickbaity titles, generate detailed storyboard scenes, formulate engaging caption formats, render coverage suggestions, and audit metrics to output growth optimization strategies.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Campaign Subject / Topic</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={automationTopic}
                    onChange={(e) => setAutomationTopic(e.target.value)}
                    placeholder="e.g. AI SaaS Automation in 1 Week"
                    className="flex-1 bg-slate-950/80 border border-slate-900 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600 font-medium"
                  />
                  <button
                    onClick={handleRunAutoGrowth}
                    disabled={isAutomating || !automationTopic.trim()}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-slate-100 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-lg shadow-indigo-900/10"
                  >
                    {isAutomating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-200" />
                        <span>Running Pro Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Run Pro Max AI Pipeline 🤯</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stepped progress indicators when generating */}
              {isAutomating && (
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-900 grid grid-cols-1 sm:grid-cols-5 gap-3 animate-pulse">
                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${marketingStep === 'video' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'border-transparent text-slate-500'}`}>
                    <Play className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Video Engine</span>
                  </div>
                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${marketingStep === 'reel' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'border-transparent text-slate-500'}`}>
                    <Radio className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Reel Engine</span>
                  </div>
                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${marketingStep === 'thumb' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'border-transparent text-slate-500'}`}>
                    <Image className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Thumbnail</span>
                  </div>
                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${marketingStep === 'analytics' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'border-transparent text-slate-500'}`}>
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Analytics</span>
                  </div>
                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${marketingStep === 'complete' ? 'bg-slate-500/10 border-slate-500/20 text-slate-300' : 'border-transparent text-slate-500'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Pipeline</span>
                  </div>
                </div>
              )}

              {/* Console log of the current operations */}
              {autoLogs.length > 0 && (
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[10px] text-slate-300 space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar shadow-inner">
                  <p className="text-slate-500 text-[8px] border-b border-slate-900 pb-1.5 mb-2 uppercase tracking-widest font-black">PRO MAX CORE TERMINAL LOGS</p>
                  {autoLogs.map((log, idx) => (
                    <p key={idx} className={log.startsWith('❌') ? 'text-rose-400' : log.includes('[VideoEngine]') ? 'text-indigo-400' : log.includes('[ReelEngine]') ? 'text-red-400' : log.includes('[ThumbnailEngine]') ? 'text-emerald-400' : log.includes('[AnalyticsEngine]') ? 'text-amber-400' : 'text-slate-300'}>
                      {log}
                    </p>
                  ))}
                </div>
              )}

              {/* Dynamic Interactive Bento Dashboard Results */}
              {proMarketingResult && (
                <div className="space-y-6 mt-4 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    
                    {/* BENTO CARD 1: 🎥 VIDEO ENGINE OUTPUT */}
                    <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-900 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-indigo-400" />
                          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-300">VIDEO ENGINE</span>
                        </div>
                        <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold text-center">100% COMPILED</span>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Real Vertical Video Preview Player */}
                        <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 aspect-[9/16] max-h-[280px] mx-auto relative group shadow-2xl">
                          <video 
                            src={proMarketingResult.video.videoPath || "/generated_video.mp4"} 
                            controls 
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-wider pointer-events-none">
                            LIVE PREVIEW 🎬
                          </div>
                        </div>

                        <div>
                          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Viral Clickbait Title</p>
                          <h4 className="text-sm font-extrabold text-slate-100 leading-snug mt-0.5">{proMarketingResult.video.title}</h4>
                        </div>

                        <div>
                          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">Storyboard Scene Breakdown</p>
                          <div className="space-y-2">
                            {proMarketingResult.video.scenes.map((scene: string, sIdx: number) => (
                              <div key={sIdx} className="flex gap-2.5 items-start bg-slate-900/40 p-2 rounded border border-slate-900/60">
                                <span className="w-4 h-4 bg-indigo-500/15 text-indigo-300 rounded-full flex items-center justify-center font-mono font-bold text-[9px] mt-0.5 flex-shrink-0">
                                  {sIdx + 1}
                                </span>
                                <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans">{scene}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Energetic Voiceover Narration</p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(proMarketingResult.video.voiceover);
                                alert("Voiceover script copied!");
                              }}
                              className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
                              title="Copy Voiceover"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-lg border border-slate-900 italic mt-1 relative">
                            "{proMarketingResult.video.voiceover}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BENTO CARD 2: 🎬 REEL ENGINE FORMAT */}
                    <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-900 space-y-4 shadow-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <div className="flex items-center gap-2">
                            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-red-300">REEL FORMAT ENGINE</span>
                          </div>
                          <span className="text-[8px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono font-bold uppercase text-center">READY</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Reels Caption Blueprint</p>
                            <p className="text-[11.5px] font-medium text-slate-200 mt-1 whitespace-pre-wrap leading-relaxed bg-slate-900/40 p-3.5 rounded-lg border border-slate-900">
                              {proMarketingResult.reel.caption}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3.5 font-mono">
                            <div className="bg-slate-900/30 p-2.5 rounded border border-slate-900/80">
                              <p className="text-[8px] text-slate-500 uppercase tracking-widest">Video Package</p>
                              <p className="text-[10.5px] font-bold text-slate-300 mt-0.5">{proMarketingResult.reel.video}</p>
                            </div>
                            <div className="bg-slate-900/30 p-2.5 rounded border border-slate-900/80">
                              <p className="text-[8px] text-slate-500 uppercase tracking-widest">Duration</p>
                              <p className="text-[10.5px] font-bold text-amber-400 mt-0.5">{proMarketingResult.reel.duration}</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Optimized Hashtags</p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(proMarketingResult.reel.hashtags);
                                  alert("Hashtags copied!");
                                }}
                                className="text-slate-500 hover:text-slate-300 p-1"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] font-bold text-indigo-400 mt-0.5 font-mono">{proMarketingResult.reel.hashtags}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BENTO CARD 3: 🖼️ THUMBNAIL COVER GRAPHIC VISUAL PREVIEW */}
                    <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-900 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-300">THUMBNAIL ENGINE</span>
                        </div>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase text-center">RENDERED PREVIEW</span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">High-fidelity Thumbnail Layout Design</p>
                        
                        {/* Graphical card showing actual generated gradient and text layout */}
                        <div className={`w-full aspect-[16/9] rounded-xl bg-gradient-to-br ${proMarketingResult.thumb.bg} p-6 flex flex-col justify-between items-start relative overflow-hidden shadow-lg border border-slate-800`}>
                          {/* Ambient light ring */}
                          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                          
                          {/* Bottom banner tag */}
                          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/50 rounded-full px-2.5 py-0.5 text-[8px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                            {proMarketingResult.thumb.style}
                          </div>

                          {/* Thumbnail Heavy Clickbait Text */}
                          <div className="space-y-2 mt-2">
                            <h2 className="text-lg md:text-xl font-black text-white leading-tight uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-tight font-sans max-w-[85%]">
                              {proMarketingResult.thumb.text}
                            </h2>
                            <div className="w-12 h-1 bg-amber-400 rounded-full shadow-lg" />
                          </div>

                          {/* Floating expressional emoji */}
                          <div className="absolute right-4 bottom-4 text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] animate-bounce" style={{ animationDuration: '3s' }}>
                            {proMarketingResult.thumb.emoji}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5 font-mono text-[9px] text-slate-500 pt-1.5">
                          <div>
                            <p className="uppercase tracking-widest font-bold">COVER TEXT:</p>
                            <p className="font-bold text-slate-300 mt-0.5">"{proMarketingResult.thumb.text}"</p>
                          </div>
                          <div>
                            <p className="uppercase tracking-widest font-bold font-semibold">ART STYLE SUGGESTION:</p>
                            <p className="font-bold text-slate-300 mt-0.5">{proMarketingResult.thumb.style}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BENTO CARD 4: 📊 ANALYTICS BRAIN SUGGESTIONS */}
                    <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-900 space-y-4 shadow-xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-amber-400" />
                            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-300">ANALYTICS BRAIN</span>
                          </div>
                          <span className="text-[8px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold uppercase text-center">TELEMETRY DIAGNOSTIC</span>
                        </div>

                        <div className="space-y-3.5 font-mono">
                          <div>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest">Performance Targets Audit</p>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              <div className="bg-slate-900/40 p-2 rounded border border-slate-900/60">
                                <span className="text-[8px] text-slate-500 uppercase">Views</span>
                                <p className="text-xs font-bold text-slate-200 mt-0.5">{views}</p>
                              </div>
                              <div className="bg-slate-900/40 p-2 rounded border border-slate-900/60">
                                <span className="text-[8px] text-slate-500 uppercase">Signups</span>
                                <p className="text-xs font-bold text-slate-200 mt-0.5">{signups}</p>
                              </div>
                              <div className="bg-slate-900/40 p-2 rounded border border-slate-900/60">
                                <span className="text-[8px] text-slate-500 uppercase">Conv Rate</span>
                                <p className="text-xs font-bold text-emerald-400 mt-0.5">{(views > 0 ? ((signups/views)*100).toFixed(1) : 0)}%</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3.5 font-mono">
                            <div className="bg-slate-900/40 p-2.5 rounded border border-slate-900/60">
                              <p className="text-[8px] text-slate-500 uppercase tracking-widest">Optimal Dispatch Target</p>
                              <p className="text-[10.5px] font-bold text-indigo-400 mt-0.5">{proMarketingResult.analysis.bestPlatform}</p>
                            </div>
                            <div className="bg-slate-900/40 p-2.5 rounded border border-slate-900/60">
                              <p className="text-[8px] text-slate-500 uppercase tracking-widest">Optimal Time Window</p>
                              <p className="text-[10.5px] font-bold text-amber-400 mt-0.5">{proMarketingResult.analysis.bestTime}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Custom Growth Hack Proposal</p>
                            <p className="text-[11.5px] font-semibold text-slate-200 mt-1 whitespace-pre-wrap leading-relaxed bg-amber-500/5 p-3.5 rounded-lg border border-amber-500/15">
                              {proMarketingResult.analysis.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* HIGH-FIDELITY ACTION: DISPATCH DIRECTLY TO LIVE SCHEDULER QUEUE */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={handleAddToQueue}
                      disabled={isAddingToQueue}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isAddingToQueue ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Dispatching to Queue...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-slate-950 font-bold" />
                          <span className="text-slate-950 font-extrabold">Send Directly to Live Scheduler Queue 🚀</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* 🔥 MAMTA GROWTH BOT: REAL AUTO-POST QUEUE (PRODUCTION) */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-5 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Mamta Growth Bot</h3>
                  <p className="text-[10px] text-slate-500 font-mono">REAL AUTO POST QUEUE & SCHEDULER</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Active 6h Cron
                </span>
                <button
                  onClick={handleClearQueue}
                  className="text-[10px] text-rose-400 hover:text-rose-300 font-mono font-semibold hover:underline"
                >
                  Clear Queue
                </button>
              </div>
            </div>

            {/* Part A: Add to Queue Form */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-900 space-y-3">
              <h4 className="text-[10.5px] font-bold text-indigo-400 uppercase tracking-wider">Queue New Viral Campaign</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-mono text-slate-400 uppercase mb-1">Campaign Title</label>
                  <input
                    type="text"
                    value={queueTitle}
                    onChange={(e) => setQueueTitle(e.target.value)}
                    placeholder="e.g. Fintech App Live"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-slate-400 uppercase mb-1">Reel / Video Title (Hook)</label>
                  <input
                    type="text"
                    value={queueReel}
                    onChange={(e) => setQueueReel(e.target.value)}
                    placeholder="e.g. This AI is insane..."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-mono text-slate-400 uppercase mb-1">Full Caption / Description</label>
                <textarea
                  value={queueCaption}
                  onChange={(e) => setQueueCaption(e.target.value)}
                  placeholder="The text that goes with the social media posts..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-end justify-between">
                <div className="flex-1 w-full">
                  <label className="block text-[8px] font-mono text-slate-400 uppercase mb-1">Hashtags</label>
                  <input
                    type="text"
                    value={queueHashtags}
                    onChange={(e) => setQueueHashtags(e.target.value)}
                    placeholder="e.g. #AI #SaaS"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 font-mono"
                  />
                </div>
                <button
                  onClick={handleQueuePost}
                  disabled={isQueuePosting || !queueTitle.trim() || !queueReel.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded flex items-center justify-center gap-1.5 cursor-pointer transition-all w-full sm:w-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Queue Campaign</span>
                </button>
              </div>
            </div>

            {/* Part B: Active Queue & Dispatcher */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Queue List (7 columns) */}
              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Current Pending Queue ({growthQueue.length})</span>
                  <span className="text-[9px] text-slate-500 font-mono">Queue remains shifts automatically</span>
                </div>

                {growthQueue.length === 0 ? (
                  <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs font-mono">
                    📭 Auto post queue is empty. Use the generator or form above to schedule posts!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                    {growthQueue.map((post, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-900 rounded-xl p-3 space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                        <div className="flex justify-between items-start pl-1">
                          <div>
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 px-1.5 py-0.2 rounded font-mono font-bold mr-2">Pos #{idx + 1}</span>
                            <span className="text-xs font-bold text-slate-200">{post.title}</span>
                          </div>
                          <span className="text-[8px] text-slate-500 font-mono">{new Date(post.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 pl-1">🎥 "{post.reel}"</p>
                        <p className="text-[9.5px] text-slate-500 line-clamp-1 pl-1 font-mono italic">Caption: {post.caption}</p>
                        <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-900/40 pl-1 gap-2">
                          <span className="text-[9px] text-emerald-400 font-mono">{post.hashtags}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] bg-slate-900 text-slate-400 border border-slate-800 px-1 py-0.2 rounded font-mono font-bold">🐦 Twitter</span>
                            <span className="text-[8px] bg-slate-900 text-slate-400 border border-slate-800 px-1 py-0.2 rounded font-mono font-bold">🎥 YouTube</span>
                            <span className="text-[8px] bg-slate-900 text-slate-400 border border-slate-800 px-1 py-0.2 rounded font-mono font-bold">📸 Instagram</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instant Manual Trigger / Actions (5 columns) */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 space-y-3">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">Scheduler Control</h4>
                  <p className="text-[10.5px] text-slate-500 leading-normal">
                    This cron processes the queue automatically every 6 hours. You can trigger an instant scheduler dispatch tick right now to test the live social pipelines.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={handleTriggerScheduler}
                    disabled={isTriggeringScheduler}
                    className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-slate-100 font-bold text-xs rounded-lg border border-indigo-400/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-500/10"
                  >
                    {isTriggeringScheduler ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
                        <span>Posting to Channels...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                        <span>Instant Dispatch Tick</span>
                      </>
                    )}
                  </button>
                  <p className="text-[8.5px] text-slate-500 font-mono text-center">Auto shifts first queued post and dispatches Twitter + YouTube APIs.</p>
                </div>
              </div>

            </div>

            {/* Part C: Live Scheduler Logs console */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Dispatcher Console logs
              </span>
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-900 font-mono text-[9px] text-slate-300 space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar">
                {schedulerLogs.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start py-0.5 border-b border-slate-900/35 last:border-0">
                    <span className={
                      log.message.includes('❌') ? 'text-rose-400' :
                      log.message.includes('✅') || log.message.includes('success:') ? 'text-emerald-400' :
                      log.message.includes('🚀') ? 'text-amber-300 font-bold' : 'text-slate-300'
                    }>
                      {log.message}
                    </span>
                    <span className="text-slate-600 shrink-0 text-[8px] pl-3">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: PRICING UI & VIRAL LOOP SIMULATOR (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PRICING CONVERSION ENGINE */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">PRICING TIERS</h3>
              </div>
              <span className="text-[9px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-900">₹ INR SUBSCRIPTION</span>
            </div>

            <div className="space-y-3">
              
              {/* Free Tier card */}
              <div className="bg-slate-950/50 border border-slate-900/80 rounded-xl p-3.5 flex items-center justify-between transition-all">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Free Tier</h4>
                  <p className="text-[9px] text-slate-500 font-mono">10 operations / month limit</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-300">₹0</p>
                  <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 rounded uppercase font-mono mt-0.5 inline-block">Active</span>
                </div>
              </div>

              {/* Pro Developer Tier card */}
              <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-between transition-all relative">
                <div className="absolute top-2.5 right-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase">POPULAR</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Pro Developer</h4>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">100 operations / month limit</p>
                  <ul className="space-y-1 my-2.5 text-[9px] text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400" /> Complete Level 10 CEO Decision Engine
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400" /> Auto DevOps Branch Syncer
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 mt-1">
                  <div>
                    <span className="text-md font-extrabold text-slate-100">₹499</span>
                    <span className="text-[9px] text-slate-500 font-mono"> / month</span>
                  </div>
                  <button
                    disabled={subscriptionMetrics.planName === "Pro Developer"}
                    onClick={() => handleCreateOrderAndUpgrade('pro', 499)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/10 disabled:text-emerald-400/50 disabled:border-emerald-500/10 text-slate-950 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    {subscriptionMetrics.planName === "Pro Developer" ? "Active" : "Upgrade"}
                  </button>
                </div>
              </div>

              {/* Enterprise Premium Tier card */}
              <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-4 flex flex-col justify-between transition-all">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Enterprise Premium</h4>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Infinite operations limit</p>
                  <ul className="space-y-1 my-2.5 text-[9px] text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400" /> Infinite autonomous generations
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400" /> Dedicated SLA developer support
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 mt-1">
                  <div>
                    <span className="text-md font-extrabold text-slate-100">₹1,499</span>
                    <span className="text-[9px] text-slate-500 font-mono"> / month</span>
                  </div>
                  <button
                    disabled={subscriptionMetrics.planName === "Enterprise Premium"}
                    onClick={() => handleCreateOrderAndUpgrade('premium', 1499)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/10 disabled:text-emerald-400/50 disabled:border-emerald-500/10 text-slate-950 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    {subscriptionMetrics.planName === "Enterprise Premium" ? "Active" : "Upgrade"}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* VIRAL LOOP SYSTEM (INCENTIVES MULTIPLIER) */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <Share2 className="w-4.5 h-4.5 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">VIRAL REFERRAL LOOP</h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multiply your customer acquisition rate dynamically! Send your unique custom referral link to 3 peers to unlock the **Pro Developer Tier** completely free.
            </p>

            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-900 flex items-center justify-between gap-2.5">
              <span className="text-[9.5px] font-mono text-slate-400 truncate">
                https://mamta-ai.os/invite?ref={sessionId}
              </span>
              <button 
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 cursor-pointer flex items-center justify-center shrink-0"
              >
                {copiedLink ? <span className="text-[8px] font-mono text-emerald-400">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Interactive simulator */}
            <div className="bg-slate-950/40 border border-slate-900/80 rounded-xl p-3.5 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Simulated Invites Registered:</span>
                <span className="font-bold text-emerald-400">{simInvites} / 3</span>
              </div>

              {/* Progress pill indicator */}
              <div className="flex gap-1.5 h-2">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      simInvites >= step ? 'bg-emerald-400 shadow-sm shadow-emerald-400/30' : 'bg-slate-900'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={simulateInvite}
                disabled={simInvites >= 3}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-slate-200 hover:text-slate-100 rounded-lg text-[10px] font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>{simInvites >= 3 ? "Pro Unlocked!" : "Simulate Friend Signup Invite"}</span>
              </button>
            </div>

            <div className="flex items-start gap-2 text-[9px] text-slate-500 leading-normal font-mono">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>When a visitor registers through the invite link, our background database increments your profile's viral loop metrics immediately.</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
