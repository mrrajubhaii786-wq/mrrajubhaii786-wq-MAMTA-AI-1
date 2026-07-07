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
  CornerDownLeft
} from 'lucide-react';
import { ChatMessage } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastModelMsgId, setLastModelMsgId] = useState<string | null>(null);
  const [completedStreams, setCompletedStreams] = useState<Record<string, boolean>>({});
  
  // Suggested templates (ChatGPT clone starter templates)
  const SUGGESTED_PROMPTS = [
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
        
        setMessages(list);

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
      setMessages(data);
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

    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content: trimmedInput,
          pageSource: 'home'
        })
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // REST fallback sync if snapshot fails
      if (!db) {
        fetchChatsREST();
      }

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
      
      {/* Phase 1: Minimal Navbar Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-900/60 pb-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono flex items-center gap-1.5">
              Mamta AI V7.6
              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded-md lowercase normal-case">brain online</span>
            </h2>
          </div>
        </div>
        
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
                {isAI && hasPlanKeyword && !isExecutionBlockMsg && (
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

        {/* Phase 4: Typing Effect (Bouncy dots animation) */}
        {isThinking && (
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
        )}

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

    </div>
  );
}
