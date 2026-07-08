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
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
