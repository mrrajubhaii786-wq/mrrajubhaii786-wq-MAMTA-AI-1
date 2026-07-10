import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  Upload, 
  Play, 
  Square, 
  Volume2, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  Radio, 
  Sliders 
} from "lucide-react";

interface VoiceModel {
  id: string;
  name: string;
  description: string;
  status: string;
  path: string | null;
  size: string;
}

interface MamtaVoiceStudioProps {
  sessionId: string;
  isAdmin?: boolean;
}

export default function MamtaVoiceStudio({ sessionId, isAdmin = false }: MamtaVoiceStudioProps) {
  const [voices, setVoices] = useState<VoiceModel[]>([]);
  const [selectedRole, setSelectedRole] = useState<"male" | "female" | "narrator">("male");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [testText, setTestText] = useState("Hey everyone! This is our brand new native voice cloning engine running 100% locally. No APIs, no subscription fees, just absolute growth speed! 🚀");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preset clickbaity marketing hooks for instant testing
  const presets = [
    { label: "🚀 High-Energy Intro", text: "Warning! This single AI SaaS hack will 10x your monthly recurring revenue in exactly 24 hours. Stop scrolling and watch this right now! 🔥" },
    { label: "💡 Calm Informative", text: "How I launched an automated customer acquisition engine using clean local Node.js and SQLite. Let me break down the roadblocks for you." },
    { label: "🤯 Shock Reveal", text: "Wait... Did you know that 90% of SaaS founders are wasting money on expensive voice generator APIs? Here is the secret they do not want you to know!" }
  ];

  const fetchVoices = async () => {
    try {
      const url = isAdmin 
        ? "/api/voice/list" 
        : `/api/voice/list?sessionId=${encodeURIComponent(sessionId)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setVoices(data.list);
      }
    } catch (err) {
      console.error("Failed to load voice models:", err);
    }
  };

  useEffect(() => {
    fetchVoices();
    return () => {
      stopAudio();
    };
  }, [sessionId, isAdmin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a high-fidelity WAV or MP3 reference voice file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("voice", uploadFile);
    formData.append("role", selectedRole);
    if (!isAdmin) {
      formData.append("sessionId", sessionId);
    }

    try {
      const res = await fetch("/api/voice/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        if (isAdmin) {
          alert(`🎉 Successfully updated System Default voice and trained the baseline model for [${selectedRole.toUpperCase()}]!`);
        } else {
          alert(`🎉 Successfully uploaded custom reference voice and trained the clone model for [${selectedRole.toUpperCase()}]!`);
        }
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetchVoices();
      } else {
        alert("Upload error: " + data.error);
      }
    } catch (err: any) {
      alert("Failed to connect to voice server: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const generateSpeech = async () => {
    if (!testText.trim()) return;
    
    stopAudio();
    setIsGenerating(true);

    try {
      const bodyPayload: any = { text: testText };
      if (!isAdmin) {
        bodyPayload.sessionId = sessionId;
      }

      const res = await fetch("/api/voice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      if (!res.ok) {
        throw new Error(`Server returned error: ${res.statusText}`);
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => {
        setIsPlaying(true);
        setCurrentPlayingId("playground");
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        alert("Failed to decode synthesized voice stream.");
      };

      await audio.play();
    } catch (err: any) {
      alert("Speech generation failed: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const playRawReference = (path: string, id: string) => {
    stopAudio();
    
    const audio = new Audio(path);
    audioRef.current = audio;
    
    audio.onplay = () => {
      setIsPlaying(true);
      setCurrentPlayingId(id);
    };
    
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentPlayingId(null);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setCurrentPlayingId(null);
      alert("Preset voice preview file missing. Try uploading a custom reference WAV to enable playback!");
    };

    audio.play().catch(err => {
      console.warn("Reference play error:", err.message);
    });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentPlayingId(null);
  };

  return (
    <div id="mamta-voice-studio" className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none" />
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
              {isAdmin ? "Admin System Voice Customization Control" : "Mamta Voice AI Engine"}
            </h3>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            DEPLOYMENT: <span className="text-emerald-400 font-extrabold">{isAdmin ? "SYSTEM DEFAULT CORE" : "LOCAL UNLIMITED"}</span> • STATUS: <span className="text-amber-400 font-extrabold">{isAdmin ? "SYSTEM BASELINE MASTER" : "100% OPERATIONAL 🎙️"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
            {isAdmin ? "ADMIN CONTROL PRIVILEGES" : "ZERO API COST"}
          </span>
          <span className="text-[8px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">XTTS CLONE ACTIVE</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
        {isAdmin 
          ? "Configure the absolute system-wide default voices of Mamta AI. Uploading high-fidelity reference audio tracks (.wav/.mp3) here will permanently update the global defaults. These models will serve as the default baseline speaker voice whenever a regular user is generating automatic vertical marketing videos without uploading a personal clone sample."
          : "Say goodbye to costly, delayed speech synthesis! Mamta Voice AI clones real human vocals from simple reference wavs and renders them instantly. Modify speaker references below or test text-to-speech rendering in real-time."}
      </p>

      {/* THREE-COLUMN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* COLUMN 1: ACTIVE SPEAKERS LIBRARY */}
        <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-900 space-y-3.5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-3">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-200">ACTIVE VOICES</span>
            </div>

            <div className="space-y-3">
              {voices.map((v) => (
                <div key={v.id} className="bg-slate-900/30 border border-slate-900/80 rounded-lg p-3 space-y-2 flex flex-col justify-between hover:border-slate-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-200">{v.name}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">{v.description}</p>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider ${v.status.includes('Custom') ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25' : 'bg-slate-800/50 text-slate-500'}`}>
                      {v.status.includes('Custom') ? "CLONED" : "BUILT-IN"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900/40 text-[9px] font-mono text-slate-400">
                    <span>Size: <span className="text-slate-300 font-semibold">{v.size}</span></span>
                    {v.path ? (
                      <button
                        onClick={() => playRawReference(v.path!, v.id)}
                        disabled={isPlaying && currentPlayingId === v.id}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-40"
                      >
                        {isPlaying && currentPlayingId === v.id ? (
                          <>
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            <span>Playing...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Play Sample</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-600 italic">No Uploaded Reference</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-[9px] text-slate-500 bg-slate-900/20 p-2.5 rounded-lg border border-slate-900/40 leading-normal">
            💡 <span className="font-semibold text-slate-400">Voice Synthesis trigger:</span> High-energy texts with <span className="text-indigo-300 font-bold">🔥</span> trigger female voice; queries with <span className="text-indigo-300 font-bold">?</span> trigger storytelling narrator.
          </div>
        </div>

        {/* COLUMN 2: CUSTOM REFERENCE UPLOADER */}
        <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-900 space-y-4 shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-200">UPLOAD REFERENCE CLONE</span>
          </div>

          <form onSubmit={handleUpload} className="space-y-3.5">
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Select Speaker Model Target</label>
              <div className="grid grid-cols-3 gap-2">
                {(["male", "female", "narrator"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border font-sans capitalize transition-all cursor-pointer ${selectedRole === r ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-900/30 border-slate-900 text-slate-500 hover:text-slate-300'}`}
                  >
                    {r === "male" ? "Founder" : r === "female" ? "Girl AI" : "Narrator"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Audio Reference File (.wav)</label>
              <div className="border border-dashed border-slate-900 rounded-xl p-4 bg-slate-950/40 hover:bg-slate-950/80 transition-all text-center flex flex-col items-center justify-center relative cursor-pointer group">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".wav,.mp3" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Mic className="w-6 h-6 text-slate-600 group-hover:text-emerald-400 transition-colors mb-2" />
                {uploadFile ? (
                  <div className="space-y-0.5">
                    <p className="text-[10.5px] font-bold text-slate-200 truncate max-w-[200px]">{uploadFile.name}</p>
                    <p className="text-[8.5px] text-slate-500 font-mono">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">Drag or click to choose file</p>
                    <p className="text-[8px] text-slate-600 font-mono mt-0.5">Recommended: 5-10s WAV clip</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !uploadFile}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-[10.5px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Vocal Patterns...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Compile Custom Clone</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* COLUMN 3: TEXT-TO-SPEECH TESTER */}
        <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-900 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-200">CLONE SYNTH PLAYGROUND</span>
            </div>

            {/* Presets Chips */}
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestText(p.text)}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-900 text-[8px] font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Type any promotional text or tagline to clone human vocals..."
              rows={4}
              className="w-full bg-slate-900/60 border border-slate-900 rounded-lg p-2.5 text-[10.5px] text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none font-sans leading-normal placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-3.5">
            {/* Ambient Audio Wave Visualizer when playing */}
            {isPlaying && currentPlayingId === "playground" ? (
              <div className="bg-slate-900/40 border border-slate-900 p-2 rounded-lg flex items-center justify-between gap-3 animate-pulse">
                <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest font-bold">STREAMING ACTIVE</span>
                <div className="flex items-end gap-[2px] h-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => {
                    const randomDuration = 0.4 + Math.random() * 0.6;
                    return (
                      <div
                        key={bar}
                        style={{
                          animation: `wave 0.5s ease-in-out infinite alternate`,
                          animationDelay: `${bar * 0.05}s`,
                          animationDuration: `${randomDuration}s`
                        }}
                        className="w-[2px] bg-indigo-400 rounded-full h-1"
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/10 border border-slate-900/30 p-2 rounded-lg flex items-center justify-between text-slate-600 text-[8.5px] font-mono uppercase tracking-widest">
                <span>SPEAKER IDLE</span>
                <span>■ STOPPED</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={generateSpeech}
                disabled={isGenerating || !testText.trim()}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-slate-100 rounded-lg font-black text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-900/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cloning Vocals...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Synthesize Clone</span>
                  </>
                )}
              </button>

              {isPlaying && (
                <button
                  onClick={stopAudio}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 rounded-lg text-[10.5px] font-bold flex items-center justify-center cursor-pointer transition-all"
                  title="Stop Playback"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Tailwind Keyframes integration for Wave animation */}
      <style>{`
        @keyframes wave {
          0% { height: 4px; }
          100% { height: 16px; }
        }
      `}</style>
    </div>
  );
}
