import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  BookOpen,
  Plus,
  CornerDownLeft,
  CreditCard,
  Check,
  Zap,
  LogIn,
  LogOut,
  Info,
  Menu,
  X,
  Brain,
  MessageSquare,
  History,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Paperclip,
  Search,
  Play,
  FileText,
  Image as ImageIcon,
  Loader2,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { ChatMessage } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { MamtaBrainReal, isPlanningOrDevelopmentQuery } from '../brain/MamtaBrainReal';
import { AutonomousLoop } from '../brain/AutonomousLoop';
import { saveProject } from '../db/ProjectStore';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  THINKING_STEPS, 
  enhanceResponse, 
  generateFollowups, 
  extractActiveTopic 
} from '../brain/HumanChatEngine';

interface HomeViewProps {
  sessionId: string;
  onSelectPlan: (planId: string) => void;
  setActiveTab: (tab: 'home' | 'workspace' | 'admin' | 'safedrop' | 'launch') => void;
  isLoggedIn: boolean;
  userEmail: string;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserEmail: (userEmail: string) => void;
  subscriptionMetrics: any;
  setSubscriptionMetrics: React.Dispatch<React.SetStateAction<any>>;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  fetchSubscriptionMetrics: () => Promise<void>;
  brain: MamtaBrainReal;
}

// Custom Markdown text renderer with interactive Node.js Sandboxed Code execution
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const [outputs, setOutputs] = useState<Record<number, { stdout: string; stderr: string; isRunning: boolean }>>({});

  const runCodeSandbox = async (code: string, index: number) => {
    setOutputs(prev => ({ ...prev, [index]: { stdout: '', stderr: '', isRunning: true } }));
    try {
      const res = await fetch('/api/chats/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setOutputs(prev => ({
        ...prev,
        [index]: {
          stdout: data.stdout || '',
          stderr: data.stderr || data.error || '',
          isRunning: false
        }
      }));
    } catch (err: any) {
      setOutputs(prev => ({
        ...prev,
        [index]: {
          stdout: '',
          stderr: err.message || 'Execution failed',
          isRunning: false
        }
      }));
    }
  };

  const segments: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  const parts = text.split('```');
  
  for (let idx = 0; idx < parts.length; idx++) {
    if (idx % 2 === 1) {
      const lines = parts[idx].split('\n');
      const language = lines[0].trim();
      const content = lines.slice(1).join('\n');
      segments.push({ type: 'code', content, language });
    } else {
      if (parts[idx]) {
        segments.push({ type: 'text', content: parts[idx] });
      }
    }
  }

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-200 font-sans">
      {segments.map((seg, segIdx) => {
        if (seg.type === 'code') {
          const isRunnable = seg.language === 'js' || seg.language === 'javascript' || seg.language === 'ts' || seg.language === 'typescript' || !seg.language;
          const output = outputs[segIdx];

          return (
            <div key={segIdx} className="my-3 rounded-xl border border-slate-900/80 overflow-hidden bg-slate-950/80">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-900 text-[11px] font-mono text-slate-400">
                <span>{seg.language || 'javascript'}</span>
                {isRunnable && (
                  <button
                    onClick={() => runCodeSandbox(seg.content, segIdx)}
                    disabled={output?.isRunning}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                  >
                    {output?.isRunning ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5" />
                        <span>Run Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <pre className="p-4 font-mono text-xs overflow-x-auto text-emerald-300/90 leading-normal bg-slate-950/90">
                <code>{seg.content}</code>
              </pre>
              {output && (
                <div className="border-t border-slate-900 bg-slate-900/20 p-3 font-mono text-[11px]">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Sandbox Execution Output:</p>
                  {output.stdout && (
                    <pre className="text-slate-200 bg-slate-950/40 p-2 rounded border border-slate-900/50 max-h-40 overflow-y-auto whitespace-pre-wrap">{output.stdout}</pre>
                  )}
                  {output.stderr && (
                    <pre className="text-rose-400 bg-rose-500/5 p-2 rounded border border-rose-500/10 max-h-40 overflow-y-auto whitespace-pre-wrap">{output.stderr}</pre>
                  )}
                  {!output.stdout && !output.stderr && !output.isRunning && (
                    <p className="text-slate-500 italic">Code executed successfully with no console output.</p>
                  )}
                </div>
              )}
            </div>
          );
        }

        const lines = seg.content.split('\n');
        return (
          <div key={segIdx} className="space-y-1.5">
            {lines.map((line, i) => {
              if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                return (
                  <ul key={i} className="list-disc pl-5 my-1 text-slate-300">
                    <li>{line.replace(/^[-*]\s+/, '')}</li>
                  </ul>
                );
              }
              if (line.startsWith('### ')) {
                return <h4 key={i} className="text-sm font-semibold text-emerald-400 mt-4 mb-2">{line.replace('### ', '')}</h4>;
              }
              if (line.startsWith('## ')) {
                return <h3 key={i} className="text-base font-semibold text-emerald-400 mt-5 mb-2 border-b border-slate-800 pb-1">{line.replace('## ', '')}</h3>;
              }
              if (line.startsWith('# ')) {
                return <h2 key={i} className="text-lg font-bold text-emerald-300 mt-6 mb-3">{line.replace('# ', '')}</h2>;
              }
              const parts = line.split('**');
              if (parts.length > 1) {
                return (
                  <p key={i}>
                    {parts.map((part, idx) => (idx % 2 === 1 ? <strong key={idx} className="text-emerald-300 font-semibold">{part}</strong> : part))}
                  </p>
                );
              }
              if (line.trim() === '') {
                return <div key={i} className="h-2" />;
              }
              return <p key={i}>{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// Character-by-character Streaming text simulation with human speed feel
const StreamingResponse: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);
    
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, 12); // Real human-like characters-by-characters feel typing delay (12-15ms)
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="relative">
      <MarkdownText text={displayedText} />
      {!isComplete && (
        <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-1 animate-[pulse_0.6s_infinite] align-middle shrink-0" />
      )}
    </div>
  );
};

export default function HomeView({ 
  sessionId, 
  onSelectPlan, 
  setActiveTab,
  isLoggedIn,
  userEmail,
  setIsLoggedIn,
  setUserEmail,
  subscriptionMetrics,
  setSubscriptionMetrics,
  showUpgradeModal,
  setShowUpgradeModal,
  fetchSubscriptionMetrics,
  brain
}: HomeViewProps) {
  
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const [sessions, setSessions] = useState<{ id: string; title: string }[]>([]);
  const [memory, setMemory] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMemoryOpen, setIsMemoryOpen] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [newMemoryText, setNewMemoryText] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStatusText, setThinkingStatusText] = useState('🧠 Understanding your question...');
  const [activeTopic, setActiveTopic] = useState<string | null>('General SaaS Coding');
  const [lastModelMsgId, setLastModelMsgId] = useState<string | null>(null);
  const [completedStreams, setCompletedStreams] = useState<Record<string, boolean>>({});

  // ChatGPT Supermode states
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState<Record<string, 'like' | 'dislike'>>({});
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    messageId: string;
    content: string;
    type: 'like' | 'dislike';
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isFeedbackAccordionOpen, setIsFeedbackAccordionOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    type: string;
    textContent?: string;
    base64?: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [upgradePlanKey, setUpgradePlanKey] = useState<'pro' | 'premium' | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<boolean>(false);

  useEffect(() => {
    fetchSubscriptionMetrics();
  }, [currentSessionId]);

  const handleLogin = () => {
    // Simulated Google OAuth Flow
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

  const handleCreateOrderAndUpgrade = async (planKey: 'pro' | 'premium') => {
    setIsProcessingUpgrade(true);
    const amount = planKey === 'pro' ? 499 : 999;

    try {
      // 1. Create order on the backend (Razorpay SDK)
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, sessionId: currentSessionId })
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
        body: JSON.stringify({ sessionId: currentSessionId, planKey, amount })
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
      if (event && event.details) {
        setTerminalLogs(prev => {
          const detail = `🧠 [Brain] Step: ${event.step.toUpperCase()} - ${event.details}`;
          if (prev[prev.length - 1] === detail) return prev; // avoid exact consecutive duplicate logs
          return [...prev, detail];
        });
      }
    });
    return () => unsubscribe();
  }, [brain]);

  // 1. Load or initialize sessions
  useEffect(() => {
    const stored = localStorage.getItem('mamta_sessions');
    let loadedSessions: { id: string; title: string }[] = [];
    if (stored) {
      try {
        loadedSessions = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored sessions:', e);
      }
    }
    
    // Ensure current active session is present
    const hasCurrentProp = loadedSessions.some(s => s.id === sessionId);
    if (loadedSessions.length === 0 || (sessionId && !hasCurrentProp)) {
      const defaultSession = {
        id: sessionId || 'session_default',
        title: 'Current Active Chat'
      };
      if (!hasCurrentProp) {
        loadedSessions.unshift(defaultSession);
      }
      localStorage.setItem('mamta_sessions', JSON.stringify(loadedSessions));
    }
    setSessions(loadedSessions);
    // Sync current session ID on initial load
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId]);

  // Sync currentSessionId state if sessionId prop changes
  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId]);

  // 2. Load or initialize memory profile
  useEffect(() => {
    const stored = localStorage.getItem('mamta_memory');
    if (stored) {
      try {
        setMemory(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialMemory = [
        "User prefers production-grade code 🚀",
        "Prefers TypeScript & modular components 💻",
        "Autonomous Agent mode active 🤖"
      ];
      setMemory(initialMemory);
      localStorage.setItem('mamta_memory', JSON.stringify(initialMemory));
    }
  }, []);

  // 3. Auto-remember topics when activeTopic changes
  useEffect(() => {
    if (activeTopic) {
      setMemory(prev => {
        const formatted = `Interested in: ${activeTopic} 🧠`;
        if (!prev.includes(formatted)) {
          const updated = [formatted, ...prev].slice(0, 8); // Keep last 8 memories
          localStorage.setItem('mamta_memory', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [activeTopic]);

  // 4. Session Action Handlers
  const handleNewChat = () => {
    const newId = 'session_' + Math.random().toString(36).substring(2, 11);
    const newSession = {
      id: newId,
      title: 'New Chat ' + (sessions.length + 1)
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    localStorage.setItem('mamta_sessions', JSON.stringify(updated));
    setCurrentSessionId(newId);
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== idToDelete);
    setSessions(updated);
    localStorage.setItem('mamta_sessions', JSON.stringify(updated));
    if (currentSessionId === idToDelete) {
      if (updated.length > 0) {
        setCurrentSessionId(updated[0].id);
      } else {
        const newId = 'session_' + Math.random().toString(36).substring(2, 11);
        const newSession = { id: newId, title: 'New Chat 1' };
        setSessions([newSession]);
        localStorage.setItem('mamta_sessions', JSON.stringify([newSession]));
        setCurrentSessionId(newId);
      }
    }
  };

  // 5. Memory Action Handlers
  const handleAddMemory = () => {
    if (!newMemoryText.trim()) return;
    setMemory(prev => {
      const formatted = `${newMemoryText.trim()}`;
      if (!prev.includes(formatted)) {
        const updated = [formatted, ...prev];
        localStorage.setItem('mamta_memory', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
    setNewMemoryText('');
  };

  const handleDeleteMemory = (idxToDelete: number) => {
    const updated = memory.filter((_, i) => i !== idxToDelete);
    setMemory(updated);
    localStorage.setItem('mamta_memory', JSON.stringify(updated));
  };

  const handleClearAllMemories = () => {
    if (!window.confirm('Are you sure you want to clear all memories?')) return;
    setMemory([]);
    localStorage.setItem('mamta_memory', JSON.stringify([]));
  };

  // V10 Autonomous Loop management
  const [autoLoop] = useState(() => new AutonomousLoop(brain));
  const [autoStatus, setAutoStatus] = useState("Autonomous Idle");
  const [isAutoActive, setIsAutoActive] = useState(false);

  useEffect(() => {
    const handleStatusUpdate = (status: string) => {
      setAutoStatus(status);
      setTerminalLogs(prev => [...prev, `🤖 [AutoLoop] ${status}`]);
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
    { label: 'Create AI SaaS idea', sub: 'Generate structural master plan & MVP architecture' },
    { label: 'Build marketing strategy', sub: 'Formulate viral growth loops & channel strategy' },
    { label: 'How to make money online', sub: 'Actionable blueprints for high-leverage products' },
    { label: 'Explain AI simply', sub: 'Break down complex neural structures with examples' }
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time chats from Firestore (Phase 10: Sync context)
  useEffect(() => {
    if (!currentSessionId) return;

    try {
      const q = query(
        collection(db, 'chats'),
        where('sessionId', '==', currentSessionId),
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
  }, [currentSessionId]);

  // Phase 7: Auto scroll system
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // REST Fallback fetcher
  const fetchChatsREST = async () => {
    try {
      const res = await fetch(`/api/chats?sessionId=${currentSessionId}`);
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

  const handleFeedbackSubmit = async () => {
    if (!feedbackModal) return;
    setIsSubmittingFeedback(true);
    try {
      // Save feedback report to Firestore
      await addDoc(collection(db, 'message_feedbacks'), {
        sessionId: currentSessionId,
        messageId: feedbackModal.messageId,
        messageContent: feedbackModal.content,
        type: feedbackModal.type,
        userFeedbackText: feedbackText.trim(),
        userEmail: userEmail || 'anonymous',
        timestamp: new Date().toISOString()
      });

      // Update local feedback map so UI knows this message is rated
      setMessageFeedback(prev => ({
        ...prev,
        [feedbackModal.messageId]: feedbackModal.type
      }));

      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackModal(null);
        setFeedbackText('');
        setFeedbackSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to submit message feedback to firestore:', err);
      // Fallback: save locally even if firestore fails
      setMessageFeedback(prev => ({
        ...prev,
        [feedbackModal.messageId]: feedbackModal.type
      }));
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackModal(null);
        setFeedbackText('');
        setFeedbackSuccess(false);
      }, 1500);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Voice Input (Speech-to-Text) using WebSpeechAPI
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus("Error: Browser not supported. Use Google Chrome.");
      setTimeout(() => setVoiceStatus(null), 5000);
      return;
    }
    
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN"; // English with Indian accents / Hindi bilingual friendly
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus("Listening... Speak now");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error, event);
        setIsListening(false);
        let errorMsg = "Error: Voice input failed";
        if (event.error === 'not-allowed') {
          errorMsg = "Error: Microphone permission blocked. Please check site/browser settings.";
        } else if (event.error === 'no-speech') {
          errorMsg = "Error: No speech detected. Try speaking closer.";
        } else if (event.error === 'audio-capture') {
          errorMsg = "Error: No microphone found.";
        } else if (event.error === 'network') {
          errorMsg = "Error: Network issue.";
        } else if (event.error) {
          errorMsg = `Error: ${event.error}`;
        }
        setVoiceStatus(errorMsg);
        setTimeout(() => setVoiceStatus(null), 6000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatus(prev => prev && prev.startsWith("Error:") ? prev : null);
      };

      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) {
          setInput(prev => prev ? prev + " " + text : text);
          setVoiceStatus("Speech recognized!");
          setTimeout(() => setVoiceStatus(null), 2000);
        }
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setVoiceStatus(`Error: ${err.message || 'Failed to start'}`);
      setTimeout(() => setVoiceStatus(null), 5000);
    }
  };

  // Voice Output (Text-to-Speech) using Mamta Voice Clone Engine
  const handleSpeak = async (text: string, msgId: string) => {
    if (playingMsgId === msgId) {
      if (audioElement) {
        audioElement.pause();
        setPlayingMsgId(null);
      }
      return;
    }

    try {
      setPlayingMsgId(msgId);
      
      // Clean up previous playing audio
      if (audioElement) {
        audioElement.pause();
      }

      const cleanText = text.replace(/[*#`_\-\[\]\(\)]/g, ' '); // Clean markdown chars

      const res = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, sessionId: currentSessionId })
      });
      
      if (!res.ok) throw new Error('Failed to fetch dynamic clone audio file');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        setPlayingMsgId(null);
      };
      
      audio.onerror = () => {
        setPlayingMsgId(null);
      };
      
      setAudioElement(audio);
      audio.play();
    } catch (err) {
      console.error('Failed to generate Voice Engine clone, trying browser speechSynthesis fallback:', err);
      // Clean up
      setPlayingMsgId(null);
      
      if ('speechSynthesis' in window) {
        setPlayingMsgId(msgId);
        window.speechSynthesis.cancel();
        
        const cleanText = text.replace(/[*#`_\-\[\]\(\)]/g, ' ');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-IN';
        
        utterance.onend = () => {
          setPlayingMsgId(null);
        };
        utterance.onerror = () => {
          setPlayingMsgId(null);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // File Upload (PDF, Images, Text Files) with drag/drop & click
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/chats/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Upload failed');
      }
      const data = await res.json();

      if (data.success) {
        setUploadedFile({
          name: data.fileName,
          type: data.fileType,
          textContent: data.textContent,
          base64: data.base64
        });
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert(`File processing failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Phase 5 & 9: Brain integration & Performance (IsSending block)
  const handleSendMessage = async (textToSend: string) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput || isThinking) return;

    // Client-side block for Planning & Development queries exceeding limits
    const isDev = isPlanningOrDevelopmentQuery(trimmedInput);
    if (isDev) {
      if (subscriptionMetrics.limit !== Infinity && subscriptionMetrics.limit !== null && subscriptionMetrics.usage >= subscriptionMetrics.limit) {
        setInput('');
        setShowUpgradeModal(true);
        const limitMsg: ChatMessage = {
          id: 'limit-' + Date.now(),
          sessionId: currentSessionId,
          role: 'model',
          content: `### ⛔ Development Limit Reached
          
You have fully consumed the planning and development limit under your **${subscriptionMetrics.planName}**. 

We have automatically popped up the **SaaS Subscription Upgrade** dashboard so you can securely upgrade your account to continue creating applications, compiling code, and executing sandboxed programs.

*Note: Conversational chats remain **100% free and unlimited**. If you wish to continue chatting or exploring, you can simply close the popup modal.*`,
          timestamp: new Date().toISOString(),
          pageSource: 'home'
        };
        setMessages(prev => [...prev, limitMsg]);
        return;
      }

      // Add user's development query message to chat
      const userMsg: ChatMessage = {
        id: 'user-' + Date.now(),
        sessionId: currentSessionId,
        role: 'user',
        content: trimmedInput,
        timestamp: new Date().toISOString(),
        pageSource: 'home'
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsThinking(true);
      setThinkingStatusText('⚡ Planning project in our neural network...');

      try {
        // Formulate the project plan via backend API in real-time
        const res = await fetch('/api/plans/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idea: trimmedInput,
            sessionId: currentSessionId
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        // Save project context to persistent storage
        saveProject({
          id: data.id,
          input: trimmedInput,
          files: data.files || [],
          name: data.title || "Mamta AI Generated Project",
          created_at: new Date().toISOString()
        });

        // Formulate transition message
        const redirectMsg: ChatMessage = {
          id: 'redirect-' + Date.now(),
          sessionId: currentSessionId,
          role: 'model',
          content: `⚡ **Project Formulated Successfully!**
          
I have created a comprehensive Master Plan for your request: *"${trimmedInput}"*.

I am now seamlessly redirecting you to the **Workspace Page** (our Devin-like Real AI Engine Room), where you will find the file explorer, code editor, live browser preview, and our real-time compilation terminal ready to build this project!`,
          timestamp: new Date().toISOString(),
          pageSource: 'home'
        };
        setMessages(prev => [...prev, redirectMsg]);

        // Smoothly select plan and navigate to Workspace after a short delay
        setTimeout(() => {
          onSelectPlan(data.id);
          setActiveTab('workspace');
          setIsThinking(false);
        }, 1200);

      } catch (err: any) {
        console.error('Plan formulation error:', err);
        const errorMsg: ChatMessage = {
          id: 'error-' + Date.now(),
          sessionId: currentSessionId,
          role: 'model',
          content: `❌ **Failed to formulate plan:** ${err.message || 'Unknown network error'}\n\nPlease try again or verify your connection settings.`,
          timestamp: new Date().toISOString(),
          pageSource: 'home'
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsThinking(false);
      }
      return;
    }

    // Dynamically update session title based on first query
    if (sessions.some(s => s.id === currentSessionId && (s.title.startsWith('New Chat') || s.title === 'Current Active Chat'))) {
      const newTitle = trimmedInput.length > 25 ? trimmedInput.slice(0, 25) + '...' : trimmedInput;
      const updated = sessions.map(s => s.id === currentSessionId ? { ...s, title: newTitle } : s);
      setSessions(updated);
      localStorage.setItem('mamta_sessions', JSON.stringify(updated));
    }

    // Phase 6: Execution control (Intercept build & run commands)
    const lowerInput = trimmedInput.toLowerCase();
    if (trimmedInput.startsWith('/build') || trimmedInput.startsWith('/run') || lowerInput === 'build app' || lowerInput === 'run app') {
      setInput('');
      const blockedMsg: ChatMessage = {
        id: 'block-' + Date.now(),
        sessionId: currentSessionId,
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
      sessionId: currentSessionId,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toISOString(),
      pageSource: 'home'
    };
    setMessages(prev => [...prev, userTempMsg]);

    setInput('');
    setTerminalLogs(prev => [...prev, `> Query dispatched: "${trimmedInput}"`]);
    setIsThinking(true);
    setThinkingStatusText(THINKING_STEPS[0]);

    // Track/update the active memory topic based on query content
    setActiveTopic(prev => extractActiveTopic(trimmedInput, prev));

    try {
      // 1. Concurrently run visual thinking steps simulation
      const thinkingAnim = (async () => {
        for (let i = 0; i < THINKING_STEPS.length; i++) {
          setThinkingStatusText(THINKING_STEPS[i]);
          await new Promise(r => setTimeout(r, 550));
        }
      })();

      // 2. Attach file and web search params to the brain instance before processing
      (brain as any).uploadedFile = uploadedFile;
      (brain as any).webSearchEnabled = webSearchEnabled;

      // Process real output through MamtaBrainReal
      const brainPromise = brain.processWithUser(trimmedInput, currentSessionId, userEmail);

      // Wait for both to complete beautifully to keep the professional, polished "AI thinking" pace
      const [_, result] = await Promise.all([thinkingAnim, brainPromise]);
      let response = result.text;
      
      // Update local metrics and subscription state immediately
      setSubscriptionMetrics(result.dashboard);

      if (response && response.includes("Development Limit Reached")) {
        setShowUpgradeModal(true);
      }

      // Enhance the response with conversational humanness
      if (response) {
        response = enhanceResponse(response);
      }

      // Append model response to UI state instantly as an optimistic model message, 
      // preventing any visual gaps or latency lag from the database call
      if (response) {
        const modelTempMsg: ChatMessage = {
          id: 'model-temp-' + Date.now(),
          sessionId: currentSessionId,
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

        // Trigger TTS if Auto-Speak is active
        if (autoSpeakEnabled) {
          handleSpeak(response, modelTempMsg.id);
        }
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
        sessionId: currentSessionId,
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
      setUploadedFile(null);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear conversation history in this session?')) return;
    try {
      await fetch('/api/chats/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId })
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
          sessionId: currentSessionId
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
    <div id="home_core_pane" className="flex flex-row h-[calc(100vh-100px)] lg:h-[calc(100vh-40px)] w-full relative text-slate-100 overflow-hidden bg-slate-950/20 rounded-2xl border border-slate-900">
      
      {/* 1. Left Sidebar System */}
      {isSidebarOpen && (
        <div id="left_sidebar_panel" className="w-64 bg-slate-950/95 border-r border-slate-900/80 p-4 flex flex-col shrink-0 h-full relative z-10 transition-all duration-300">
          {/* Sidebar header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Mamta Sessions
            </span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Close Sessions Sidebar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* + New Chat Button */}
          <button 
            onClick={handleNewChat}
            className="w-full mb-4 py-2 px-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {sessions.map((s) => {
              const isActive = currentSessionId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setCurrentSessionId(s.id)}
                  className={`group p-2.5 rounded-lg cursor-pointer flex items-center justify-between gap-2 text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-slate-900 border border-slate-800 text-emerald-400 shadow-inner' 
                      : 'hover:bg-slate-900/60 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <span className="truncate flex-1 pr-1">{s.title}</span>
                  
                  {/* Delete session button */}
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-all cursor-pointer shrink-0"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom quick meta */}
          <div className="pt-3 border-t border-slate-900/80 shrink-0 text-[10px] font-mono text-slate-500">
            <span>Created by Mamta Pro UI v10</span>
          </div>
        </div>
      )}

      {/* 2. Middle Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-3 lg:p-4 relative">

        {/* Minimal Navbar Header & Control center */}
        <div className="w-full flex items-center justify-between border-b border-slate-900/60 pb-3 mb-2 shrink-0 gap-3">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer mr-1"
                title="Show Sessions"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            
            <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-xs font-bold tracking-wider text-slate-100 uppercase font-mono flex items-center gap-1.5">
                MAMTA AI
                <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold tracking-wider font-mono border border-indigo-500/20 text-indigo-400 bg-indigo-500/5">
                  Supermode
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider font-mono border transition-all duration-300 ${isAutoActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 animate-pulse' : 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                  {isAutoActive ? 'autonomous' : 'standby'}
                </span>
              </h2>
              {activeTopic && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-emerald-400/90 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Topic: {activeTopic}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Autonomous system status */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/40 border border-slate-900 px-2 py-1 rounded-lg">
              <span className={`w-1.5 h-1.5 rounded-full ${isAutoActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[10px] font-mono text-slate-300 truncate max-w-[120px]">{autoStatus}</span>
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
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsMemoryOpen(!isMemoryOpen)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isMemoryOpen 
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' 
                  : 'bg-slate-900 border-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Memory Profile"
            >
              <Brain className="w-4 h-4" />
            </button>
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

                {isAI && (
                  <div className="flex flex-wrap items-center gap-3.5 px-1 py-0.5 self-start animate-fade-in text-slate-500">
                    {/* Speak Button */}
                    <button
                      onClick={() => handleSpeak(msg.content, msg.id)}
                      className={`text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:bg-slate-900 border border-transparent cursor-pointer ${
                        playingMsgId === msg.id 
                          ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 font-bold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title={playingMsgId === msg.id ? 'Stop Voice Output' : 'Speak this response aloud'}
                    >
                      {playingMsgId === msg.id ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>

                    {/* Auto Speak Toggle */}
                    <button
                      onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
                      className={`text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all border border-transparent cursor-pointer hover:bg-slate-900 ${
                        autoSpeakEnabled 
                          ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10 font-semibold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Toggle auto-speak for subsequent AI responses"
                    >
                      {autoSpeakEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>Auto-Speak: On</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                          <span>Auto-Speak: Off</span>
                        </>
                      )}
                    </button>

                    {/* Minimal Separator */}
                    <span className="w-px h-3 bg-slate-800" />

                    {/* Like / Thumbs Up Button */}
                    <button
                      onClick={() => {
                        const mId = msg.id || `${idx}`;
                        setFeedbackModal({
                          isOpen: true,
                          messageId: mId,
                          content: msg.content,
                          type: 'like'
                        });
                        setFeedbackText('');
                        setFeedbackSuccess(false);
                        setIsFeedbackAccordionOpen(false);
                      }}
                      className={`p-1 rounded-lg transition-all hover:bg-slate-900 cursor-pointer ${
                        messageFeedback[msg.id || `${idx}`] === 'like'
                          ? 'text-emerald-400 bg-emerald-500/5 scale-105 border border-emerald-500/20'
                          : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900/40'
                      }`}
                      title="Helpful Response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Dislike / Thumbs Down Button */}
                    <button
                      onClick={() => {
                        const mId = msg.id || `${idx}`;
                        setFeedbackModal({
                          isOpen: true,
                          messageId: mId,
                          content: msg.content,
                          type: 'dislike'
                        });
                        setFeedbackText('');
                        setFeedbackSuccess(false);
                        setIsFeedbackAccordionOpen(false);
                      }}
                      className={`p-1 rounded-lg transition-all hover:bg-slate-900 cursor-pointer ${
                        messageFeedback[msg.id || `${idx}`] === 'dislike'
                          ? 'text-rose-400 bg-rose-500/5 scale-105 border border-rose-500/20'
                          : 'text-slate-400 hover:text-rose-400 hover:bg-slate-900/40'
                      }`}
                      title="Not Helpful Response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Instant Feedback indicator with entry animation */}
                    {messageFeedback[msg.id || `${idx}`] && (
                      <span className="text-[9px] text-emerald-400/90 font-mono bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10 animate-[fadeIn_0.2s_ease]">
                        {messageFeedback[msg.id || `${idx}`] === 'like' ? 'Liked!' : 'Disliked!'} Feedback Saved!
                      </span>
                    )}
                  </div>
                )}

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

                {/* Dynamic Follow-up AI Suggestion Chips (Real ChatGPT style) */}
                {isAI && idx === messages.length - 1 && !isThinking && (
                  <div className="flex flex-wrap gap-2 pt-2 animate-[fadeIn_0.3s_ease]">
                    {generateFollowups(messages[idx - 1]?.content || msg.content).map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(chip.trim())}
                        className="px-3 py-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 hover:border-emerald-500/30 rounded-xl transition-all duration-200 cursor-pointer hover:scale-[1.02] flex items-center gap-1"
                      >
                        <span>{chip}</span>
                      </button>
                    ))}
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
            <div className="p-3.5 px-4.5 rounded-2xl bg-slate-900/30 border border-slate-900 text-slate-300 flex flex-col space-y-1 max-w-[85%]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-emerald-400 animate-pulse">{thinkingStatusText}</span>
                <span className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-[bounce_1.4s_infinite_0s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-[bounce_1.4s_infinite_0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-[bounce_1.4s_infinite_0.4s]" />
              </div>
            </div>
          </div>
        ) : null}

        <div ref={chatEndRef} />
      </div>

      {/* Phase 1 & 8: Sticky Bottom Input Bar with zero viewport issues */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-4 pb-4 px-4 lg:px-6 shrink-0 z-20">
        
        {/* Paperclip File Upload (Hidden Input) */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf, .txt, .md, .js, .ts, .json, image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Attachment Pill and Controls Toolbar */}
        {(uploadedFile || voiceStatus) ? (
          <div className="max-w-3xl mx-auto flex flex-col gap-2 mb-2 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-900/50 backdrop-blur-sm animate-fade-in">
            {uploadedFile && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 self-start animate-fade-in">
                {uploadedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-3.5 h-3.5" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span className="font-medium max-w-xs truncate">{uploadedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="ml-1 text-slate-400 hover:text-emerald-300 transition-colors p-0.5 rounded hover:bg-emerald-500/15 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {voiceStatus && (
              <div className="text-[10px] font-mono flex items-center gap-1.5 transition-all self-start animate-fade-in">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${voiceStatus.startsWith('Error') ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 animate-pulse'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${voiceStatus.startsWith('Error') ? 'bg-rose-400' : 'bg-emerald-400 animate-ping'}`} />
                  <span>{voiceStatus}</span>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) handleSendMessage(input);
          }}
          className="relative max-w-3xl mx-auto flex items-center"
        >
          {/* File Upload Trigger Plus Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute left-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-center border border-slate-800/60 shadow-lg group"
            title="Upload/Attach files (PDF, Image, Text, JS/TS)"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Plus className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90 text-slate-300 group-hover:text-emerald-400" />
            )}
          </button>

          <input
            id="home_chat_input_field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening 
                ? "Listening... Speak now!" 
                : "Ask MAMTA..."
            }
            className={`w-full bg-slate-900/70 border rounded-2xl pl-12 pr-24 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 shadow-2xl transition-all duration-300 ${
              isListening ? "border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/10" : "border-slate-900 hover:border-slate-800 focus:border-emerald-500/50"
            }`}
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            {/* Mic Input Trigger */}
            <button
              type="button"
              onClick={startListening}
              className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isListening 
                  ? "bg-rose-600 text-white animate-bounce" 
                  : "bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200"
              }`}
              title="Speak to Mamta AI"
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5 animate-[ping_1.5s_infinite]" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>

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
        
      </div>

    </div>

      {/* 3. Right Memory Profile Panel */}
      {isMemoryOpen && (
        <div id="right_memory_panel" className="w-72 bg-slate-950/95 border-l border-slate-900/80 p-4 flex flex-col shrink-0 h-full relative z-10 transition-all duration-300">
          {/* Heading */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-400" /> Advanced Memory
            </span>
            <button 
              onClick={() => setIsMemoryOpen(false)}
              className="p-1 rounded-md hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all cursor-pointer block lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-[10px] text-slate-500 leading-relaxed mb-4 font-mono">
            Dynamic context remembered during discussions to personalize suggestions & generation.
          </p>

          {/* Memory Add Input */}
          <div className="mb-4 shrink-0 flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-lg p-1">
            <input 
              type="text"
              placeholder="Add custom constraint..."
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
              className="w-full bg-transparent border-0 outline-none focus:ring-0 text-xs text-slate-200 placeholder:text-slate-600 px-1.5 py-1"
            />
            <button 
              onClick={handleAddMemory}
              className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-slate-950 rounded-md text-[10px] font-bold cursor-pointer transition-all"
            >
              Add
            </button>
          </div>

          {/* Memories List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {memory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <History className="w-6 h-6 text-slate-700 mb-1.5 stroke-1" />
                <p className="text-[10px] text-slate-600 font-mono">No active memories. Add or type messages to train.</p>
              </div>
            ) : (
              memory.map((item, idx) => (
                <div 
                  key={idx}
                  className="group p-2 bg-slate-900/40 border border-slate-900/80 rounded-lg flex items-start justify-between gap-1.5 text-[11px] text-slate-300 leading-normal"
                >
                  <span className="flex-1 font-sans">{item}</span>
                  <button
                    onClick={() => handleDeleteMemory(idx)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all cursor-pointer shrink-0"
                    title="Forget Memory"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Clear All Memories button */}
          {memory.length > 0 && (
            <button 
              onClick={handleClearAllMemories}
              className="w-full mt-4 py-1.5 px-3 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-mono tracking-wide transition-all cursor-pointer"
            >
              Clear All Memories
            </button>
          )}
        </div>
      )}

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
                  className="p-1.5 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 bg-slate-950/40 cursor-pointer disabled:opacity-30 transition-all text-xs flex items-center justify-center shrink-0 w-8 h-8"
                  title="Close Upgrade Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Plans Comparison Grid */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Pro Developer Plan */}
                  <div className="border border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-xl p-5 flex flex-col transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">MAMTA PRO SAAS</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Advanced Gemini-3.5-Flash & direct IDE integrations</p>
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
                        <span>**1,000 High-Quality Synthesis** / month limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Advanced Gemini-3.5-Flash</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Stripe & Razorpay auto-routing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Interactive Node runtime executor</span>
                      </li>
                    </ul>

                    <button
                      type="button"
                      disabled={isProcessingUpgrade || subscriptionMetrics.planName === "MAMTA PRO SAAS"}
                      onClick={() => handleCreateOrderAndUpgrade('pro')}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-center transition-all ${
                        subscriptionMetrics.planName === "MAMTA PRO SAAS"
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 cursor-pointer hover:scale-[1.01]'
                      } disabled:opacity-50`}
                    >
                      {subscriptionMetrics.planName === "MAMTA PRO SAAS" ? "Active Plan" : isProcessingUpgrade ? "Connecting Gateway..." : "Activate Pro Plan"}
                    </button>
                  </div>

                  {/* Enterprise Premium Plan */}
                  <div className="border border-slate-800 hover:border-slate-700 bg-slate-950/40 rounded-xl p-5 flex flex-col transition-all relative">
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[8px] font-bold px-2 py-0.5 rounded font-mono shadow-md uppercase">BEST VALUE</div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">ENTERPRISE MAX</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Unlimited AI generations & enterprise scaling</p>
                      </div>
                    </div>
                    <div className="my-3">
                      <span className="text-xl font-bold text-slate-100">₹999</span>
                      <span className="text-[10px] text-slate-500 font-mono"> / month</span>
                    </div>

                    <ul className="space-y-2.5 my-4 flex-1 text-[11px] text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-emerald-400">**Unlimited AI generations** limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Dedicated Shard Firestore Node</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Playwright high-fidelity browser testing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Dedicated support team</span>
                      </li>
                    </ul>

                    <button
                      type="button"
                      disabled={isProcessingUpgrade || subscriptionMetrics.planName === "ENTERPRISE MAX"}
                      onClick={() => handleCreateOrderAndUpgrade('premium')}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-center transition-all ${
                        subscriptionMetrics.planName === "ENTERPRISE MAX"
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 cursor-pointer hover:scale-[1.01]'
                      } disabled:opacity-50`}
                    >
                      {subscriptionMetrics.planName === "ENTERPRISE MAX" ? "Active Plan" : isProcessingUpgrade ? "Connecting Gateway..." : "Activate Premium Plan"}
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

      {/* 4. MAMTA AI Message Feedback Modal */}
      <AnimatePresence>
        {feedbackModal && feedbackModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop filter blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmittingFeedback && setFeedbackModal(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl flex flex-col text-slate-100 font-sans"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
                <span className="text-base font-medium text-slate-100">Submit feedback</span>
                <button 
                  type="button"
                  disabled={isSubmittingFeedback}
                  onClick={() => setFeedbackModal(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                {feedbackSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-emerald-400">Feedback Submitted Successfully!</h4>
                    <p className="text-xs text-slate-400 font-mono">Thank you for helping us improve MAMTA AI response quality.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      Submitting this feedback report will send the following information to MAMTA AI:
                    </p>

                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                      <li>The entire contents of all of the files of your app</li>
                      <li>The entire contents of earlier versions of the files of your app if they changed in this session</li>
                      <li>The entire contents of your chat history with MAMTA AI</li>
                    </ul>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Your response is Feedback under the <span className="text-indigo-400 hover:underline cursor-pointer">Terms</span>, and may be used to improve our services subject to our <span className="text-indigo-400 hover:underline cursor-pointer">Privacy Policy</span>. Do not submit personal, sensitive, or confidential information.
                    </p>

                    {/* Accordion list */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/30">
                      <button
                        type="button"
                        onClick={() => setIsFeedbackAccordionOpen(!isFeedbackAccordionOpen)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-slate-300 hover:bg-slate-900/50 transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-emerald-400" />
                          MAMTA AI messages
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isFeedbackAccordionOpen ? 'rotate-185' : ''}`} />
                      </button>

                      {isFeedbackAccordionOpen && (
                        <div className="px-3.5 pb-3 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed max-h-36 overflow-y-auto custom-scrollbar font-mono bg-slate-950/50">
                          {feedbackModal.content}
                        </div>
                      )}
                    </div>

                    {/* Feedback Textarea Input */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-300">
                        {feedbackModal.type === 'like' ? 'What did you like about the response?' : 'What did you dislike about the response?'}
                      </label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Please write your observations or details..."
                        className="w-full h-24 p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 resize-none transition-all"
                      />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => setFeedbackModal(null)}
                        disabled={isSubmittingFeedback}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleFeedbackSubmit}
                        disabled={isSubmittingFeedback}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-500/5 font-mono"
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send</span>
                        )}
                      </button>
                    </div>
                  </>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
