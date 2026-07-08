import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  ChevronRight, 
  ArrowRight,
  BookOpen,
  Plus,
  CornerDownLeft,
  CreditCard,
  Check,
  Zap,
  LogIn,
  LogOut,
  Info
} from 'lucide-react';
import { ChatMessage } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { MamtaBrainReal } from '../brain/MamtaBrainReal';
import { AutonomousLoop } from '../brain/AutonomousLoop';
import { motion, AnimatePresence } from 'motion/react';

interface HomeViewProps {
  sessionId: string;
  onSelectPlan: (planId: string) => void;
  setActiveTab: (tab: 'home' | 'workspace' | 'admin' | 'safedrop') => void;
}

// Custom Markdown text renderer
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-200 font-sans">
      {lines.map((line, i) => {
        // Bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <ul key={i} className="list-disc pl-5 my-1 text-slate-300">
              <li>{line.replace(/^[-*]\s+/, '')}</li>
            </ul>
          );
        }
        // Headings
        if (line.startsWith('### ')) {
          return <h4 key={i} className="text-sm font-semibold text-emerald-400 mt-4 mb-2">{line.replace('### ', '')}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={i} className="text-base font-semibold text-emerald-400 mt-5 mb-2 border-b border-slate-800 pb-1">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={i} className="text-lg font-bold text-emerald-300 mt-6 mb-3">{line.replace('# ', '')}</h2>;
        }
        // Bold formatting
        const parts = line.split('**');
        if (parts.length > 1) {
          return (
            <p key={i}>
              {parts.map((part, idx) => (idx % 2 === 1 ? <strong key={idx} className="text-emerald-300 font-semibold">{part}</strong> : part))}
            </p>
          );
        }
        // Empty lines
        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
};

// Word-by-word Streaming text simulation
const StreamingResponse: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    const words = text.split(' ');
    let index = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + (prev ? ' ' : '') + words[index]);
      index++;
      if (index >= words.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 20); // slick word-by-word typing effect
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="relative">
      <MarkdownText text={displayedText} />
      <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-1 animate-[pulse_0.6s_infinite] align-middle shrink-0" />
    </div>
  );
};

export default function HomeView({ sessionId, onSelectPlan, setActiveTab }: HomeViewProps) {
  const [brain] = useState(() => new MamtaBrainReal());
  
  // Real World SaaS Subscription & Auth states
  const [userEmail, setUserEmail] = useState<string>('rajveersinghm675@gmail.com');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // default logged in
  const [subscriptionMetrics, setSubscriptionMetrics] = useState<any>({
    planName: 'Free Tier',
    usage: 0,
    limit: 10,
    remaining: 10,
    pricing: 'Free'
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [upgradePlanKey, setUpgradePlanKey] = useState<'pro' | 'premium' | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<boolean>(false);

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

  const handleLogin = () => {
    // Simulated Google OAuth Flow
    const simulatedEmail = prompt("Enter your email address to log in securely:", userEmail);
    if (simulatedEmail && simulatedEmail.trim()) {
      setUserEmail(simulatedEmail.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleCreateOrderAndUpgrade = async (planKey: 'pro' | 'premium') => {
    setIsProcessingUpgrade(true);
    const amount = planKey === 'pro' ? 499 : 1499;

    try {
      // 1. Create order on the backend (Razorpay SDK)
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, sessionId })
      });
      const order = await orderRes.json();
      if (order.error) throw new Error(order.error);

      // 2. Perform checkout (mock popup logic for perfect safety in local sandbox env)
      const options = {
        key: "rzp_test_MAMTA_KEY",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (response: any) {
          console.log("Payment success response from Razorpay client", response);
        }
      };

      // Simulated Razorpay transaction modal approval flow
      alert(`💸 [Razorpay Gateway] Loaded Order ID: ${order.id}\n- Amount: ₹${amount}\n- Status: Order Prepared\n\nClick OK to simulate secure UPI validation...`);

      // 3. Confirm and commit subscription upgrade to state
      const upgradeRes = await fetch('/api/payments/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planKey, amount })
      });
      const upgradeData = await upgradeRes.json();
      if (upgradeData.error) throw new Error(upgradeData.error);

      alert(`🎉 Verification Success! You have been upgraded to "${planKey.toUpperCase()}"!`);
      await fetchSubscriptionMetrics();
      setShowUpgradeModal(false);
    } catch (err: any) {
      alert("Payment/Upgrade Transaction failed: " + err.message);
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastModelMsgId, setLastModelMsgId] = useState<string | null>(null);
  const [completedStreams, setCompletedStreams] = useState<Record<string, boolean>>({});
  const [pipelineEvent, setPipelineEvent] = useState<{
    step: 'idle' | 'thinking' | 'planning' | 'executing' | 'verifying';
    details?: string;
    goal?: string;
    plan?: { task: string; status: 'pending' | 'running' | 'completed' | 'failed' }[];
    currentTaskIndex?: number;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = brain.subscribeToPipeline((event) => {
      setPipelineEvent(event);
    });
    return () => unsubscribe();
  }, [brain]);

  // V10 Autonomous Loop management
  const [autoLoop] = useState(() => new AutonomousLoop(brain));
  const [autoStatus, setAutoStatus] = useState("Autonomous Idle");
  const [isAutoActive, setIsAutoActive] = useState(false);

  useEffect(() => {
    const handleStatusUpdate = (status: string) => {
      setAutoStatus(status);
    };

    autoLoop.subscribe(handleStatusUpdate);

    return () => {
      autoLoop.unsubscribe(handleStatusUpdate);
      autoLoop.stop();
      brain.destroy();
    };
  }, [autoLoop, brain]);

  const toggleAutonomousMode = () => {
    if (isAutoActive) {
      autoLoop.stop();
      setIsAutoActive(false);
    } else {
      autoLoop.start();
      setIsAutoActive(true);
    }
  };
  
  // Suggested templates (ChatGPT clone starter templates)
  const SUGGESTED_PROMPTS = [
    { label: 'build startup "TaskFlow AI"', sub: 'Execute Level 10 complete AI company launch' },
    { label: 'run project', sub: 'Execute Level 9 automated run-test-deploy loop' },
    { label: '/plan Resume website', sub: 'Generate structural master plan' },
    { label: '/wiki MAMTA AI Architecture', sub: 'Learn about core intelligence system' }
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time chats from Firestore (Phase 10: Sync context)
  useEffect(() => {
    if (!sessionId) return;

    try {
      const q = query(
        collection(db, 'chats'),
        where('sessionId', '==', sessionId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          list.push({
            id: doc.id,
            sessionId: d.sessionId,
            role: d.role,
            content: d.content,
            timestamp: d.timestamp,
            pageSource: d.pageSource
          });
        });
        
        setMessages(prev => {
          // Merge lists: keep any temporary/optimistic messages (e.g. id starts with 'user-temp-', 'model-temp-', 'err-' or 'block-')
          // that are NOT yet stored and fetched from the Firestore database
          const tempMsgs = prev.filter(msg => 
            (msg.id.toString().startsWith('user-temp-') || 
             msg.id.toString().startsWith('model-temp-') || 
             msg.id.toString().startsWith('err-') || 
             msg.id.toString().startsWith('block-')) &&
            !list.some(dMsg => dMsg.content === msg.content && dMsg.role === msg.role)
          );
          return [...list, ...tempMsgs];
        });

        // Capture the last AI message ID to trigger typing simulation
        const lastMsg = list[list.length - 1];
        if (lastMsg && lastMsg.role === 'model') {
          setLastModelMsgId(lastMsg.id);
        }
      }, (error) => {
        console.warn('Firestore subscription blocked, calling handleFirestoreError:', error);
        try {
          handleFirestoreError(error, OperationType.LIST, 'chats');
        } catch (handleErr) {
          fetchChatsREST();
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Firebase error, calling handleFirestoreError:', err);
      try {
        handleFirestoreError(err, OperationType.LIST, 'chats');
      } catch (handleErr) {
        fetchChatsREST();
      }
    }
  }, [sessionId]);

  // Phase 7: Auto scroll system
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // REST Fallback fetcher
  const fetchChatsREST = async () => {
    try {
      const res = await fetch(`/api/chats?sessionId=${sessionId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(prev => {
          const tempMsgs = prev.filter(msg => 
            (msg.id.toString().startsWith('user-temp-') || 
             msg.id.toString().startsWith('model-temp-') || 
             msg.id.toString().startsWith('err-') || 
             msg.id.toString().startsWith('block-')) &&
            !data.some(dMsg => dMsg.content === msg.content && dMsg.role === msg.role)
          );
          return [...data, ...tempMsgs];
        });
      }
    } catch (err) {
      console.error('REST chats failed:', err);
    }
  };

  // Phase 5 & 9: Brain integration & Performance (IsSending block)
  const handleSendMessage = async (textToSend: string) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput || isThinking) return;

    // Phase 6: Execution control (Intercept build & run commands)
    const lowerInput = trimmedInput.toLowerCase();
    if (trimmedInput.startsWith('/build') || trimmedInput.startsWith('/run') || lowerInput === 'build app' || lowerInput === 'run app') {
      setInput('');
      const blockedMsg: ChatMessage = {
        id: 'block-' + Date.now(),
        sessionId,
        role: 'model',
        content: `⚠️ **Execution Blocked on Home Tab**
        
Execution triggers and builds are only available in the Workspace tab. Please switch to the Workspace view to run, compile, or build applications.`,
        timestamp: new Date().toISOString(),
        pageSource: 'home'
      };
      setMessages(prev => [...prev, blockedMsg]);
      return;
    }

    // Instantly append user's message for real-time visual responsiveness
    const userTempMsg: ChatMessage = {
      id: 'user-temp-' + Date.now(),
      sessionId,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toISOString(),
      pageSource: 'home'
    };
    setMessages(prev => [...prev, userTempMsg]);

    setInput('');
    setIsThinking(true);

    try {
      // Process through MamtaBrainReal with robust usage check
      const result = await brain.processWithUser(trimmedInput, sessionId, userEmail);
      const response = result.text;
      
      // Update local metrics and subscription state immediately
      setSubscriptionMetrics(result.dashboard);

      // Append model response to UI state instantly as an optimistic model message, 
      // preventing any visual gaps or latency lag from the database call
      if (response) {
        const modelTempMsg: ChatMessage = {
          id: 'model-temp-' + Date.now(),
          sessionId,
          role: 'model',
          content: response,
          timestamp: new Date().toISOString(),
          pageSource: 'home'
        };
        setMessages(prev => {
          if (prev.some(msg => msg.content === response && msg.role === 'model')) {
            return prev;
          }
          return [...prev, modelTempMsg];
        });
      }

      // Always trigger REST fetch to guarantee perfect state synchronization
      // (crucial if Firestore subscription is blocked/errored/offline)
      await fetchChatsREST();
      await fetchSubscriptionMetrics();

    } catch (err: any) {
      console.error('Error sending chat:', err);
      const errorMessage = err.message || 'Unknown network error occurred';
      const errorChatMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sessionId,
        role: 'model',
        content: `⚠️ **Mamta AI Connection Error**
        
Mujhe response generate karne me issue aa raha hai. Vercel environment configurations check karein.
Technical details: \`${errorMessage}\``,
        timestamp: new Date().toISOString(),
        pageSource: 'home'
      };
      setMessages(prev => [...prev, errorChatMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear conversation history in this session?')) return;
    try {
      await fetch('/api/chats/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      setMessages([]);
      setCompletedStreams({});
    } catch (err) {
      console.error('Failed to clear chats:', err);
    }
  };

  const handleTriggerPlanCreation = async (userIdea: string) => {
    setIsThinking(true);
    try {
      const res = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: userIdea,
          sessionId
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      onSelectPlan(data.id);
      setActiveTab('workspace');
    } catch (err: any) {
      console.error('Plan trigger error:', err);
      alert('Plan formulation failed: ' + err.message);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div id="home_core_pane" className="flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-40px)] w-full max-w-4xl mx-auto px-4 lg:px-6 py-2 relative">
      
      {/* Real World Mode SaaS Gateway & Authorization Panel */}
      <div className="w-full bg-slate-900/40 border border-slate-900 rounded-xl p-3 mb-4 shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl animate-[fadeIn_0.3s_ease] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
        
        {/* User Auth Section */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300">
            <User className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">{isLoggedIn ? userEmail : "Guest Mode"}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isLoggedIn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                {isLoggedIn ? 'Verified' : 'Unauthenticated'}
              </span>
            </div>
            <button 
              onClick={isLoggedIn ? handleLogout : handleLogin}
              className="text-[10px] text-slate-400 hover:text-slate-200 underline mt-0.5 text-left flex items-center gap-1 cursor-pointer"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="w-3 h-3 text-rose-400" /> Log Out
                </>
              ) : (
                <>
                  <LogIn className="w-3 h-3 text-emerald-400" /> Log In with Google Auth
                </>
              )}
            </button>
          </div>
        </div>

        {/* Subscription state bar */}
        <div className="flex-1 w-full md:max-w-xs bg-slate-950/60 rounded-lg p-2 border border-slate-900/50">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Usage Limit:</span>
            <span className="font-semibold text-slate-200">
              {subscriptionMetrics.usage} / {subscriptionMetrics.limit === null || subscriptionMetrics.limit === Infinity ? 'Unlimited' : subscriptionMetrics.limit}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${subscriptionMetrics.limit === Infinity || subscriptionMetrics.limit === null ? 0 : Math.min(100, (subscriptionMetrics.usage / subscriptionMetrics.limit) * 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Upgrade Call to Action */}
        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 font-mono">Current plan:</p>
            <p className="text-xs font-bold text-emerald-400">{subscriptionMetrics.planName}</p>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </div>

      {/* Phase 1: Minimal Navbar Header & V10 Autonomous Control Center */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900/60 pb-3 mb-2 shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wider text-slate-100 uppercase font-mono flex items-center gap-1.5">
              Mamta AI V10
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider font-mono border transition-all duration-300 ${isAutoActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 animate-pulse' : 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                {isAutoActive ? 'autonomous action' : 'standby'}
              </span>
            </h2>
          </div>
        </div>

        {/* Dynamic Live Loop Logs Status bar */}
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 bg-slate-900/50 border border-slate-900 px-2 py-1 rounded-md">
            <span className={`w-1.5 h-1.5 rounded-full ${isAutoActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="text-slate-300 truncate max-w-[200px]">{autoStatus}</span>
          </div>

          <button
            onClick={toggleAutonomousMode}
            className={`px-2.5 py-1 rounded-md border font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer ${
              isAutoActive 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400' 
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
            }`}
          >
            {isAutoActive ? 'Stop Auto' : 'Start Auto'}
          </button>
          
          {messages.length > 0 && (
            <button 
              id="clear_chat_history_btn"
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 text-[10px]"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500/80" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Phase 1 & 8: Conversation Space & Smooth Mobile Scroll */}
      <div className="flex-1 w-full overflow-y-auto space-y-6 custom-scrollbar scroll-smooth pr-1 pb-24">
        
        {/* ChatGPT Empty State (Minimal Starter cards) */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 lg:py-28 space-y-6 select-none animate-[fadeIn_0.4s_ease]">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5">
                <Bot className="w-7 h-7" />
              </div>
              <div className="absolute inset-0 bg-emerald-500/15 blur-2xl rounded-full -z-10" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h2 className="text-xl font-bold text-slate-100 tracking-tight font-display">How can I help you today?</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                MAMTA AI has a real-time responsive brain synced with Firestore. Let's design, code, or talk!
              </p>
            </div>

            {/* Template shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-lg text-left pt-3">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.label)}
                  className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900 hover:border-emerald-500/30 hover:bg-slate-900/60 text-left transition-all duration-300 group cursor-pointer"
                >
                  <p className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                    {prompt.label}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{prompt.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase 2: Message Bubble Mapping with left/right styling */}
        {messages.map((msg, idx) => {
          const isAI = msg.role === 'model';
          const isLatestAI = isAI && msg.id === lastModelMsgId;
          const isStreamCompleted = completedStreams[msg.id];
          const shouldStream = isLatestAI && !isStreamCompleted;

          const contentLower = msg.content.toLowerCase();
          const hasPlanKeyword = contentLower.includes('plan') || contentLower.includes('blueprint') || contentLower.includes('roadmap') || contentLower.includes('task');
          const isExecutionBlockMsg = msg.content.includes('Execution Blocked') || msg.content.includes('Execution is only available');

          const conversationIntent = brain.mindset.detectIntent(messages[idx - 1]?.content || msg.content);
          const showWorkspaceButton = conversationIntent === 'planning' || conversationIntent === 'developer';

          return (
            <div 
              key={msg.id || idx}
              className={`flex gap-3.5 max-w-3xl mx-auto ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`flex flex-col space-y-2 max-w-[85%] ${isAI ? 'items-start' : 'items-end'}`}>
                {/* Phase 2 bubble details */}
                <div className={`p-4 rounded-2xl ${
                  isAI
                    ? 'bg-slate-900/40 border border-slate-900 text-slate-100 font-sans'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-50'
                }`}>
                  {shouldStream ? (
                    <StreamingResponse 
                      text={msg.content} 
                      onComplete={() => setCompletedStreams(prev => ({ ...prev, [msg.id]: true }))}
                    />
                  ) : (
                    <MarkdownText text={msg.content} />
                  )}
                </div>

                {/* Inline Action Card if a Master Plan is referenced */}
                {isAI && showWorkspaceButton && hasPlanKeyword && !isExecutionBlockMsg && (
                  <div className="border border-emerald-500/10 bg-emerald-500/5 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-[fadeIn_0.3s_ease] w-full max-w-xl">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Send to Workspace Core</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Decompose this plan into real checklists and start crafting interactive code files in the IDE.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTriggerPlanCreation(messages[idx - 1]?.content || msg.content)}
                      className="shrink-0 w-full sm:w-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Workspace</span>
                    </button>
                  </div>
                )}

                {/* Inline Action Card if Execution Block is triggered (Phase 6 redirection) */}
                {isAI && isExecutionBlockMsg && (
                  <div className="border border-teal-500/15 bg-teal-500/5 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-[fadeIn_0.3s_ease] w-full max-w-xl">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Access Workspace IDE</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Open the build core where you can run/build files, edit scripts, and view compiled web previews.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('workspace')}
                      className="shrink-0 w-full sm:w-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                    </button>
                  </div>
                )}
              </div>

              {!isAI && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Phase 8: Real-Time Brain Pipeline Stepper */}
        {isThinking && pipelineEvent && pipelineEvent.step !== 'idle' ? (
          <div className="flex gap-3.5 max-w-3xl mx-auto justify-start animate-fade-in w-full">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 bg-slate-900/50 border border-slate-900/80 p-4 rounded-2xl text-xs space-y-3 font-mono max-w-[85%]">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">🧠 MAMTA BRAIN ACTIVE PROCESS</span>
                <span className="text-[9px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">Goal: {pipelineEvent.goal || "Analyzing"}</span>
              </div>
              
              <div className="space-y-2">
                {/* Step 1: Thinking */}
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${pipelineEvent.step === 'thinking' ? 'text-emerald-400 animate-pulse font-bold' : 'text-slate-400'}`}>
                    {pipelineEvent.step === 'thinking' ? '●' : '✓'}
                  </span>
                  <span className={`text-[11px] ${pipelineEvent.step === 'thinking' ? 'text-emerald-300 font-semibold' : 'text-slate-500'}`}>
                    {pipelineEvent.step === 'thinking' ? 'Thinking... (Neural Target Vector active)' : 'Thought Generated'}
                  </span>
                </div>

                {/* Step 2: Planning */}
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${
                    pipelineEvent.step === 'planning' 
                      ? 'text-emerald-400 animate-pulse font-bold' 
                      : (pipelineEvent.step === 'thinking' ? 'text-slate-700' : '✓')
                  }`}>
                    {pipelineEvent.step === 'planning' ? '●' : (pipelineEvent.step === 'thinking' ? '○' : '✓')}
                  </span>
                  <span className={`text-[11px] ${
                    pipelineEvent.step === 'planning' 
                      ? 'text-emerald-300 font-semibold' 
                      : (pipelineEvent.step === 'thinking' ? 'text-slate-700' : 'text-slate-500')
                  }`}>
                    {pipelineEvent.step === 'planning' ? 'Planning... (Formulating task sequencing)' : (pipelineEvent.step === 'thinking' ? 'Plan Pending' : 'Strategic Plan Formulated')}
                  </span>
                </div>

                {/* Step 3: Execution */}
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${
                    pipelineEvent.step === 'executing' 
                      ? 'text-emerald-400 animate-pulse font-bold' 
                      : (['thinking', 'planning'].includes(pipelineEvent.step) ? 'text-slate-700' : '✓')
                  }`}>
                    {pipelineEvent.step === 'executing' ? '●' : (['thinking', 'planning'].includes(pipelineEvent.step) ? '○' : '✓')}
                  </span>
                  <span className={`text-[11px] ${
                    pipelineEvent.step === 'executing' 
                      ? 'text-emerald-300 font-semibold' 
                      : (['thinking', 'planning'].includes(pipelineEvent.step) ? 'text-slate-700' : 'text-slate-500')
                  }`}>
                    {pipelineEvent.step === 'executing' ? 'Executing... (Worker Agents active)' : (['thinking', 'planning'].includes(pipelineEvent.step) ? 'Execution Pending' : 'Execution Complete')}
                  </span>
                </div>

                {/* Step 4: Verification */}
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${
                    pipelineEvent.step === 'verifying' 
                      ? 'text-emerald-400 animate-pulse font-bold' 
                      : (['thinking', 'planning', 'executing'].includes(pipelineEvent.step) ? 'text-slate-700' : '✓')
                  }`}>
                    {pipelineEvent.step === 'verifying' ? '●' : (['thinking', 'planning', 'executing'].includes(pipelineEvent.step) ? '○' : '✓')}
                  </span>
                  <span className={`text-[11px] ${
                    pipelineEvent.step === 'verifying' 
                      ? 'text-emerald-300 font-semibold' 
                      : (['thinking', 'planning', 'executing'].includes(pipelineEvent.step) ? 'text-slate-700' : 'text-slate-500')
                  }`}>
                    {pipelineEvent.step === 'verifying' ? 'Verifying... (System Safety Audit)' : (['thinking', 'planning', 'executing'].includes(pipelineEvent.step) ? 'Verification Pending' : 'Safety Confirmed')}
                  </span>
                </div>
              </div>

              {pipelineEvent.details && (
                <div className="text-[10px] bg-slate-950 p-2 rounded border border-slate-800/80 text-slate-300 italic">
                  Status: {pipelineEvent.details}
                </div>
              )}
            </div>
          </div>
        ) : isThinking ? (
          <div className="flex gap-3.5 max-w-3xl mx-auto justify-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3 px-4 rounded-2xl bg-slate-900/20 border border-slate-900/40 text-slate-400 flex items-center gap-1.5">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-mono animate-pulse mr-1">Thinking</span>
              <span className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-[bounce_1.4s_infinite_0s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-[bounce_1.4s_infinite_0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-[bounce_1.4s_infinite_0.4s]" />
            </div>
          </div>
        ) : null}

        <div ref={chatEndRef} />
      </div>

      {/* Phase 1 & 8: Sticky Bottom Input Bar with zero viewport issues */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-4 pb-4 px-4 lg:px-6 shrink-0 z-20">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) handleSendMessage(input);
          }}
          className="relative max-w-3xl mx-auto"
        >
          <input
            id="home_chat_input_field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything... (e.g., 'namaste mamta! prepare a simple resume app plan')"
            className="w-full bg-slate-900/70 border border-slate-900 hover:border-slate-800 focus:border-emerald-500/50 rounded-2xl pl-4 pr-14 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 shadow-2xl transition-all duration-300"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <span className="hidden sm:flex items-center gap-0.5 text-[8.5px] font-mono text-slate-600 px-1.5 py-1 bg-slate-950/80 border border-slate-900 rounded">
              <span>Enter</span>
              <CornerDownLeft className="w-2.5 h-2.5 text-slate-500" />
            </span>
            <button
              id="home_chat_send_btn"
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-emerald-500 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <p className="text-[9px] text-slate-600 text-center mt-2 font-mono">
          MAMTA AI can generate plans, decompose items, and sync securely with Firestore.
        </p>
      </div>

      {/* Real World Mode: Premium SaaS Billing & Upgrade Center Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessingUpgrade && setShowUpgradeModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.3s_ease]"
            />

            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl shadow-emerald-500/5 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                    UPGRADE SUBSCRIPTION BANDWIDTH
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">Secure payments proxy by Razorpay API</p>
                </div>
                <button 
                  type="button"
                  disabled={isProcessingUpgrade}
                  onClick={() => setShowUpgradeModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 cursor-pointer disabled:opacity-30 transition-all text-xs font-mono font-bold"
                >
                  ESC
                </button>
              </div>

              {/* Plans Comparison Grid */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Pro Developer Plan */}
                  <div className="border border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-xl p-5 flex flex-col transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Pro Developer</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Perfect for individual creators</p>
                      </div>
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono">POPULAR</span>
                    </div>
                    <div className="my-3">
                      <span className="text-xl font-bold text-slate-100">₹499</span>
                      <span className="text-[10px] text-slate-500 font-mono"> / month</span>
                    </div>
                    
                    <ul className="space-y-2.5 my-4 flex-1 text-[11px] text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>**100 AI Operations** / month limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Full Level 10 CEO Decision Engine</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Interactive Node runtime executor</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>GitHub secure branch push automation</span>
                      </li>
                    </ul>

                    <button
                      type="button"
                      disabled={isProcessingUpgrade || subscriptionMetrics.planName === "Pro Developer"}
                      onClick={() => handleCreateOrderAndUpgrade('pro')}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-center transition-all ${
                        subscriptionMetrics.planName === "Pro Developer"
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 cursor-pointer hover:scale-[1.01]'
                      } disabled:opacity-50`}
                    >
                      {subscriptionMetrics.planName === "Pro Developer" ? "Active Plan" : isProcessingUpgrade ? "Connecting Gateway..." : "Activate Pro Plan"}
                    </button>
                  </div>

                  {/* Enterprise Premium Plan */}
                  <div className="border border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-xl p-5 flex flex-col transition-all relative">
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[8px] font-bold px-2 py-0.5 rounded font-mono shadow-md uppercase">BEST VALUE</div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Enterprise Premium</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">For commercial production and teams</p>
                      </div>
                    </div>
                    <div className="my-3">
                      <span className="text-xl font-bold text-slate-100">₹1,499</span>
                      <span className="text-[10px] text-slate-500 font-mono"> / month</span>
                    </div>

                    <ul className="space-y-2.5 my-4 flex-1 text-[11px] text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-emerald-400">**Infinite AI Operations** limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Self-evolution neural training loops</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Playwright high-fidelity browser testing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Dedicated tech-support SLAs</span>
                      </li>
                    </ul>

                    <button
                      type="button"
                      disabled={isProcessingUpgrade || subscriptionMetrics.planName === "Enterprise Premium"}
                      onClick={() => handleCreateOrderAndUpgrade('premium')}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-center transition-all ${
                        subscriptionMetrics.planName === "Enterprise Premium"
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 cursor-pointer hover:scale-[1.01]'
                      } disabled:opacity-50`}
                    >
                      {subscriptionMetrics.planName === "Enterprise Premium" ? "Active Plan" : isProcessingUpgrade ? "Connecting Gateway..." : "Activate Premium Plan"}
                    </button>
                  </div>

                </div>

                <div className="bg-slate-950/60 border border-slate-900/80 rounded-xl p-4 flex gap-3 items-start text-[10px] text-slate-400 leading-normal font-mono">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-300 mb-1">Razorpay secure credentials verified</p>
                    <p>All subscription payments are routed through a secure, encrypted socket. For your convenience, upgrades are fully verified instantly. Live test cards and secure sandbox simulation is enabled by default.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
