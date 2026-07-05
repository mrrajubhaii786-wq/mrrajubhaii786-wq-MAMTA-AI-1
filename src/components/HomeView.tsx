import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Briefcase, 
  Bot, 
  User, 
  Trash2, 
  ChevronRight, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ChatMessage, MasterPlan } from '../types';

interface HomeViewProps {
  sessionId: string;
  onSelectPlan: (planId: string) => void;
  setActiveTab: (tab: 'home' | 'workspace' | 'admin' | 'safedrop') => void;
}

// Simple custom Markdown renderer to avoid installing heavy external packages with peer conflicts
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-300">
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

export default function HomeView({ sessionId, onSelectPlan, setActiveTab }: HomeViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [activePlan, setActivePlan] = useState<MasterPlan | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const SUGGESTED_PROMPTS = [
    { label: 'Ek portfolio web app banao', sub: 'Responsive developer profile' },
    { label: 'Create a static Todo List', sub: 'Interactive task tracker UI' },
    { label: 'Ek elegant landing page plan karo', sub: 'Modern SaaS visual layout' },
    { label: 'Explain SafeDrop encryption', sub: 'Ask about credential safety' }
  ];

  useEffect(() => {
    fetchChats();
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/chats?sessionId=${sessionId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isThinking) return;

    setInput('');
    setIsThinking(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: 'temp_user',
      sessionId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      pageSource: 'home'
    };
    setMessages(prev => [...prev, tempUserMsg]);

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

      // Sync complete chat history from database
      fetchChats();

      // If user prompted to create/plan a project, trigger Master Plan generator automatically!
      if (data.suggestWorkspaceRedirect && data.suggestedAction === 'generate_plan') {
        generateMasterPlan(textToSend);
      }

    } catch (err: any) {
      console.error('Error sending message:', err);
      const errMsg: ChatMessage = {
        id: 'temp_err',
        sessionId,
        role: 'model',
        content: `❌ **Error**: ${err.message || 'MAMTA AI core was unable to process this request. Please make sure GEMINI_API_KEY is configured in SafeDrop.'}`,
        timestamp: new Date().toISOString(),
        pageSource: 'home'
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const generateMasterPlan = async (userIdea: string) => {
    setGeneratingPlan(true);
    setActivePlan(null);
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
      setActivePlan(data);
    } catch (err: any) {
      console.error('Failed to generate master plan:', err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all conversation history in this session?')) return;
    try {
      await fetch('/api/chats/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      setMessages([]);
      setActivePlan(null);
    } catch (err) {
      console.error('Failed to clear chats:', err);
    }
  };

  const handleSendToWorkspace = () => {
    if (!activePlan) return;
    onSelectPlan(activePlan.id);
    setActiveTab('workspace');
  };

  return (
    <div id="home_core_pane" className="flex flex-col lg:flex-row gap-4 h-full w-full">
      
      {/* LEFT COLUMN: Conversational Workspace Brain */}
      <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 lg:p-4 backdrop-blur-md shadow-2xl h-[calc(100vh-105px)] lg:h-[calc(100vh-75px)] min-h-[480px]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 tracking-tight">MAMTA AI Brain Core</h2>
              <p className="text-xs text-emerald-400 font-medium">Bilingual Assistant Mode Active</p>
            </div>
          </div>
          <button 
            id="clear_chat_history_btn"
            onClick={handleClearHistory}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chat message display area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-emerald-400 shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-medium text-slate-100 mb-2">Namaste! Swagat hai! 🙏</h3>
                <p className="text-sm text-slate-400">
                  I am **MAMTA AI**, your autonomous developer companion. Tell me what app or website you want to design, and I will write a comprehensive **Master Plan** and generate complete functional source code.
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl text-left mt-3">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.label)}
                    className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/80 text-left transition-all duration-200 group cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                      {prompt.label}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{prompt.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Messages mapping */}
          {messages.map((msg, i) => (
            <div 
              key={msg.id || i}
              className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-slate-800 border border-slate-700 text-slate-200' 
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`p-3 rounded-xl border ${
                msg.role === 'user'
                  ? 'bg-slate-800/50 border-slate-700/40 text-slate-200 rounded-tr-none'
                  : 'bg-slate-800/20 border-slate-800/60 text-slate-300 rounded-tl-none'
              } shadow-sm`}>
                <MarkdownText text={msg.content} />
                <span className="text-[9px] text-slate-500 block mt-1.5 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="w-7.5 h-7.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-xl bg-slate-800/20 border border-slate-800/60 text-slate-400 rounded-tl-none flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span className="text-xs font-medium tracking-wide animate-pulse">MAMTA AI soch rahi hai...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat input box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) handleSendMessage(input);
          }}
          className="flex items-center gap-1.5 mt-auto"
        >
          <input
            id="home_chat_input_field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Kuch bhi poochiye ya project plan kijiye (e.g., 'Ek smart portfolio banao')..."
            className="flex-1 bg-slate-800/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/50 rounded-lg px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
          />
          <button
            id="home_chat_send_btn"
            type="submit"
            disabled={!input.trim() || isThinking}
            className="p-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-900 font-semibold transition-all duration-200 shadow-md shadow-emerald-500/15 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* RIGHT COLUMN: Active Master Plan Showcase */}
      <div className="w-full lg:w-80 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 lg:p-4 backdrop-blur-md shadow-2xl h-auto lg:h-[calc(100vh-75px)]">
        
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <Briefcase className="w-4.5 h-4.5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-tight">Active Master Plan Engine</h3>
        </div>

        {generatingPlan && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Generating Master Plan...</p>
              <p className="text-[10px] text-slate-500 mt-1">Creating architecture roadmap using Gemini</p>
            </div>
          </div>
        )}

        {!generatingPlan && !activePlan && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 text-center px-4 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-700 stroke-[1.5]" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400">No active plan formulated</p>
              <p className="text-[10px] text-slate-500 leading-normal max-w-[200px] mx-auto">
                Ask MAMTA AI in the chat to structure an app, code, or landing page to watch the blueprint populate here!
              </p>
            </div>
          </div>
        )}

        {!generatingPlan && activePlan && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2.5 mb-2.5">
              <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Generated Blueprint</p>
              <h4 className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1">{activePlan.title}</h4>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 border border-slate-800/80 bg-slate-950/40 rounded-lg p-2.5 mb-3 text-xs custom-scrollbar">
              <MarkdownText text={activePlan.content} />
            </div>

            <button
              id="send_plan_to_workspace_btn"
              onClick={handleSendToWorkspace}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200 cursor-pointer group"
            >
              <span>Send to Workspace IDE</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
