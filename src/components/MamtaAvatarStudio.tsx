import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  Sparkles, 
  Smile, 
  RefreshCw, 
  Download, 
  CheckCircle, 
  Tv, 
  Flame, 
  HelpCircle,
  TrendingUp,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MamtaAvatarStudioProps {
  sessionId: string;
}

interface PresetAvatar {
  id: string;
  name: string;
  image: string;
  gender: 'male' | 'female';
  style: string;
}

const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'avatar_mamta',
    name: 'Mamta (Core AI Host)',
    image: '/assets/avatar_mamta.jpg',
    gender: 'female',
    style: 'Modern & Professional'
  },
  {
    id: 'avatar_raj',
    name: 'Raj (Tech Evangelist)',
    image: '/assets/avatar_raj.jpg',
    gender: 'male',
    style: 'Casual & Explanatory'
  },
  {
    id: 'avatar_sophia',
    name: 'Sophia (Global SaaS Specialist)',
    image: '/assets/avatar_sophia.jpg',
    gender: 'female',
    style: 'High-Energy Influencer'
  },
  {
    id: 'avatar_dev',
    name: 'Dev (Chief Architecture Officer)',
    image: '/assets/avatar_dev.jpg',
    gender: 'male',
    style: 'Direct & Serious'
  }
];

export default function MamtaAvatarStudio({ sessionId }: MamtaAvatarStudioProps) {
  // Main form states
  const [scriptText, setScriptText] = useState(
    "Welcome to Mamta AI! In exactly 60 seconds, we are going to build, deploy, and monetize a fully autonomous crypto portfolio tracker. Let's launch this live! 🔥🚀"
  );
  const [selectedAvatar, setSelectedAvatar] = useState<PresetAvatar>(PRESET_AVATARS[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isUsingCustomImage, setIsUsingCustomImage] = useState(false);

  // Generation status states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);

  // YouTube publisher states
  const [ytTitle, setYtTitle] = useState('Build a Portfolio Tracker in 1 Min with Mamta AI! 🤯🚀');
  const [ytDescription, setYtDescription] = useState(
    "Check out how Mamta Avatar AI completely designs, writes code, and deploys a fully functional SaaS application live on port 3000.\n\nSubscribe to the future of autonomous software engineers!"
  );
  const [ytPrivacy, setYtPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');
  const [ytTags, setYtTags] = useState('MamtaAI, SaaS, AI, CodeGen, SoftwareEngineer');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Real-time emotion analyzer helper
  const [emotionProfile, setEmotionProfile] = useState({
    emotion: 'normal',
    color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
    multiplier: 1.0
  });

  // Calculate emotion in real-time as user types script
  useEffect(() => {
    const text = scriptText.toLowerCase();
    if (scriptText.includes('🔥') || scriptText.includes('🚀') || text.includes('awesome') || text.includes('amazing') || text.includes('great') || text.includes('success')) {
      setEmotionProfile({
        emotion: 'excited',
        color: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
        multiplier: 1.2
      });
    } else if (scriptText.includes('?') || text.includes('how') || text.includes('why') || text.includes('wonder') || text.includes('think')) {
      setEmotionProfile({
        emotion: 'thinking',
        color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
        multiplier: 0.9
      });
    } else if (text.includes('warning') || text.includes('error') || text.includes('critical') || text.includes('important') || text.includes('serious')) {
      setEmotionProfile({
        emotion: 'serious',
        color: 'text-red-400 border-red-500/20 bg-red-500/10',
        multiplier: 0.95
      });
    } else if (text.includes('welcome') || text.includes('hello') || text.includes('friend') || text.includes('happy') || text.includes('love')) {
      setEmotionProfile({
        emotion: 'friendly',
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
        multiplier: 1.05
      });
    } else {
      setEmotionProfile({
        emotion: 'normal',
        color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10',
        multiplier: 1.0
      });
    }
  }, [scriptText]);

  const handleGenerateAvatarVideo = async () => {
    if (!scriptText.trim()) return;
    setIsGenerating(true);
    setRenderedVideoUrl(null);
    setUploadResult(null);
    setGenerationLogs([
      "⏳ [SYSTEM] Initializing Mamta Avatar AI Engine v10.0...",
      "🧠 [EMOTION_ENGINE] Analyzing vocal cadence & visual expression requirements...",
      `🎭 [EMOTION_ENGINE] Detected tone: [${emotionProfile.emotion.toUpperCase()}], Speech multiplier: ${emotionProfile.multiplier}x`
    ]);

    const addLog = (msg: string) => {
      setGenerationLogs(prev => [...prev, msg]);
    };

    try {
      // Step 1: Synthesizing deep clone voice track
      setTimeout(() => addLog("🎙️ [VOICE_ENGINE] Invoking Google TTS + Custom DSP clone matrices..."), 1200);
      
      // Step 2: Preparing visual face mapping
      const faceImage = isUsingCustomImage ? customImageUrl : selectedAvatar.image;
      setTimeout(() => addLog(`👤 [AVATAR_ENGINE] Loading source face coordinates for: ${isUsingCustomImage ? 'Custom URL' : selectedAvatar.name}`), 2500);

      // Step 3: Triggering lip-sync video compiler
      setTimeout(() => addLog("👄 [LIP_SYNC_ENGINE] Preparing Wav2Lip pixel sync pipeline, combining audio harmonics with mouth coordinates..."), 4000);
      setTimeout(() => addLog("🎬 [VIDEO_GENERATOR] Stitching vertical frame sequences & compiling standard H.264 video container..."), 5800);

      // Actual backend API call
      const res = await fetch('/api/avatar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scriptText,
          avatarImage: faceImage,
          sessionId
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Finish rendering animation
      setTimeout(() => {
        addLog("✅ [AVATAR_ENGINE] Talking video compiled successfully! Saving master output file...");
        addLog(`🎉 [SYSTEM] Rendered video is online! Saved to path: ${data.videoUrl}`);
        setRenderedVideoUrl(data.videoUrl);
        setVideoMetadata(data);
        setIsGenerating(false);
      }, 7500);

    } catch (err: any) {
      addLog(`❌ [ERROR] Synthesis pipeline crashed: ${err.message}`);
      setIsGenerating(false);
    }
  };

  const handlePublishToYouTube = async () => {
    if (!videoMetadata || !videoMetadata.videoPath) return;
    setIsUploading(true);
    setUploadResult(null);

    try {
      const res = await fetch('/api/avatar/youtube-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoPath: videoMetadata.videoPath,
          title: ytTitle,
          description: ytDescription,
          tags: ytTags.split(',').map(t => t.trim()),
          privacyStatus: ytPrivacy,
          sessionId
        })
      });

      const data = await res.json();
      setUploadResult(data);
    } catch (err: any) {
      setUploadResult({
        success: false,
        message: `API upload connection error: ${err.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div id="mamta_avatar_studio" className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-violet-500/10 to-transparent pointer-events-none" />
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              MAMTA AVATAR AI STUDIO
              <span className="text-[8px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">AUTONOMOUS VIDEO GENERATOR</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Synthesize high-fidelity talking presenter videos, customize emotional tones & auto-publish</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Form Inputs (7 Cols) */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Avatar Selector Presets */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
              1. Choose Presenter Face (Avatar)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    setSelectedAvatar(av);
                    setIsUsingCustomImage(false);
                  }}
                  className={`bg-slate-950/60 border rounded-xl p-2.5 text-left transition-all relative overflow-hidden hover:border-violet-500/40 group ${
                    !isUsingCustomImage && selectedAvatar.id === av.id 
                      ? 'border-violet-500 ring-1 ring-violet-500/20 bg-slate-950' 
                      : 'border-slate-900'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden mb-2 relative mx-auto">
                    {/* Placeholder colored canvas if asset is missing */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      av.gender === 'female' ? 'from-pink-500/20 to-violet-500/20' : 'from-blue-500/20 to-teal-500/20'
                    } flex items-center justify-center font-bold text-slate-400 text-sm`}>
                      {av.name.charAt(0)}
                    </div>
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-200 truncate text-center">{av.name.split(' ')[0]}</h4>
                  <p className="text-[8px] text-slate-500 font-mono truncate text-center">{av.style}</p>
                  
                  {!isUsingCustomImage && selectedAvatar.id === av.id && (
                    <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-violet-500 rounded-full flex items-center justify-center text-white">
                      <Check className="w-2 h-2" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom URL Input Accordion */}
            <div className="mt-3 bg-slate-950/40 border border-slate-900/60 rounded-xl p-3 space-y-2">
              <button
                onClick={() => setIsUsingCustomImage(!isUsingCustomImage)}
                className="text-[9px] font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-all"
              >
                <span>{isUsingCustomImage ? '✓ Use Preset Presenters' : '✏️ Use Custom URL / Path instead'}</span>
              </button>
              
              {isUsingCustomImage && (
                <input
                  type="text"
                  placeholder="Enter custom image path (e.g. /my_avatar.png or https://...)"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-[10px] text-slate-200 focus:outline-none focus:border-violet-500"
                />
              )}
            </div>
          </div>

          {/* Script input and emotion output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                2. Write spoken script text
              </label>
              
              {/* Emotion Profile pill */}
              <div className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${emotionProfile.color} transition-all duration-300 flex items-center gap-1`}>
                <Smile className="w-2.5 h-2.5" />
                <span>EMOTION: {emotionProfile.emotion.toUpperCase()} ({emotionProfile.multiplier}x speed)</span>
              </div>
            </div>

            <textarea
              rows={4}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="What should the avatar say? Type words here. Insert 🔥 or 🚀 to auto-trigger 'excited' face emotion and speech cadence..."
              className="w-full bg-slate-950/80 border border-slate-900 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 placeholder-slate-600 resize-none leading-relaxed"
            />
            <p className="text-[9px] text-slate-500 font-mono mt-1 leading-normal">
              💡 **Tip:** Use exclamation points (!) and question marks (?) to dynamically alter the presenter's pitch, speed, and expression.
            </p>
          </div>

          {/* Build triggers */}
          <button
            onClick={handleGenerateAvatarVideo}
            disabled={isGenerating || !scriptText.trim()}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>SYNTHESIZING TALKING AVATAR VIDEO (ESTIMATING ~15s)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-violet-300" />
                <span>GENERATE LIP-SYNCED AVATAR VIDEO 🎥</span>
              </>
            )}
          </button>

          {/* REAL-TIME TERMINAL PROCESSOR LOGS */}
          <div className="bg-slate-950/90 border border-slate-900/80 rounded-xl p-3.5 space-y-1.5 font-mono text-[9px] text-slate-400">
            <p className="text-[10px] text-slate-500 font-bold border-b border-slate-900/60 pb-1 mb-2">📟 LIVE SYNTHESIS TERMINAL LOGS</p>
            {generationLogs.length === 0 ? (
              <p className="text-slate-600 italic">No operations active. Launch the synthesis pipeline above.</p>
            ) : (
              <div className="max-h-28 overflow-y-auto space-y-1 custom-scrollbar">
                {generationLogs.map((log, idx) => (
                  <p 
                    key={idx} 
                    className={`${
                      log.startsWith('✅') ? 'text-emerald-400 font-bold' : 
                      log.startsWith('❌') ? 'text-red-400 font-bold' : 
                      log.startsWith('🎉') ? 'text-violet-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT PANEL: Output Video & YouTube publisher (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-4">
          
          {/* Dynamic Iframe / Video Box */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-violet-400" />
              3. Compiled Presenter Preview
            </h4>
            
            <div className="aspect-[9/16] max-h-80 mx-auto w-full max-w-[210px] rounded-2xl border border-slate-900 bg-slate-950 relative flex flex-col items-center justify-center overflow-hidden group">
              <AnimatePresence mode="wait">
                {renderedVideoUrl ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <video
                      src={renderedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Glowing dynamic floating emotion badge inside preview */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 border border-violet-500/20 rounded px-2 py-0.5 text-[8px] font-mono font-bold text-violet-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                      {emotionProfile.emotion.toUpperCase()}
                    </div>

                    {/* Download direct overlay trigger */}
                    <a
                      href={renderedVideoUrl}
                      download={`mamta_avatar_${Date.now()}.mp4`}
                      className="absolute bottom-3 right-3 bg-violet-600 hover:bg-violet-500 text-white p-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Download MP4 Video"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-4 space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Synthesizer Idle</p>
                      <p className="text-[8px] text-slate-500 font-mono mt-0.5 max-w-[150px] mx-auto">Video output will play here automatically once generated.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ONE-CLICK YOUTUBE CREATOR BOT */}
          <div className="border-t border-slate-900/60 pt-4 space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-red-500" />
              4. YouTube Creator Auto-Post
            </h4>

            {renderedVideoUrl ? (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">YouTube Title</label>
                  <input
                    type="text"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">Privacy</label>
                    <select
                      value={ytPrivacy}
                      onChange={(e: any) => setYtPrivacy(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                    >
                      <option value="public">🌐 Public</option>
                      <option value="unlisted">🔗 Unlisted</option>
                      <option value="private">🔒 Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">Hashtags</label>
                    <input
                      type="text"
                      value={ytTags}
                      onChange={(e) => setYtTags(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePublishToYouTube}
                  disabled={isUploading}
                  className="w-full py-2 rounded-lg text-[10px] font-bold bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>UPLOADING TO YOUTUBE SHORTS...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>PUBLISH TO MY YOUTUBE CHANNEL 🚀</span>
                    </>
                  )}
                </button>

                {/* Upload Results feedback */}
                {uploadResult && (
                  <div className={`p-2.5 rounded-lg border text-[9px] font-mono leading-normal ${
                    uploadResult.success 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    <div className="flex gap-1.5 items-start">
                      {uploadResult.success ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                      <div>
                        <p className="font-bold">{uploadResult.success ? 'Upload Success!' : 'Upload Failed'}</p>
                        <p className="mt-0.5 text-[8px] opacity-85">{uploadResult.message}</p>
                        {uploadResult.videoUrl && (
                          <a 
                            href={uploadResult.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-1 text-[8px] font-bold text-violet-400 underline block"
                          >
                            🔗 View Video Link: {uploadResult.videoUrl}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/40 rounded-xl p-3 text-center border border-slate-900/40">
                <p className="text-[9px] text-slate-600 italic">Generate your talking avatar video first to unlock automated YouTube upload options.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
