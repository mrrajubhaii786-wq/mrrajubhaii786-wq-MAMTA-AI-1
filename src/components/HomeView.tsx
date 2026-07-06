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
  Plus
} from 'lucide-react';
import { ChatMessage, MasterPlan } from '../types';
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
    <div className="space-y-2 text-sm leading-relaxed text-slate-300 font-sans">
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
    }, 30); // smooth word-by-word typing effect
    
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
  
  // Suggested templates (Phase 1)
  const SUGGESTED_PROMPTS = [
    { label: '/plan Ek modern resume website', sub: 'Generate master plan' },
    { label: '/wiki MAMTA AI System Architecture', sub: 'Query system architecture' }
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Phase 9: Subscribe to real-time chats from Firestore
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

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content: textToSend,
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
      // Insert custom local error if network fails
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

  // Triggers backend blueprint generation and redirects to Workspace IDE (Phase 1 Special Logic)
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
      
      // Auto-select generated plan and redirect user
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
    <div id="home_core_pane" className="flex flex-col items-center justify-between h-[calc(100vh-105px)] lg:h-[calc(100vh-50px)] max-w-3xl mx-auto w-full px-4 py-4 relative">
      
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono">MAMTA AI Core</span>
        </div>
        
        {messages.length > 0 && (
          <button 
            id="clear_chat_history_btn"
            onClick={handleClearHistory}
            className="p-1.5 rounded bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 transition-all cursor-pointer flex items-center gap-1.5 text-[10px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Conversation</span>
          </button>
        )}
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 w-full overflow-y-auto py-6 space-y-6 custom-scrollbar scroll-smooth pr-1">
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-6 select-none">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full -z-10" />
            </div>

            <div className="max-w-md space-y-1">
              <h2 className="text-lg font-bold text-slate-100 tracking-tight font-display">How can I help you today?</h2>
              <p className="text-xs text-slate-500">
                Ask a quick question, search OpenWiki, or generate a development plan.
              </p>
            </div>

            {/* suggested templates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left pt-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.label)}
                  className="p-3 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-emerald-500/30 hover:bg-slate-900/80 text-left transition-all duration-300 group cursor-pointer animate-[fadeIn_0.3s_ease]"
                >
                  <p className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                    {prompt.label}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{prompt.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Bubble Mapping */}
        {messages.map((msg, idx) => {
          const isAI = msg.role === 'model';
          const isLatestAI = isAI && msg.id === lastModelMsgId;
          const isStreamCompleted = completedStreams[msg.id];
          const shouldStream = isLatestAI && !isStreamCompleted;

          // Check if message content indicates planning or workspace redirects
          const contentLower = msg.content.toLowerCase();
          const hasPlanKeyword = contentLower.includes('plan') || contentLower.includes('blueprint') || contentLower.includes('roadmap') || contentLower.includes('task');
          const isExecutionBlockMsg = msg.content.includes('Execution is only available in Workspace');

          return (
            <div 
              key={msg.id || idx}
              className={`flex gap-4 max-w-2xl mx-auto ${isAI ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isAI 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-inner' 
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}>
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className={`p-4 rounded-2xl border ${
                  isAI
                    ? 'bg-slate-900/20 border-slate-900/40 text-slate-200'
                    : 'bg-slate-900/80 border-slate-900 text-slate-200 shadow-sm'
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

                {/* Inline Action Card if a Master Plan is referenced (Phase 6 Plan Transfer System) */}
                {isAI && hasPlanKeyword && !isExecutionBlockMsg && (
                  <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Send to Workspace Core</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Decompose this plan into real checklists and start crafting interactive code files in the IDE.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTriggerPlanCreation(messages[idx - 1]?.content || msg.content)}
                      className="shrink-0 w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/15 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Send to Workspace</span>
                    </button>
                  </div>
                )}

                {/* Inline Action Card if Execution Block is triggered (Phase 5) */}
                {isAI && isExecutionBlockMsg && (
                  <div className="border border-teal-500/20 bg-teal-500/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Access Workspace IDE</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Open the build core where you can run/build files, edit scripts, and view compiled web previews.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('workspace')}
                      className="shrink-0 w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/15 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/20 border border-slate-900/40 text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span className="text-xs font-medium tracking-wide animate-pulse">MAMTA AI processing stream...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Centered Input Area at Bottom (Phase 1) */}
      <div className="w-full pt-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) handleSendMessage(input);
          }}
          className="relative max-w-2xl mx-auto"
        >
          <input
            id="home_chat_input_field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="kuch bhi poochiye ya project suggest kijiye (e.g. '/plan smart weather widget')..."
            className="w-full bg-slate-900/80 border border-slate-900 hover:border-slate-800 focus:border-emerald-500/50 rounded-2xl pl-4 pr-12 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 shadow-xl transition-all duration-300"
          />
          <button
            id="home_chat_send_btn"
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-2 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-emerald-500 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
