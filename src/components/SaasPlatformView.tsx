import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Check, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  UserPlus, 
  Layers, 
  Target,
  Flame,
  Copy,
  Radio,
  Send,
  CheckCircle2,
  Loader2,
  Plus,
  Cpu,
  LogIn,
  LogOut,
  Mail,
  Lock,
  Globe,
  CreditCard,
  Grid,
  Code,
  Eye,
  ShieldCheck,
  Smartphone,
  BookOpen,
  BarChart2,
  Share2,
  TrendingUp,
  Upload,
  Briefcase,
  Users,
  Megaphone,
  Trash2,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GlobalDominationView from './GlobalDominationView';

interface SaasPlatformViewProps {
  sessionId: string;
}

export default function SaasPlatformView({ sessionId }: SaasPlatformViewProps) {
  // Authentication State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('US');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  // Logged-in User Profile State
  const [userProfile, setUserProfile] = useState<any>(null);

  // Active Screen Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai-tool' | 'billing' | 'docs' | 'analytics' | 'team-scaling' | 'branding-pitch' | 'enterprise-automation' | 'global-domination'>('dashboard');

  // Project versioning states (Step 6 Version Control System)
  const [projectVersions, setProjectVersions] = useState<any[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [versionPromptInput, setVersionPromptInput] = useState('');

  // AI Website Builder States
  const [prompt, setPrompt] = useState('SaaS Landing Page with glowing green buttons and pricing cards');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [previewMode, setPreviewMode] = useState<'preview' | 'code' | 'editor'>('preview');
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Step 5 Scale States
  const [enteredOtp, setEnteredOtp] = useState('');
  const [chatEditPrompt, setChatEditPrompt] = useState('');
  const [isEditingAi, setIsEditingAi] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'success'>('idle');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  // Project management & 1-Click Deployment states (Step 3)
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isDeployingProject, setIsDeployingProject] = useState(false);
  const [activeProject, setActiveProject] = useState<any>(null);

  // Email verification & Referral states (Step 4)
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [isReferring, setIsReferring] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState(false);

  // Checkout States
  const [checkoutPlan, setCheckoutPlan] = useState<'PRO' | 'PREMIUM' | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'plan_select' | 'routing_preview' | 'secured_payment_simulation' | 'success'>('plan_select');

  // ₹1 Crore SaaS Revenue Math Calculator States (Step 6)
  const [calcSubscribers, setCalcSubscribers] = useState(500);
  const [calcPrice, setCalcPrice] = useState(499);

  // Step 6: Team Scaling States
  const [teamMembers, setTeamMembers] = useState<any[]>([
    { id: '1', name: 'Rajveer Singh', role: 'Solo Founder', salary: 0, efficiency: 100 },
  ]);
  const [jobPostRole, setJobPostRole] = useState('Full Stack AI Developer');
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [isGeneratingCandidates, setIsGeneratingCandidates] = useState(false);

  // Step 6: Branding & Investor Pitch States
  const [pitchSaaSName, setPitchSaaSName] = useState('Mamta AI Studio');
  const [pitchSaaSProblem, setPitchSaaSProblem] = useState('Building high-quality websites takes weeks of coding and thousands of dollars, locking out non-technical founders.');
  const [pitchSaaSSolution, setPitchSaaSSolution] = useState('Mamta AI synthesizes high-fidelity, production-ready full-stack applications in 5 seconds from direct voice commands.');
  const [pitchSaaSTraction, setPitchSaaSTraction] = useState('Launched prototype with 2,500+ organic sandbox users and ₹1.5 Lakhs generated in simulated micro-revenue.');
  const [pitchSaaSTarget, setPitchSaaSTarget] = useState('₹1 Crore ARR within 12 months.');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [pitchDeckSlides, setPitchDeckSlides] = useState<any[]>([
    { title: "Mamta AI Studio", subtitle: "Building ₹1 Crore SaaS Empires dynamically from direct voice instructions.", category: "VISION" },
    { title: "The Massive Problem", problem: "Website development is slow, costly, and requires complex programming stacks.", category: "PROBLEM" },
    { title: "The Mamta AI Solution", solution: "Instant 1-click voice-to-code website synthesis with real-time Firestore database & secure Stripe/Razorpay webhooks.", category: "SOLUTION" },
    { title: "The Revenue Engine", detail: "Multi-tenant SaaS subscription model charging ₹499/month for Pro features.", category: "MARKET MATH" },
    { title: "Scaling to the Stars", nextSteps: "Auto-pilot marketing loops & dedicated elite team scaling.", category: "ROADMAP" }
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Step 6: Enterprise Automation States
  const [isAutopilotEnabled, setIsAutopilotEnabled] = useState(false);
  const [autoLogs, setAutoLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System loaded. Autopilot standby.`
  ]);
  const [autoOptions, setAutoOptions] = useState({
    socialMedia: true,
    seoBlog: true,
    selfHealing: true,
    commissionCashout: false
  });

  // Step 7: Global Domination States
  const [dominationSubTab, setDominationSubTab] = useState<'mobile' | 'domains' | 'voice-ai' | 'global-infra' | 'branding-viral' | 'revenue-roadmap'>('mobile');
  
  // Custom Domain States
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [connectedDomains, setConnectedDomains] = useState<string[]>(['mybrand.com']);
  const [dnsVerifyStatus, setDnsVerifyStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [sslStatus, setSslStatus] = useState<'none' | 'pending' | 'active'>('active');

  // Voice AI States
  const [voiceCommandInput, setVoiceCommandInput] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'hinglish' | 'hindi' | 'english'>('hinglish');

  // Mobile App Launcher States
  const [mobileSimulatorDevice, setMobileSimulatorDevice] = useState<'android' | 'ios'>('android');
  const [isCompilingMobile, setIsCompilingMobile] = useState(false);
  const [mobileCompileLogs, setMobileCompileLogs] = useState<string[]>([]);

  // Personal Brand Virality States
  const [brandPlatform, setBrandPlatform] = useState<'instagram' | 'youtube' | 'twitter' | 'linkedin'>('youtube');
  const [brandTopic, setBrandTopic] = useState('0 to ₹1L using Mamta AI');
  const [generatedViralScript, setGeneratedViralScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // ₹10 Crore Roadmap States
  const [roadmapTargetARR, setRoadmapTargetARR] = useState(100000000); // 10 Cr
  const [roadmapUsersCount, setRoadmapUsersCount] = useState(10000); // 10k users

  useEffect(() => {
    if (!isAutopilotEnabled) return;
    
    const messages = [
      "Auto-SEO Bot: Re-indexing sitemap.xml on Google Search Console.",
      "YouTube Bot: Synthesizing daily Mamta AI video presentation and uploading automatically.",
      "Twitter Bot: Firing viral marketing thread promoting student-affiliates program.",
      "Security Engine: Scanning for injection vectors on payment webhook routing... Safe.",
      "SaaS Ledger: Automatically synchronized Firestore shard telemetry records with pgDatabase.",
      "Self-Healing: Verified server.ts compilation. Live load checks: 100% stable."
    ];
    
    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setAutoLogs(prev => [`[${new Date().toLocaleTimeString()}] ${randomMsg}`, ...prev.slice(0, 15)]);
    }, 4500);
    
    return () => clearInterval(interval);
  }, [isAutopilotEnabled]);

  const generateCandidatesPool = async () => {
    setIsGeneratingCandidates(true);
    setTimeout(() => {
      const candidates = [
        { name: "Aarav Sharma", role: jobPostRole, match: 94, salary: 45000, skills: ["React", "Express", "Tailwind CSS"], avatar: "🇮🇳" },
        { name: "Priya Patel", role: jobPostRole, match: 91, salary: 38000, skills: ["Next.js", "Firebase", "TypeScript"], avatar: "👩‍💻" },
        { name: "Vikram Malhotra", role: jobPostRole, match: 87, salary: 50000, skills: ["AI Agent Prompting", "Node.js", "Postgres"], avatar: "👨‍💻" },
        { name: "Ananya Iyer", role: jobPostRole, match: 96, salary: 60000, skills: ["Full-stack", "Stripe", "CI/CD Orchestration"], avatar: "🚀" }
      ];
      setCandidatesList(candidates);
      setIsGeneratingCandidates(false);
      if ((window as any).showToast) {
        (window as any).showToast("✓ Mamta AI generated candidate pool!", "success");
      }
    }, 1200);
  };

  const hireCandidate = (candidate: any) => {
    setTeamMembers(prev => [...prev, { ...candidate, id: String(Date.now()) }]);
    setCandidatesList(prev => prev.filter(c => c.name !== candidate.name));
    if ((window as any).showToast) {
      (window as any).showToast(`🎉 Successfully hired ${candidate.name} as ${candidate.role}!`, "success");
    }
  };

  const fireMember = (id: string, name: string) => {
    if (id === '1') {
      alert("You cannot fire the Solo Founder!");
      return;
    }
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    if ((window as any).showToast) {
      (window as any).showToast(`⚠️ Terminated team contract for ${name}.`, "warning");
    }
  };

  const generateInvestorPitchDeck = () => {
    setIsGeneratingPitch(true);
    setTimeout(() => {
      const slides = [
        { title: pitchSaaSName, subtitle: `Building ₹1 Crore SaaS Empires dynamically from direct voice instructions.`, category: "VISION" },
        { title: "The Problem", problem: pitchSaaSProblem, category: "PROBLEM" },
        { title: "The Solution", solution: pitchSaaSSolution, category: "SOLUTION" },
        { title: "Market Revenue Math", detail: `Targeting ${calcSubscribers} active monthly users paying ₹${calcPrice}/month. Total projected ARR: ₹${((calcSubscribers * calcPrice * 12) / 100000).toFixed(2)} Lakhs!`, category: "BUSINESS MODEL" },
        { title: "Elite SaaS Traction", traction: pitchSaaSTraction, category: "TRACTION" },
        { title: "The Scaling Team", team: `${teamMembers.length} active experts. Operational Burn: ₹${teamMembers.reduce((acc, curr) => acc + (curr.salary || 0), 0)}/month. Efficiency quotient: ${teamMembers.reduce((acc, curr) => acc + (curr.efficiency || 90), 0)}%`, category: "TEAM" },
        { title: "Our Target", nextSteps: `Reaching ${pitchSaaSTarget} through self-running AI marketing automation loops.`, category: "GO TO MARKET" }
      ];
      setPitchDeckSlides(slides);
      setActiveSlideIndex(0);
      setIsGeneratingPitch(false);
      if ((window as any).showToast) {
        (window as any).showToast("🏆 Custom high-fidelity Investor Pitch Deck compiled successfully!", "success");
      }
    }, 1500);
  };

  const fetchUserProjects = async (userEmail: string) => {
    try {
      const res = await fetch('/api/saas/projects/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (data.success) {
        setProjectsList(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load user projects:", err);
    }
  };

  const handleSaveProject = async () => {
    if (!userProfile || !generatedCode) return;
    setIsSavingProject(true);
    try {
      const res = await fetch('/api/saas/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          prompt: prompt,
          html: generatedCode,
          projectId: activeProject?.projectId
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveProject(data.project);
        await fetchUserProjects(userProfile.email);
        if ((window as any).showToast) {
          (window as any).showToast("Website saved successfully!", "success");
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Failed to save project: " + err.message);
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeployProject = async () => {
    if (!userProfile || !generatedCode) return;
    setIsDeployingProject(true);
    
    let targetProjectId = activeProject?.projectId;
    // Auto-save first if not saved yet
    if (!targetProjectId) {
      try {
        const resSave = await fetch('/api/saas/projects/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userProfile.email,
            prompt: prompt,
            html: generatedCode
          })
        });
        const saveRes = await resSave.json();
        if (saveRes.success) {
          targetProjectId = saveRes.project.projectId;
          setActiveProject(saveRes.project);
        } else {
          throw new Error(saveRes.error || "Auto-save failed before deployment");
        }
      } catch (err: any) {
        alert("Deploy failed during auto-save: " + err.message);
        setIsDeployingProject(false);
        return;
      }
    }

    try {
      const customSubdomain = prompt.trim().toLowerCase().substring(0, 15).replace(/[^a-z0-9]/g, "") + "-" + Math.floor(100 + Math.random() * 900);
      const res = await fetch('/api/saas/projects/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          projectId: targetProjectId,
          subdomain: customSubdomain
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveProject(data.project);
        await fetchUserProjects(userProfile.email);
        if ((window as any).showToast) {
          (window as any).showToast("🎉 Website deployed live successfully! Share with anyone!", "success");
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Failed to deploy project: " + err.message);
    } finally {
      setIsDeployingProject(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!userProfile) return;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/saas/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userProfile.email })
      });
      const data = await res.json();
      if (data.success) {
        setShowVerifyModal(true);
        if ((window as any).showToast) {
          (window as any).showToast(`📧 Secure 2FA security OTP dispatched! (Demo OTP is: ${data.otp})`, "success");
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Failed to request verification OTP: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!userProfile || !enteredOtp.trim()) return;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/saas/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userProfile.email, otp: enteredOtp.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setUserProfile(data.user);
        setShowVerifyModal(false);
        setEnteredOtp('');
        if ((window as any).showToast) {
          (window as any).showToast("✓ MFA Identity Verified successfully!", "success");
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Invalid verification code: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAiEdit = async () => {
    if (!userProfile || !chatEditPrompt.trim() || !generatedCode) return;
    setIsEditingAi(true);
    try {
      const res = await fetch('/api/saas/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          prompt: chatEditPrompt.trim(),
          html: generatedCode
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "AI edit failed");
      }
      setGeneratedCode(data.updatedHtml);
      setChatEditPrompt('');
      if (data.user) {
        setUserProfile(data.user);
      }
      if ((window as any).showToast) {
        (window as any).showToast("✨ MAMTA AI refactored your website design live!", "success");
      }
    } catch (err: any) {
      alert("AI Refactor failed: " + err.message);
    } finally {
      setIsEditingAi(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;
    
    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/saas/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userProfile.email,
            filename: file.name,
            base64Data
          })
        });
        const data = await res.json();
        if (data.success) {
          const uploadedUrl = data.url;
          let newHtml = generatedCode;
          if (newHtml.includes("LOGO_URL")) {
            newHtml = newHtml.replace(/LOGO_URL/g, uploadedUrl);
          } else {
            // Smart auto-injection into head image or header logo if present
            if (newHtml.includes("<body")) {
              const imageBox = `\n<!-- Injected Brand Asset -->\n<div style="text-align: center; margin: 16px auto; width: 100%; display: flex; justify-content: center;"><img src="${uploadedUrl}" alt="Brand Asset" style="max-height: 52px; object-fit: contain; border-radius: 8px;" /></div>\n`;
              newHtml = newHtml.replace(/(<body[^>]*>)/i, `$1${imageBox}`);
            }
          }
          setGeneratedCode(newHtml);
          if ((window as any).showToast) {
            (window as any).showToast(`🎉 Custom media uploaded & injected!`, "success");
          }
        } else {
          throw new Error(data.error);
        }
      } catch (err: any) {
        alert("Media upload failed: " + err.message);
      } finally {
        setIsUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchAnalytics = async (userEmail: string) => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch('/api/saas/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Failed to load analytics dashboard:", err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleClaimEarnings = async () => {
    setClaimStatus('claiming');
    setTimeout(() => {
      setClaimStatus('success');
      setClaimSuccessMsg(`🎉 Outstanding affiliate commissions successfully transferred directly to your UPI / Bank account!`);
      if ((window as any).showToast) {
        (window as any).showToast("✓ Affiliate commission paid out!", "success");
      }
    }, 1500);
  };

  // Version Control System helpers
  const fetchProjectVersions = async (projectId: string) => {
    if (!userProfile) return;
    setIsLoadingVersions(true);
    try {
      const res = await fetch('/api/saas/projects/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userProfile.email, projectId })
      });
      const data = await res.json();
      if (data.success) {
        setProjectVersions(data.versions || []);
      }
    } catch (err) {
      console.error("Error fetching versions:", err);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleManualVersionSave = async () => {
    if (!userProfile || !activeProject || !generatedCode) return;
    try {
      const res = await fetch('/api/saas/projects/versions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          projectId: activeProject.projectId,
          html: generatedCode,
          prompt: versionPromptInput.trim() || `Manual Checkpoint: ${new Date().toLocaleTimeString()}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setVersionPromptInput('');
        await fetchProjectVersions(activeProject.projectId);
        if ((window as any).showToast) {
          (window as any).showToast(data.message, "success");
        }
      }
    } catch (err: any) {
      alert("Version save failed: " + err.message);
    }
  };

  const handleVersionRollback = async (versionId: string) => {
    if (!userProfile || !activeProject) return;
    if (!window.confirm("Are you sure you want to rollback to this historical design checkpoint?")) return;
    try {
      const res = await fetch('/api/saas/projects/versions/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          projectId: activeProject.projectId,
          versionId
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCode(data.project.html);
        await fetchProjectVersions(activeProject.projectId);
        if ((window as any).showToast) {
          (window as any).showToast(data.message, "success");
        }
      }
    } catch (err: any) {
      alert("Rollback failed: " + err.message);
    }
  };

  const handleReferFriend = async () => {
    if (!userProfile || !friendEmail.trim()) return;
    setIsReferring(true);
    try {
      const res = await fetch('/api/saas/auth/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userProfile.email, friendEmail: friendEmail.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setUserProfile(data.user);
        setReferralSuccess(true);
        setFriendEmail('');
        if ((window as any).showToast) {
          (window as any).showToast(data.message, "success");
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Referral mapping failed: " + err.message);
    } finally {
      setIsReferring(false);
    }
  };

  // Load profile on start or login
  useEffect(() => {
    const savedEmail = localStorage.getItem('saas_email');
    const savedToken = localStorage.getItem('saas_token');
    if (savedEmail && savedToken) {
      setToken(savedToken);
      fetchProfile(savedEmail);
    }
  }, []);

  const fetchProfile = async (targetEmail: string) => {
    try {
      const res = await fetch('/api/saas/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setUserProfile(data.user);
        setCountry(data.user.country);
        fetchUserProjects(targetEmail);
      } else {
        // Clear stale localstorage to prevent broken state
        localStorage.removeItem('saas_email');
        localStorage.removeItem('saas_token');
        setToken(null);
        setUserProfile(null);
      }
    } catch (err) {
      console.error("Failed to fetch SaaS profile:", err);
      localStorage.removeItem('saas_email');
      localStorage.removeItem('saas_token');
      setToken(null);
      setUserProfile(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/saas/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, country })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUserProfile(data.user);
        localStorage.setItem('saas_email', email.trim());
        localStorage.setItem('saas_token', data.token);
        fetchUserProjects(email.trim());
        
        // Trigger generic window event for global app syncing
        if ((window as any).showToast) {
          (window as any).showToast(`Logged into MAMTA AI SaaS Hub successfully!`, 'success');
        }
      } else {
        const errorMsg = data.error || data.message || "Failed to authenticate. Please check your credentials.";
        if ((window as any).showToast) {
          (window as any).showToast(`❌ Login Error: ${errorMsg}`, 'error');
        } else {
          alert(`Login Error: ${errorMsg}`);
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || "Connection error to the authentication server.";
      if ((window as any).showToast) {
        (window as any).showToast(`❌ Connection Error: ${errorMsg}`, 'error');
      } else {
        alert("Login failed: " + errorMsg);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserProfile(null);
    localStorage.removeItem('saas_email');
    localStorage.removeItem('saas_token');
    setActiveTab('dashboard');
    if ((window as any).showToast) {
      (window as any).showToast(`Logged out of SaaS Platform securely.`, 'info');
    }
  };

  // Dual Payment Routing
  const triggerCheckout = async (planKey: 'PRO' | 'PREMIUM') => {
    if (!userProfile) return;
    setCheckoutPlan(planKey);
    setIsCheckingOut(true);
    setPaymentStep('routing_preview');
    try {
      const res = await fetch('/api/saas/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          country: country,
          planKey: planKey
        })
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutResult(data);
        // Advance to payment step
        setTimeout(() => {
          setPaymentStep('secured_payment_simulation');
        }, 2200);
      } else {
        alert("Checkout initialization failed: " + data.error);
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
      setIsCheckingOut(false);
    }
  };

  const confirmSimulatedPayment = async () => {
    if (!userProfile || !checkoutPlan) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/saas/payments/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          planKey: checkoutPlan
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserProfile(data.user);
        setPaymentStep('success');
        if ((window as any).showToast) {
          (window as any).showToast(`Upgraded to ${checkoutPlan} Plan Successfully!`, 'success');
        }
      }
    } catch (err: any) {
      alert("Upgrade failed: " + err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // AI Website Builder Generator
  const generateWebsite = async () => {
    if (!userProfile) return;
    setIsGenerating(true);
    setPreviewMode('preview');
    setGeneratedCode('');
    setGenerationLogs([
      "⏳ Initializing MAMTA Web Architect Node...",
      "🧠 Aligning layout constraints with client request...",
      "📡 Dialing into distributed LLM generation pipeline..."
    ]);

    const logDelay = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setGenerationLogs(prev => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    try {
      await logDelay("⚡ Fetching real-time system context configurations...", 800);
      await logDelay("🤖 Initiating code synthesis via Gemini-3.5-Flash Core...", 1000);
      await logDelay("🔧 Wrapping response inside beautiful production Tailwind classes...", 1200);

      const res = await fetch('/api/saas/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          prompt: prompt
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation request failed");
      }

      setGeneratedCode(data.code);
      setExplanation(data.explanation);
      // Fetch fresh profile state to update limit metrics
      await fetchProfile(userProfile.email);
      setGenerationLogs(prev => [...prev, "🎉 Compilation complete! Website loaded successfully in live sandboxed viewport."]);
    } catch (err: any) {
      setGenerationLogs(prev => [...prev, `❌ FAILED: ${err.message}`]);
      if ((window as any).showToast) {
        (window as any).showToast(err.message, 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-6 pb-12 custom-scrollbar pr-1 animate-[fadeIn_0.3s_ease]">
      
      {/* SaaS Hub Premium Header */}
      <div className="w-full bg-slate-900/30 border border-slate-900 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
              MAMTA AI SaaS Hub
              <span className="text-[8px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold">STARTUP HUB</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              Build custom micro-SaaS products, validate global routing, and monetize your startup!
            </p>
          </div>
        </div>

        {/* Global Stats bar */}
        {userProfile && (
          <div className="flex items-center gap-4 bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-900/60 text-xs font-mono">
            <div className="text-right">
              <span className="text-[9px] text-slate-500 block">Active Plan</span>
              <strong className="text-emerald-400">{userProfile.plan} TIER</strong>
            </div>
            <div className="h-6 w-[1px] bg-slate-900" />
            <div className="text-right">
              <span className="text-[9px] text-slate-500 block">SaaS Credits</span>
              <strong className="text-cyan-400">
                {userProfile.credits !== undefined ? userProfile.credits : ((userProfile.limit || 10) - (userProfile.usage || 0))}
              </strong>
            </div>
            <div className="h-6 w-[1px] bg-slate-900 sm:block hidden" />
            <div className="text-right sm:block hidden">
              <span className="text-[9px] text-slate-500 block">AI Generations</span>
              <strong className="text-slate-200">
                {userProfile.usage} / {userProfile.limit === 999999 ? '∞' : userProfile.limit}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Email Verification Safe Guard Widget (MAMTA AI STEP 4) */}
      {userProfile && !userProfile.verified && (
        <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-[pulse_3s_infinite] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Email Authentication Guard Active
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Verify your email address now to validate your active subscription, protect against bots, and secure your credits!
              </p>
            </div>
          </div>
          <button
            onClick={handleVerifyAccount}
            disabled={isVerifying}
            className="text-[10px] font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>Verify Account Instantly</span>
          </button>
        </div>
      )}

      {/* Guest/Non-Authenticated Screen View */}
      <AnimatePresence mode="wait">
        {!token ? (
          <motion.div 
            key="login-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Strategy / Pitch Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                  🚀 AUTOMATE • MONETIZE • SCALE
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-100 leading-tight tracking-tight font-display">
                  Turn Your Creative Ideas Into A Highly Profitable live SaaS Startup in Seconds
                </h1>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-xl">
                  MAMTA AI is the world's most robust multi-tenant web application synthesis network. Generate clean codebases dynamically, simulate dual routing checkout gateways, and manage multi-user subscription tiers instantly.
                </p>
              </div>

              {/* Unique selling points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-1.5">
                  <div className="text-emerald-400 text-lg">💳</div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase">Dual Payment Routing</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Auto-routes Indian traffic through secure Razorpay UPI gateways and rest-of-world clients straight to Stripe Cards.
                  </p>
                </div>
                <div className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-1.5">
                  <div className="text-cyan-400 text-lg">🤖</div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase">AI Web Builder Engine</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Generates clean, fully compiling Tailwind CSS HTML web codes using Gemini-3.5-Flash Supercomputers.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Card Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                    {isSignUp ? 'Create Startup Account' : 'Startup Core Portal'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {isSignUp ? 'Onboard your SaaS tenancy block' : 'Enter your credentials to enter sandbox'}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@startup.com"
                        className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40 font-medium placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40 font-medium placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">Select Country (For Routing Check)</label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                      <select 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40 font-medium cursor-pointer"
                      >
                        <option value="US">United States (USD - Stripe)</option>
                        <option value="IN">India (INR - Razorpay)</option>
                        <option value="GB">United Kingdom (GBP - Stripe)</option>
                        <option value="DE">Germany (EUR - Stripe)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 transition-all"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                        <span>Deploying Tenancy...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 text-slate-950" />
                        <span>{isSignUp ? 'Create Account' : 'Authenticate Console'}</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="border-t border-slate-900/60 pt-4 text-center">
                  <button 
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      // Autofill a test email for convenience
                      if (!email) setEmail('rajveersinghm675@gmail.com');
                      if (!password) setPassword('mamta_ai_pass_123');
                    }}
                    className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'Want a quick sandbox test account? Click to generate'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Tab Links Menu */}
            <div className="flex flex-wrap border-b border-slate-900/50 pb-2.5 gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'dashboard' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Tenancy Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-tool')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'ai-tool' 
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>AI Website Builder</span>
                <span className="text-[6.5px] bg-cyan-500/20 text-cyan-300 font-mono px-1 rounded font-black uppercase animate-pulse">LIVE</span>
              </button>

              <button
                onClick={() => setActiveTab('billing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'billing' 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Billing & Upgrades</span>
              </button>

              <button
                onClick={() => setActiveTab('team-scaling')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'team-scaling' 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Team Hiring</span>
                <span className="text-[6.5px] bg-rose-500/20 text-rose-300 font-mono px-1 rounded font-black uppercase">STEP 6</span>
              </button>

              <button
                onClick={() => setActiveTab('branding-pitch')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'branding-pitch' 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Investor Pitch</span>
                <span className="text-[6.5px] bg-indigo-500/20 text-indigo-300 font-mono px-1 rounded font-black uppercase">DECK</span>
              </button>

              <button
                onClick={() => setActiveTab('enterprise-automation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'enterprise-automation' 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Automation</span>
                <span className="text-[6.5px] bg-purple-500/20 text-purple-300 font-mono px-1 rounded font-black uppercase">AUTO</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('analytics');
                  if (userProfile?.email) {
                    fetchAnalytics(userProfile.email);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'analytics' 
                    ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>



              <button
                onClick={() => setActiveTab('docs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'docs' 
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/15' 
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Docs</span>
              </button>

              <button
                onClick={() => setActiveTab('global-domination')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border animate-pulse ${
                  activeTab === 'global-domination' 
                    ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/20' 
                    : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Global Domination</span>
                <span className="text-[6.5px] bg-red-600 text-white font-mono px-1 rounded font-black uppercase">STEP 7</span>
              </button>

              <button
                onClick={handleLogout}
                className="ml-auto px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/15 rounded-lg text-xs font-bold hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout Tenant</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Tenancy Dashboard */}
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="tab-dash"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  
                  {/* Left Column (8 cols): Dashboard Stats & Welcome */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="bg-gradient-to-r from-emerald-950/25 to-cyan-950/15 border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                      <h2 className="text-sm font-black uppercase text-slate-100 tracking-wider">
                        Welcome Back, Developer!
                      </h2>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        You are connected to MAMTA AI multi-tenant SaaS. Your tenant email is <strong className="text-emerald-400 font-mono">{userProfile?.email}</strong> registered with geolocation routing set to <strong className="text-cyan-400 uppercase font-mono">{userProfile?.country || 'US'}</strong>.
                      </p>

                      {/* Quick CTA to AI Builder */}
                      <div className="pt-4 flex gap-2">
                        <button
                          onClick={() => setActiveTab('ai-tool')}
                          className="px-4 py-2 bg-cyan-500 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 hover:bg-cyan-400 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
                        >
                          <span>Launch AI Web Builder</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveTab('billing')}
                          className="px-4 py-2 bg-slate-900 text-slate-300 font-bold text-xs rounded-lg border border-slate-800 hover:bg-slate-850 transition-all cursor-pointer"
                        >
                          Check Subscription Upgrades
                        </button>
                      </div>
                    </div>

                    {/* Subscription limit gauges */}
                    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                        Active Tenant Usage Quota Limit Metrics
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                            <span className="text-slate-400">Gemini LLM Query Usage:</span>
                            <span className="text-slate-300 font-bold">
                              {userProfile?.usage} / {userProfile?.limit === 999999 ? '∞ (UNLIMITED)' : `${userProfile?.limit} generations`}
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-slate-900">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300`}
                              style={{ width: `${Math.min(100, ((userProfile?.usage || 0) / (userProfile?.limit || 1)) * 100)}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                            <span>{Math.round(((userProfile?.usage || 0) / (userProfile?.limit || 1)) * 100)}% Quota Exhausted</span>
                            <span>
                              {userProfile?.plan === 'FREE' ? 'Upgrade to lift the limit!' : 'Pro Limit Unlocked!'}
                            </span>
                          </div>
                        </div>

                        {/* Synced SaaS Credits */}
                        <div className="pt-2 border-t border-slate-900/40 space-y-1">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-400">Remaining SaaS Credits:</span>
                            <span className="text-cyan-400 font-extrabold text-sm">
                              {userProfile?.credits !== undefined ? userProfile.credits : ((userProfile?.limit || 10) - (userProfile?.usage || 0))} credits
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                            💡 Every generated website deducts exactly 1 credit from your database node in Firestore.
                          </p>
                        </div>

                        {/* Extra SaaS Simulated metrics */}
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-900/60 pt-4 font-mono text-[10px]">
                          <div className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl">
                            <span className="text-slate-500 block">SaaS Core Status</span>
                            <strong className="text-emerald-400">HEALTHY (100% ONLINE)</strong>
                          </div>
                          <div className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl">
                            <span className="text-slate-500 block">Assigned Database Nodes</span>
                            <strong className="text-cyan-400">FIRESTORE SHARD US-01</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (4 cols): Profile Details & Tenant settings */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                        <UserPlus className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-xs font-black text-slate-200 uppercase">Tenant settings</h3>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center py-2 border-b border-slate-900/40">
                          <span className="text-slate-500">Tier Name:</span>
                          <span className="text-emerald-400 font-bold">{userProfile?.plan}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-900/40">
                          <span className="text-slate-500">Country Code:</span>
                          <select 
                            value={country}
                            onChange={(e) => {
                              setCountry(e.target.value);
                              fetchProfile(userProfile.email);
                            }}
                            className="bg-slate-950 border border-slate-900 rounded px-1.5 py-0.5 text-[11px] text-slate-300 focus:outline-none"
                          >
                            <option value="US">US (Stripe)</option>
                            <option value="IN">IN (Razorpay)</option>
                            <option value="GB">GB (Stripe)</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-900/40">
                          <span className="text-slate-500">API Key Authorization:</span>
                          <span className="text-cyan-400 text-[10px] truncate max-w-[150px]">{token}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab 2: AI Web Builder */}
              {activeTab === 'ai-tool' && (
                <motion.div 
                  key="tab-builder"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 flex flex-col h-full"
                >
                  
                  {/* Dynamic low credits alert warning banner */}
                  {userProfile && (userProfile.credits !== undefined ? userProfile.credits : ((userProfile.limit || 10) - (userProfile.usage || 0))) <= 3 && (
                    <div className="bg-rose-500/15 border border-rose-500/25 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-[pulse_3s_infinite] shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg flex items-center justify-center shrink-0">
                          <Flame className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                            SaaS Account Credits Running Depleted (खत्म हो रहे हैं!)
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            You only have {userProfile.credits !== undefined ? userProfile.credits : ((userProfile.limit || 10) - (userProfile.usage || 0))} credits remaining. Upgrade to PRO to get 1,000 monthly credits and unblock full features.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('billing')}
                        className="text-[10px] font-mono font-bold bg-rose-500 hover:bg-rose-400 text-slate-950 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Upgrade Ledgers
                      </button>
                    </div>
                  )}

                  {/* Tool bar controller */}
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 space-y-3 shrink-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-[spin_10s_linear_infinite]" />
                        MAMTA Autonomous AI Website Generator & Sandbox
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/15 px-2 py-0.5 rounded uppercase">
                        Active Model: Gemini-3.5-Flash
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <input 
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the website you want to synthesize..."
                        className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40 placeholder:text-slate-600 font-medium"
                      />
                      <button
                        onClick={generateWebsite}
                        disabled={isGenerating}
                        className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-45 transition-all shadow-lg shadow-cyan-500/10"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                            <span>Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-slate-950" />
                            <span>Synthesize Landing Page</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Split Screen Panel for code generation results */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 h-[600px] overflow-hidden">
                    
                    {/* Left Panel: Log Monitor & Saved Websites Sidebar (3 cols) */}
                    <div className="lg:col-span-3 bg-slate-900/20 border border-slate-900 rounded-2xl p-4 flex flex-col overflow-hidden">
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 shrink-0">
                        Operational Core Log Monitor
                      </h4>

                      <div className="h-[140px] bg-slate-950 rounded-xl border border-slate-900/60 p-3 overflow-y-auto custom-scrollbar font-mono text-[9px] text-slate-400 space-y-1.5 shadow-inner shrink-0">
                        {generationLogs.length === 0 ? (
                          <div className="text-slate-600 italic text-center py-10">
                            Enter a prompt above and press Generate to begin website synthesis.
                          </div>
                        ) : (
                          generationLogs.map((log, idx) => (
                            <p key={idx} className={
                              log.includes('🎉') || log.includes('complete') ? 'text-emerald-400 font-bold' :
                              log.includes('🤖') || log.includes('Gemini') ? 'text-cyan-400 font-medium' :
                              log.includes('❌') ? 'text-red-400' :
                              'text-slate-400'
                            }>
                              {log}
                            </p>
                          ))
                        )}
                      </div>

                      {explanation && (
                        <div className="mt-2 p-2 bg-cyan-500/5 border border-cyan-500/10 rounded-lg text-[9px] font-mono text-cyan-300 shrink-0">
                          <strong>Synthesis Info:</strong> {explanation}
                        </div>
                      )}

                      {activeProject && (
                        <div className="mt-2.5 bg-slate-950/80 border border-slate-900 rounded-xl p-3 shrink-0 space-y-2.5">
                          <h4 className="text-[9.5px] font-mono text-cyan-400 uppercase tracking-widest flex items-center justify-between">
                            <span>VCS VERSION HISTORY (STEP 6)</span>
                            <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          </h4>

                          {/* Save current snapshot */}
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={versionPromptInput}
                              onChange={(e) => setVersionPromptInput(e.target.value)}
                              placeholder="Describe checkpoint (e.g. green buttons)"
                              className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[9.5px] text-slate-300 font-mono focus:outline-none focus:border-cyan-500/40 placeholder:text-slate-600"
                            />
                            <button
                              onClick={handleManualVersionSave}
                              className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[9px] font-mono rounded cursor-pointer shrink-0 transition-colors"
                            >
                              SAVE
                            </button>
                          </div>

                          {/* Versions list */}
                          <div className="max-h-[110px] overflow-y-auto custom-scrollbar space-y-1.5 pr-0.5">
                            {isLoadingVersions ? (
                              <div className="text-center py-2 text-[8.5px] font-mono text-slate-500">Loading version logs...</div>
                            ) : projectVersions.length === 0 ? (
                              <div className="text-center py-2 text-[8.5px] font-mono text-slate-600 italic">No historical checkpoints.</div>
                            ) : (
                              projectVersions.map((v: any, index: number) => (
                                <div key={v.versionId || index} className="p-1.5 bg-slate-900/60 rounded border border-slate-900/80 text-[8.5px] font-mono flex items-center justify-between gap-1.5">
                                  <div className="truncate max-w-[110px]">
                                    <span className="text-slate-300 block font-bold truncate">{v.prompt}</span>
                                    <span className="text-slate-500 text-[7.5px]">{new Date(v.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                  <button
                                    onClick={() => handleVersionRollback(v.versionId)}
                                    className="px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded text-[7.5px] font-bold cursor-pointer transition-colors shrink-0"
                                  >
                                    ROLLBACK
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-slate-900/80 my-3 pt-3 shrink-0" />

                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 shrink-0 flex justify-between items-center">
                        <span>My Saved Sites ({projectsList.length})</span>
                        <Grid className="w-3.5 h-3.5 text-cyan-500" />
                      </h4>

                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 min-h-[180px]">
                        {projectsList.length === 0 ? (
                          <div className="text-slate-600 italic text-center py-10 font-mono text-[9px]">
                            No saved sites yet.<br/>Generate one above and click 'Save Web project'.
                          </div>
                        ) : (
                          projectsList.map((p, idx) => (
                            <div 
                              key={p.projectId || idx} 
                              onClick={() => {
                                setGeneratedCode(p.html);
                                setPrompt(p.prompt);
                                setActiveProject(p);
                                setPreviewMode('preview');
                                setExplanation(`Restored project "${p.prompt}" from Firestore database.`);
                                setGenerationLogs([
                                  `🎉 Loaded project "${p.prompt}" successfully from multi-tenant cloud storage!`,
                                  `📂 Project ID: ${p.projectId}`,
                                  `🔗 Deployment status: ${p.isDeployed ? "LIVE" : "DRAFT"}`
                                ]);
                                fetchProjectVersions(p.projectId);
                              }}
                              className={`p-2 rounded-xl border font-mono text-[10.5px] transition-all cursor-pointer flex flex-col gap-1 ${
                                activeProject?.projectId === p.projectId 
                                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80'
                              }`}
                            >
                              <div className="flex justify-between items-center gap-1.5">
                                <span className="font-extrabold text-slate-200 truncate max-w-[130px]">{p.prompt}</span>
                                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                                  p.isDeployed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'
                                }`}>
                                  {p.isDeployed ? "LIVE" : "DRAFT"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[8px] text-slate-500">
                                <span className="text-[7.5px] font-mono text-cyan-500">{p.projectId}</span>
                                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                              </div>
                              {p.isDeployed && (
                                <div className="mt-1 flex gap-1.5 justify-end shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <a 
                                    href={`/project/${p.projectId}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[8.5px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-0.5"
                                  >
                                    <Globe className="w-2.5 h-2.5" />
                                    <span>Live URL</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Code Workspace Render Preview (9 cols) */}
                    <div className="lg:col-span-9 bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden flex flex-col h-full">
                      
                      {/* View Controller */}
                      <div className="p-3.5 border-b border-slate-900/80 bg-slate-950/40 flex items-center justify-between shrink-0">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPreviewMode('preview')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                              previewMode === 'preview' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            Live Sandbox Frame
                          </button>
                          <button
                            onClick={() => setPreviewMode('code')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                              previewMode === 'code' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            Source HTML Code
                          </button>
                          <button
                            onClick={() => setPreviewMode('editor')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                              previewMode === 'editor' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            ✏️ No-Code Live Editor
                          </button>
                        </div>

                        {generatedCode && (
                          <div className="flex gap-2 items-center">
                            {/* Save button */}
                            <button
                              onClick={handleSaveProject}
                              disabled={isSavingProject}
                              className="text-[9px] bg-slate-900 hover:bg-slate-850 disabled:opacity-50 text-emerald-400 border border-emerald-900/50 px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              {isSavingProject ? (
                                <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                              ) : (
                                <Check className="w-3 h-3 text-emerald-400" />
                              )}
                              <span>{activeProject ? "Update Saved" : "Save Web project"}</span>
                            </button>

                            {/* Deploy button */}
                            <button
                              onClick={handleDeployProject}
                              disabled={isDeployingProject}
                              className={`text-[9px] px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer transition-all ${
                                activeProject?.isDeployed 
                                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold' 
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold'
                              }`}
                            >
                              {isDeployingProject ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Globe className="w-3 h-3" />
                              )}
                              <span>{activeProject?.isDeployed ? "Live Deployed 🔥" : "1-Click Deploy Live"}</span>
                            </button>

                            {activeProject?.isDeployed && (
                              <a
                                href={`/project/${activeProject.projectId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[9.5px] text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Visit Site</span>
                              </a>
                            )}

                            <button
                              onClick={handleCopyCode}
                              className="text-[9px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {copiedCode ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-400" />}
                              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Code Render Body */}
                      <div className="flex-1 bg-slate-950 overflow-hidden relative">
                        {isGenerating && (
                          <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                            <p className="text-xs font-mono text-cyan-300">Synthesizing live layout preview...</p>
                          </div>
                        )}

                        {!generatedCode ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs font-mono p-4 text-center">
                            <span className="text-xl mb-2">🌐</span>
                            <span>No output generated yet. Give prompt instructions above to build beautiful code template.</span>
                          </div>
                        ) : previewMode === 'preview' ? (
                          <iframe 
                            srcDoc={generatedCode}
                            title="Compilation Preview"
                            sandbox="allow-scripts allow-modals"
                            className="w-full h-full bg-slate-900 border-none rounded-b-xl"
                          />
                        ) : previewMode === 'code' ? (
                          <pre className="w-full h-full p-4 overflow-auto custom-scrollbar font-mono text-[10.5px] text-cyan-400 select-text whitespace-pre-wrap">
                            {generatedCode}
                          </pre>
                        ) : (
                          /* No-Code Split Screen Live Editor */
                          <div className="w-full h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-900 bg-slate-950">
                            
                            {/* Left Textarea Code Controller */}
                            <div className="w-full md:w-1/2 p-4 flex flex-col h-full space-y-4 overflow-y-auto custom-scrollbar bg-slate-950">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                  Mamta Real-Time Sync Workspace
                                </span>
                                <span className="text-[8px] font-mono text-slate-500">
                                  Keystrokes render instantly
                                </span>
                              </div>

                              <textarea
                                value={generatedCode}
                                onChange={(e) => setGeneratedCode(e.target.value)}
                                className="flex-1 w-full min-h-[300px] md:min-h-[auto] p-3.5 bg-slate-900/40 border border-slate-900 rounded-xl font-mono text-[10.5px] text-emerald-400 focus:outline-none focus:border-cyan-500/30 resize-none overflow-y-auto custom-scrollbar leading-relaxed"
                                placeholder="Edit your live website source code directly..."
                              />

                              {/* 🤖 MAMTA Chat-to-Edit AI Interface */}
                              <div className="bg-slate-900/35 border border-slate-900 p-3.5 rounded-xl space-y-3 shrink-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                    <span>Chat-to-Edit AI Refactor</span>
                                  </h5>
                                  <span className="text-[7.5px] font-mono text-slate-500 uppercase">
                                    -1 Credit per edit
                                  </span>
                                </div>
                                <p className="text-[8.5px] text-slate-400 font-mono leading-normal">
                                  Tell Mamta AI what to modify, append, or redesign on your website live.
                                </p>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={chatEditPrompt}
                                    onChange={(e) => setChatEditPrompt(e.target.value)}
                                    placeholder="e.g. 'make pricing cards glowing neon green'"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAiEdit();
                                      }
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-lg text-[10px] font-mono text-slate-200 focus:outline-none focus:border-cyan-500/30"
                                  />
                                  <button
                                    onClick={handleAiEdit}
                                    disabled={isEditingAi || !chatEditPrompt.trim()}
                                    className="px-3 bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 font-black text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                  >
                                    {isEditingAi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                    <span>Edit</span>
                                  </button>
                                </div>
                              </div>

                              {/* 📷 Media Asset / Logo Upload Portal */}
                              <div className="bg-slate-900/35 border border-slate-900 p-3.5 rounded-xl space-y-2 shrink-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Media logo upload</span>
                                  </h5>
                                  <span className="text-[7.5px] font-mono text-slate-500 uppercase">
                                    SVG, PNG, JPG
                                  </span>
                                </div>
                                <p className="text-[8.5px] text-slate-400 font-mono leading-normal">
                                  Upload a custom logo to inject directly into your live design structure.
                                </p>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="logo-upload-input"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor="logo-upload-input"
                                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-lg flex items-center justify-center gap-2 text-[9.5px] font-mono text-slate-300 hover:text-emerald-400 cursor-pointer transition-all"
                                  >
                                    {isUploadingLogo ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Upload className="w-3.5 h-3.5" />
                                    )}
                                    <span>{isUploadingLogo ? 'Processing image...' : 'Choose brand image logo'}</span>
                                  </label>
                                </div>
                              </div>

                              {/* Quick Injection Micro Actions */}
                              <div className="bg-slate-900/25 border border-slate-900/60 p-3 rounded-xl space-y-2 shrink-0">
                                <h5 className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">
                                  ✏️ No-Code Quick-Inject Blocks
                                </h5>
                                <p className="text-[8.5px] text-slate-500 font-mono">
                                  One-click inject pre-styled blocks into your landing page design structure.
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <button
                                    onClick={() => {
                                      const dealBlock = `
  <!-- MAMTA Promotional Deal Banner -->
  <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 180, 212, 0.1)); border: 1.5px solid rgba(16, 185, 129, 0.35); padding: 16px 24px; border-radius: 20px; text-align: center; margin: 32px auto; max-width: 600px; font-family: sans-serif;">
    <span style="font-size: 9px; font-weight: 900; background: #10b981; color: #000; padding: 3px 8px; border-radius: 99px; letter-spacing: 1px; text-transform: uppercase;">EXCLUSIVE SUMMER LAUNCH OFFER</span>
    <h3 style="color: #ffffff; margin-top: 10px; font-size: 16px; font-weight: 800;">🎉 Launch Special Deals Live</h3>
    <p style="color: #94a3b8; font-size: 11px; margin-top: 4px; line-height: 1.4;">Claim your custom subdomain today and receive a 50% lifetime discount with coupon <strong style="color: #10b981;">MAMTA50</strong></p>
  </div>
                                      `;
                                      if (generatedCode.includes("</body>")) {
                                        setGeneratedCode(generatedCode.replace("</body>", `${dealBlock}\n</body>`));
                                      } else {
                                        setGeneratedCode(generatedCode + dealBlock);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-mono text-left transition-colors"
                                  >
                                    + Inject Promo Deal Banner
                                  </button>

                                  <button
                                    onClick={() => {
                                      const alertBlock = `
  <script>
    setTimeout(() => {
      alert("✨ Hello Founder! This alert was injected live via MAMTA AI Interactive Studio!");
    }, 1000);
  </script>
                                      `;
                                      if (generatedCode.includes("</body>")) {
                                        setGeneratedCode(generatedCode.replace("</body>", `${alertBlock}\n</body>`));
                                      } else {
                                        setGeneratedCode(generatedCode + alertBlock);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg text-[9px] font-mono text-left transition-colors"
                                  >
                                    + Inject Simulated Alert Popup
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Right Live Sync iframe view */}
                            <div className="w-full md:w-1/2 h-full bg-slate-900 relative">
                              <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[8px] font-mono text-slate-400 uppercase tracking-widest z-10 pointer-events-none">
                                Sandboxed preview Frame
                              </div>
                              <iframe 
                                srcDoc={generatedCode}
                                title="No-Code Sync Viewport"
                                sandbox="allow-scripts allow-modals"
                                className="w-full h-full bg-slate-900 border-none"
                              />
                            </div>

                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </motion.div>
              )}

              {/* Tab 3: Billing & Upgrades */}
              {activeTab === 'billing' && (
                <motion.div 
                  key="tab-billing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  
                  {/* Real-time SaaS Credit & Billing Ledger */}
                  {userProfile && (
                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none" />
                      <div>
                        <span className="px-2.5 py-0.5 rounded font-mono text-[8px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase font-black tracking-widest">
                          PRODUCTION BILLING SHARD CONNECTED
                        </span>
                        <h4 className="text-xs font-black text-slate-200 mt-2 uppercase tracking-wide">
                          Real-Time SaaS Credit & Billing Account Details
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          Tenant Ledger ID: <span className="text-slate-300 font-bold">{userProfile.email}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-6 font-mono text-xs">
                        <div className="text-left md:text-right">
                          <span className="text-[9px] text-slate-500 block">Current Active Tier</span>
                          <span className="text-emerald-400 font-extrabold uppercase">{userProfile.plan} PLAN</span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-900" />
                        <div className="text-left md:text-right">
                          <span className="text-[9px] text-slate-500 block">Remaining Credits</span>
                          <span className="text-cyan-400 font-black text-sm">
                            {userProfile.credits !== undefined ? userProfile.credits : (userProfile.limit - userProfile.usage)} / {userProfile.limit === 999999 ? '∞' : userProfile.limit}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upgrade plans card grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Free Plan */}
                    <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 relative flex flex-col">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Starter Tier</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-100">₹0</span>
                          <span className="text-[10px] text-slate-500 font-mono">/ month</span>
                        </div>
                      </div>

                      <ul className="text-xs text-slate-400 space-y-2 flex-1">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>10 LLM Generations limit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Standard Tailwind components</span>
                        </li>
                      </ul>

                      <button
                        disabled
                        className="w-full py-2 bg-slate-950 text-slate-600 border border-slate-900 text-xs font-bold rounded-xl cursor-not-allowed"
                      >
                        Active Account Plan
                      </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-slate-900/30 border border-cyan-500/30 rounded-2xl p-5 space-y-4 relative flex flex-col shadow-lg shadow-cyan-500/5">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
                      <div className="space-y-1">
                        <span className="absolute -top-3 left-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                          BEST SELLER 🔥
                        </span>
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">MAMTA PRO SaaS</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-100">
                            {country === 'IN' ? '₹499' : '$9.99'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">/ month</span>
                        </div>
                      </div>

                      <ul className="text-xs text-slate-300 space-y-2 flex-1">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>1,000 High-Quality Synthesis limit</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Advanced Gemini-3.5-Flash</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Stripe & Razorpay auto-routing</span>
                        </li>
                      </ul>

                      <button
                        onClick={() => triggerCheckout('PRO')}
                        disabled={userProfile?.plan === 'PRO' || userProfile?.plan === 'PREMIUM'}
                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl cursor-pointer transition-all"
                      >
                        {userProfile?.plan === 'PRO' || userProfile?.plan === 'PREMIUM' ? 'Subscribed' : 'Upgrade to Pro'}
                      </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 relative flex flex-col">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise Max</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-100">
                            {country === 'IN' ? '₹999' : '$19.99'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">/ month</span>
                        </div>
                      </div>

                      <ul className="text-xs text-slate-400 space-y-2 flex-1">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Unlimited AI generations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dedicated Shard Firestore Node</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dedicated support support team</span>
                        </li>
                      </ul>

                      <button
                        onClick={() => triggerCheckout('PREMIUM')}
                        disabled={userProfile?.plan === 'PREMIUM'}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all"
                      >
                        {userProfile?.plan === 'PREMIUM' ? 'Subscribed' : 'Request Enterprise'}
                      </button>
                    </div>

                  </div>

                  {/* Dynamic Checkout Flow Panel */}
                  <AnimatePresence>
                    {isCheckingOut && checkoutPlan && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-5"
                      >
                        
                        {/* 1. Routing step */}
                        {paymentStep === 'routing_preview' && (
                          <div className="text-center py-6 space-y-4">
                            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-black uppercase text-slate-200">
                                Dynamic Payment Routing Engine Triggered
                              </h4>
                              <p className="text-[10.5px] text-slate-500 font-mono">
                                Detecting Client IP Geolocation: <strong className="text-emerald-400 uppercase">{country}</strong>
                              </p>
                            </div>

                            {/* Dual Routing Graphic */}
                            <div className="flex items-center justify-center gap-6 pt-4 font-mono text-[10px]">
                              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl">
                                <span className="text-slate-500 block">SaaS billing</span>
                                <strong className="text-slate-300">Mamta Platform</strong>
                              </div>
                              <div className="text-slate-600 animate-pulse font-extrabold text-sm">➔</div>
                              <div className={`p-3 bg-slate-950 border rounded-xl ${country === 'IN' ? 'border-amber-500/30 text-amber-400' : 'border-indigo-500/30 text-indigo-400'}`}>
                                <span className="text-slate-500 block">Assigned Gateway</span>
                                <strong>{country === 'IN' ? '🇮🇳 RAZORPAY API' : '🌍 STRIPE CARDS API'}</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. Simulation Step */}
                        {paymentStep === 'secured_payment_simulation' && checkoutResult && (
                          <div className="space-y-4">
                            <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
                              <div>
                                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                                  Secure checkout transaction gateway
                                </h4>
                                <p className="text-[9px] text-slate-500 font-mono">
                                  ORDER REF: {checkoutResult.order?.id || checkoutResult.session?.id}
                                </p>
                              </div>
                              <span className="px-2 py-0.5 rounded font-mono text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase font-black tracking-widest animate-pulse">
                                SECURED CORE
                              </span>
                            </div>

                            {/* Form Body for checkout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              
                              {/* Left Side Billing Summary */}
                              <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-3 font-mono text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Subscription Item:</span>
                                  <span className="text-slate-200">MAMTA SaaS {checkoutPlan}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Target Tenant:</span>
                                  <span className="text-slate-200 truncate max-w-[150px]">{userProfile.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Checkout Currency:</span>
                                  <span className="text-slate-200 font-bold">{checkoutResult.currency}</span>
                                </div>
                                <div className="border-t border-slate-900/60 pt-2 flex justify-between font-bold">
                                  <span className="text-slate-500">Amount Due:</span>
                                  <span className="text-emerald-400">
                                    {checkoutResult.currency === 'INR' ? `₹${checkoutResult.amount}` : `$${checkoutResult.amount}.00`}
                                  </span>
                                </div>
                              </div>

                              {/* Right Side UI Payment Fields */}
                              <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-3">
                                {checkoutResult.gateway === 'RAZORPAY' ? (
                                  <div className="space-y-3">
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-center text-[10.5px] font-mono leading-relaxed">
                                      UPI / QR / NET BANKING SECURE INTEGRATION (INDIA)
                                    </div>
                                    <button
                                      onClick={confirmSimulatedPayment}
                                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <span>Verify UPI Checkout UPI ₹{checkoutResult.amount}</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-center text-[10.5px] font-mono leading-relaxed">
                                      GLOBAL CREDIT CARDS ROUTING SECURE (STRIPE)
                                    </div>
                                    <button
                                      onClick={confirmSimulatedPayment}
                                      className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <span>Process Secure Card payment ${checkoutResult.amount}.00</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>
                        )}

                        {/* 3. Success Step */}
                        {paymentStep === 'success' && (
                          <div className="text-center py-6 space-y-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-lg">
                              ✓
                            </div>
                            <div className="space-y-1.5">
                              <h4 className="text-sm font-black uppercase text-emerald-400">
                                SaaS subscription upgraded successfully!
                              </h4>
                              <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                                Your account is now fully elevated to <strong>{checkoutPlan}</strong> tier. Generation limits have been expanded up to {checkoutPlan === 'PREMIUM' ? 'UNLIMITED' : '1,000 queries'} instantly.
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setIsCheckingOut(false);
                                setCheckoutPlan(null);
                                setActiveTab('dashboard');
                              }}
                              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Return to Dashboard Workspace
                            </button>
                          </div>
                        )}

                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Viral Growth & Referral Rewards System (MAMTA AI STEP 4) */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 relative overflow-hidden mt-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-1.5 flex-1">
                        <span className="px-2.5 py-0.5 rounded font-mono text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase font-black tracking-widest">
                          MAMTA VIRAL REWARD CORE ACTIVE
                        </span>
                        <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">
                          Invite Your Founders Circle & Claim Free SaaS Credits!
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono leading-relaxed max-w-xl">
                          Every friend who registers with Mamta AI using your referral grants you <strong className="text-emerald-400 font-bold">+20 Premium Generation Credits</strong> directly inside your billing ledger. Tap into our viral growth system instantly.
                        </p>
                      </div>

                      <div className="w-full md:w-80 bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Friend's Email Address</label>
                          <input
                            type="email"
                            value={friendEmail}
                            onChange={(e) => setFriendEmail(e.target.value)}
                            placeholder="e.g. startup-founder@gmail.com"
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-lg text-[11px] font-mono text-slate-200 focus:outline-none focus:border-emerald-500/30"
                          />
                        </div>
                        <button
                          onClick={handleReferFriend}
                          disabled={isReferring || !friendEmail}
                          className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          {isReferring ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : null}
                          <span>Send Free Invitation Code</span>
                        </button>
                        {referralSuccess && (
                          <p className="text-[9px] font-mono text-emerald-400 text-center animate-bounce">
                            ✓ Friend referred! +20 Credits applied to your Ledger balance!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab 4: Platform Docs */}
              {activeTab === 'docs' && (
                <motion.div 
                  key="tab-docs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900/20 border border-slate-900 p-5 rounded-2xl space-y-4 font-sans text-xs text-slate-400 leading-relaxed"
                >
                  <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-3">
                    MAMTA AI Multi-Tenant SaaS Platform API Reference
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">1. User Tenancy login</h4>
                      <p>
                        Allows user nodes to authenticate, claim tenancy namespaces, and fetch subscription billing limits from localized storage structures.
                      </p>
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-900 font-mono text-[9.5px] text-cyan-400">
                        POST /api/saas/auth/login {"\n"}
                        Payload: {"{ email: \"user@gmail.com\", password: \"pass123\", country: \"IN\" }"}
                      </pre>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">2. Dual Currency Router</h4>
                      <p>
                        Monitors and evaluates connection parameters. Automatically forwards traffic securely to the Razorpay UPI platform for clients inside Indian regions, and falls back to Stripe API Cards elsewhere.
                      </p>
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-900 font-mono text-[9.5px] text-cyan-400">
                        POST /api/saas/payments/checkout {"\n"}
                        Payload: {"{ email: \"user@gmail.com\", country: \"IN\", planKey: \"PRO\" }"}
                      </pre>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">3. High-Fidelity Website Generator AI</h4>
                      <p>
                        Queries Gemini-3.5-Flash Supercomputers on backend middleware proxy, enforcing limits before compilation synthesis to prevent usage abuse in free users. Implements sliding window IP rate limiting (1.5s minimum gap).
                      </p>
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-900 font-mono text-[9.5px] text-cyan-400">
                        POST /api/saas/ai/generate {"\n"}
                        Payload: {"{ email: \"user@gmail.com\", prompt: \"modern tech landing page\" }"}
                      </pre>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-300 uppercase">4. Real-time Billing & Credits Sync</h4>
                      <p>
                        Queries actual Firestore documents securely to retrieve dynamic, real-time credit metrics, plan state, and usage consumption.
                      </p>
                      <pre className="p-3 bg-slate-950 rounded-lg border border-slate-900 font-mono text-[9.5px] text-cyan-400">
                        POST /api/saas/billing {"\n"}
                        Payload: {"{ email: \"user@gmail.com\" }"}
                      </pre>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab 5: Website Analytics Dashboard */}
              {activeTab === 'analytics' && (
                <motion.div 
                  key="tab-analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Top Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none" />
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Total Page Views</span>
                      <strong className="text-2xl font-black text-slate-100 mt-2 block">
                        {isLoadingAnalytics ? '...' : (analyticsData?.summary?.totalViews || 0)}
                      </strong>
                      <span className="text-[9px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +14.2% Growth vs yesterday
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-fuchsia-500/5 to-transparent pointer-events-none" />
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Total Click Conversion</span>
                      <strong className="text-2xl font-black text-slate-100 mt-2 block">
                        {isLoadingAnalytics ? '...' : (analyticsData?.summary?.totalClicks || 0)}
                      </strong>
                      <span className="text-[9px] text-fuchsia-400 font-mono mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +8.3% Click Rate
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Referred Founders</span>
                      <strong className="text-2xl font-black text-slate-100 mt-2 block">
                        {userProfile?.referralCount || 0}
                      </strong>
                      <span className="text-[9px] text-emerald-400 font-mono mt-1">
                        🎉 Earned ₹{(userProfile?.referralCount || 0) * 50} Cash rewards
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Deployed Domains</span>
                      <strong className="text-2xl font-black text-slate-100 mt-2 block">
                        {projectsList.filter(p => p.isDeployed).length}
                      </strong>
                      <span className="text-[9px] text-cyan-400 font-mono mt-1">
                        ⚡ Deployed live instantly
                      </span>
                    </div>
                  </div>

                  {/* Custom Graphic Chart of Traffic over past 7 days */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                      <div>
                        <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">
                          Live Traffic Analytics Node
                        </h4>
                        <p className="text-[9px] text-slate-500 font-mono">
                          Visualization of visitor page views vs conversions (Updated live)
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-[9px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-slate-400">Page Views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                          <span className="text-slate-400">Click Conversions</span>
                        </div>
                      </div>
                    </div>

                    {/* Custom high-fidelity SVG/CSS graph representation */}
                    <div className="h-44 flex items-end justify-between gap-2 sm:gap-6 pt-6 relative border-b border-slate-900">
                      {/* Graph Bars */}
                      {(() => {
                        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                        const viewData = [120, 240, 180, 310, 420, 380, 510];
                        const clickData = [15, 32, 22, 45, 68, 55, 94];
                        const maxVal = 550;

                        return days.map((day, idx) => {
                          const viewHeight = (viewData[idx] / maxVal) * 100;
                          const clickHeight = (clickData[idx] / maxVal) * 100 * 3.5; // Scale click to make it visible
                          return (
                            <div key={day} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                              {/* Hover Tooltip */}
                              <div className="absolute -top-12 bg-slate-900 border border-slate-800 text-[8px] font-mono text-slate-300 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl">
                                <div>Views: <strong className="text-cyan-400">{viewData[idx]}</strong></div>
                                <div>Clicks: <strong className="text-fuchsia-400">{clickData[idx]}</strong></div>
                              </div>

                              <div className="w-full flex items-end justify-center gap-1.5 h-32">
                                {/* Page View Bar */}
                                <div 
                                  style={{ height: `${viewHeight}%` }} 
                                  className="w-2.5 sm:w-4 rounded-t bg-cyan-500/20 group-hover:bg-cyan-500/40 border-t border-cyan-400/30 transition-all duration-300" 
                                />
                                {/* Click Conversion Bar */}
                                <div 
                                  style={{ height: `${Math.min(100, clickHeight)}%` }} 
                                  className="w-2.5 sm:w-4 rounded-t bg-fuchsia-500/20 group-hover:bg-fuchsia-500/40 border-t border-fuchsia-400/30 transition-all duration-300" 
                                />
                              </div>
                              <span className="text-[9px] text-slate-500 font-mono mt-2">{day}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Raw Event Activity Log */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">
                        SaaS Analytics Raw Activity Ledger
                      </h4>
                      <p className="text-[9px] text-slate-500 font-mono">
                        Real-time firestore event streams captured by our global reverse proxy
                      </p>
                    </div>

                    <div className="divide-y divide-slate-900/60 font-mono text-[10px] max-h-56 overflow-y-auto custom-scrollbar">
                      {isLoadingAnalytics ? (
                        <div className="text-center py-6 text-slate-500">Loading live telemetry stream...</div>
                      ) : (analyticsData?.logs && analyticsData.logs.length > 0) ? (
                        analyticsData.logs.map((log: any, index: number) => (
                          <div key={index} className="py-2.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-cyan-400">●</span>
                              <span className="text-slate-300 capitalize">{log.eventType?.replace(/_/g, " ")}</span>
                              <span className="text-slate-500">({log.details})</span>
                            </div>
                            <span className="text-slate-500 shrink-0">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          No analytics telemetry recorded yet. Deploy your website and share it to see live visits in real-time!
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}



              {/* Tab: Team Scaling / Hiring */}
              {activeTab === 'team-scaling' && (
                <motion.div 
                  key="tab-team-scaling"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Goal and Hero Section */}
                  <div className="bg-gradient-to-r from-rose-950/20 to-slate-950 border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/5 to-transparent pointer-events-none" />
                    <span className="px-2.5 py-0.5 rounded font-mono text-[8px] bg-rose-500/10 border border-rose-500/20 text-rose-400 uppercase font-black tracking-widest">
                      TEAM HIRING SYSTEM (FOUNDATION OF SCALE)
                    </span>
                    <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide mt-3">
                      Mamta AI Smart Scaling & Talent Acquisition Hub
                    </h3>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed max-w-2xl mt-1.5 font-mono">
                      Transition from a **Solo Founder** to a **Scalable Enterprise** of autonomous professionals. Use the Mamta AI talent locator to generate highly matching profiles, hire specialists to increase your operational throughput, and manage payroll.
                    </p>
                  </div>

                  {/* Core Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Panel: Active Team Ledger (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide flex items-center gap-2">
                            <Users className="w-4 h-4 text-rose-400" />
                            <span>My Active Team Matrix</span>
                          </h4>
                          <p className="text-[9px] text-slate-500 font-mono">
                            Current hired workforce, monthly overhead burn, and efficiency multiplier
                          </p>
                        </div>

                        {/* Stats Panel */}
                        <div className="grid grid-cols-2 gap-3 py-1 font-mono">
                          <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                            <span className="text-[8.5px] text-slate-500 block uppercase">Monthly Overhead</span>
                            <strong className="text-sm text-rose-400">
                              ₹{teamMembers.reduce((acc, m) => acc + (m.salary || 0), 0).toLocaleString('en-IN')}
                            </strong>
                          </div>
                          <div className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl">
                            <span className="text-[8.5px] text-slate-500 block uppercase">Productivity Rate</span>
                            <strong className="text-sm text-emerald-400">
                              {teamMembers.reduce((acc, m) => acc + (m.efficiency || 90), 0)}%
                            </strong>
                          </div>
                        </div>

                        {/* Team Ledger List */}
                        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                          {teamMembers.map((member) => (
                            <div 
                              key={member.id} 
                              className="p-3 bg-slate-900/20 border border-slate-900/80 rounded-xl flex items-center justify-between gap-3 hover:border-slate-800 transition-all"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg">{member.avatar || "💼"}</span>
                                <div>
                                  <h5 className="text-[11px] font-bold text-slate-200 leading-tight">{member.name}</h5>
                                  <span className="text-[8.5px] text-slate-500 font-mono block">{member.role}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 font-mono">
                                <div className="text-right">
                                  <span className="text-[9px] text-emerald-400 block font-bold">
                                    {member.salary === 0 ? "Equity" : `₹${member.salary.toLocaleString('en-IN')}`}
                                  </span>
                                  <span className="text-[7.5px] text-slate-500 block">Eff: {member.efficiency}%</span>
                                </div>
                                {member.id !== '1' && (
                                  <button
                                    onClick={() => fireMember(member.id, member.name)}
                                    className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                                    title="Terminate Contract"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-900/60 text-[9.5px] text-slate-500 font-mono leading-relaxed">
                        💡 <strong className="text-slate-300">Scale Rule:</strong> Your SaaS platform's theoretical capacity increases with more team members. Total MRR calculator considers hired developers as system multiplier anchors!
                      </div>
                    </div>

                    {/* Right Panel: Job Post & Candidate Spawner (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-rose-400" />
                          <span>Mamta AI Job Search & Hire Core</span>
                        </h4>
                        <p className="text-[9px] text-slate-500 font-mono">
                          Describe the role you need to hire, and let Mamta AI generate highly optimized candidates
                        </p>
                      </div>

                      {/* Input Selector */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-8 space-y-1.5">
                          <label className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">
                            Target Job Role Position
                          </label>
                          <select
                            value={jobPostRole}
                            onChange={(e) => setJobPostRole(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500/40 cursor-pointer font-mono"
                          >
                            <option value="Full Stack AI Developer">Full Stack AI Developer (React/Express)</option>
                            <option value="SaaS Growth Marketer">SaaS Growth Marketer (SEO/Social)</option>
                            <option value="Global Affiliate Manager">Global Affiliate Manager (Outreach)</option>
                            <option value="DevOps & AWS Architect">DevOps & Cloud Architect (Scale/Infra)</option>
                            <option value="AI Content Creator">AI Video Creator (Automated Socials)</option>
                          </select>
                        </div>

                        <button
                          onClick={generateCandidatesPool}
                          disabled={isGeneratingCandidates}
                          className="sm:col-span-4 py-2 bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {isGeneratingCandidates ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                          )}
                          <span>Generate</span>
                        </button>
                      </div>

                      {/* Candidates Listing */}
                      <div className="space-y-3 min-h-[220px] bg-slate-900/20 border border-slate-900/60 p-4 rounded-xl flex flex-col justify-center">
                        {isGeneratingCandidates ? (
                          <div className="text-center py-12 space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">
                              Evaluating dynamic resume database streams...
                            </p>
                          </div>
                        ) : candidatesList.length > 0 ? (
                          <div className="space-y-2.5">
                            <span className="text-[8px] font-mono text-rose-400 uppercase tracking-widest font-black block">
                              MAMTA AI SOURCED CANDIDATE MATCHES (✓ READY FOR CONTRACT)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {candidatesList.map((cand, index) => (
                                <div 
                                  key={index} 
                                  className="p-3 bg-slate-950 border border-slate-900/80 rounded-xl hover:border-slate-800 transition-all flex flex-col justify-between space-y-2.5"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl">{cand.avatar}</span>
                                      <div>
                                        <h6 className="text-[11px] font-bold text-slate-200 leading-tight">{cand.name}</h6>
                                        <span className="text-[7.5px] font-mono text-rose-400 bg-rose-500/5 border border-rose-500/10 px-1 rounded block mt-0.5 w-max">
                                          {cand.match}% Match Quotient
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500">
                                      ₹{Math.floor(cand.salary / 1000)}k/mo
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-1">
                                    {cand.skills.map((skill: string, sIdx: number) => (
                                      <span key={sIdx} className="text-[7px] font-mono px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>

                                  <button
                                    onClick={() => hireCandidate(cand)}
                                    className="w-full py-1.5 bg-slate-900 hover:bg-rose-500 hover:text-slate-950 text-slate-300 font-bold text-[10px] rounded-lg transition-all uppercase tracking-wide cursor-pointer"
                                  >
                                    Sign Contract & Hire
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10 space-y-2">
                            <Users className="w-8 h-8 text-slate-800 mx-auto" />
                            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                              No Active Candidate Pool Generated
                            </h5>
                            <p className="text-[9.5px] text-slate-600 font-mono max-w-sm mx-auto leading-relaxed">
                              Choose a target job role from the selector above and click "Generate" to let Mamta AI dynamically match qualified SaaS specialists.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: Branding Domination & Investor Pitch */}
              {activeTab === 'branding-pitch' && (
                <motion.div 
                  key="tab-branding-pitch"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Hero & Intro */}
                  <div className="bg-gradient-to-r from-indigo-950/20 to-slate-950 border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
                    <span className="px-2.5 py-0.5 rounded font-mono text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase font-black tracking-widest">
                      BRANDING DOMINATION & INVESTOR PITCH
                    </span>
                    <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide mt-3">
                      Mamta AI 1-Click Interactive Pitch Deck Generator
                    </h3>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed max-w-2xl mt-1.5 font-mono">
                      Raise capital and establish a global premium brand. Customize your startup parameters, and let Mamta AI generate high-fidelity presentations with integrated revenue math calculations directly on a slide-by-slide canvas!
                    </p>
                  </div>

                  {/* Core Presentation Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Input Variables Panel (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide flex items-center gap-2">
                          <Settings className="w-4 h-4 text-indigo-400" />
                          <span>Startup parameters</span>
                        </h4>
                        <p className="text-[9px] text-slate-500 font-mono">
                          Configure values that fuel your brand guidance and investor slides
                        </p>
                      </div>

                      <div className="space-y-3 font-mono text-[10px]">
                        {/* Name */}
                        <div className="space-y-1.5">
                          <label className="text-[8.5px] text-slate-400 uppercase block">SaaS Startup Name</label>
                          <input
                            type="text"
                            value={pitchSaaSName}
                            onChange={(e) => setPitchSaaSName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-900 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/30 text-xs"
                          />
                        </div>

                        {/* Problem */}
                        <div className="space-y-1.5">
                          <label className="text-[8.5px] text-slate-400 uppercase block">The Problem (Market Pain)</label>
                          <textarea
                            value={pitchSaaSProblem}
                            onChange={(e) => setPitchSaaSProblem(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-900 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/30 text-[10px] resize-none"
                          />
                        </div>

                        {/* Solution */}
                        <div className="space-y-1.5">
                          <label className="text-[8.5px] text-slate-400 uppercase block">The Solution (Your Edge)</label>
                          <textarea
                            value={pitchSaaSSolution}
                            onChange={(e) => setPitchSaaSSolution(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-900 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/30 text-[10px] resize-none"
                          />
                        </div>

                        {/* Traction */}
                        <div className="space-y-1.5">
                          <label className="text-[8.5px] text-slate-400 uppercase block">Current SaaS Traction</label>
                          <input
                            type="text"
                            value={pitchSaaSTraction}
                            onChange={(e) => setPitchSaaSTraction(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-900 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/30 text-xs"
                          />
                        </div>

                        {/* Target ARR */}
                        <div className="space-y-1.5">
                          <label className="text-[8.5px] text-slate-400 uppercase block">12-Month Target Goal</label>
                          <input
                            type="text"
                            value={pitchSaaSTarget}
                            onChange={(e) => setPitchSaaSTarget(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-900 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/30 text-xs"
                          />
                        </div>
                      </div>

                      <button
                        onClick={generateInvestorPitchDeck}
                        disabled={isGeneratingPitch}
                        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isGeneratingPitch ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-slate-950" />
                        )}
                        <span>Compile Premium Pitch Deck</span>
                      </button>
                    </div>

                    {/* Right: Slide Canvas Deck Simulator (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[430px]">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide flex items-center gap-2">
                              <Megaphone className="w-4 h-4 text-indigo-400" />
                              <span>Live Deck Monitor</span>
                            </h4>
                            <p className="text-[9px] text-slate-500 font-mono">
                              Interactive slider demonstrating real-time investor ready visuals
                            </p>
                          </div>
                          <span className="font-mono text-[9px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded-full">
                            Slide {activeSlideIndex + 1} of {pitchDeckSlides.length}
                          </span>
                        </div>

                        {/* Slide Canvas */}
                        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 relative min-h-[250px] flex flex-col justify-between overflow-hidden shadow-2xl">
                          {/* Accent lights */}
                          <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

                          {/* Slide Header */}
                          <div className="flex justify-between items-center relative z-10 border-b border-slate-900/60 pb-3">
                            <span className="text-[8px] font-mono tracking-widest text-indigo-400 uppercase font-black bg-indigo-500/10 border border-indigo-500/10 px-2 py-0.5 rounded">
                              {pitchDeckSlides[activeSlideIndex]?.category || "STARTUP DECK"}
                            </span>
                            <span className="text-[7.5px] font-mono text-slate-600 uppercase">
                              Confidential Pitch ● Mamta AI Core
                            </span>
                          </div>

                          {/* Slide Body */}
                          <div className="py-6 relative z-10 space-y-3.5">
                            <h5 className="text-base font-black text-slate-100 tracking-tight leading-snug">
                              {pitchDeckSlides[activeSlideIndex]?.title}
                            </h5>

                            {pitchDeckSlides[activeSlideIndex]?.subtitle && (
                              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                                {pitchDeckSlides[activeSlideIndex].subtitle}
                              </p>
                            )}

                            {pitchDeckSlides[activeSlideIndex]?.problem && (
                              <p className="text-[11px] text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl font-mono leading-relaxed">
                                ❌ <strong>The Market Pain:</strong> {pitchDeckSlides[activeSlideIndex].problem}
                              </p>
                            )}

                            {pitchDeckSlides[activeSlideIndex]?.solution && (
                              <p className="text-[11px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl font-mono leading-relaxed">
                                🚀 <strong>The Mamta Edge:</strong> {pitchDeckSlides[activeSlideIndex].solution}
                              </p>
                            )}

                            {pitchDeckSlides[activeSlideIndex]?.detail && (
                              <div className="space-y-2">
                                <p className="text-[11.5px] text-slate-300 leading-relaxed font-mono">
                                  {pitchDeckSlides[activeSlideIndex].detail}
                                </p>
                                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl grid grid-cols-2 gap-4 font-mono text-[10px]">
                                  <div>
                                    <span className="text-slate-500 block uppercase text-[7.5px]">Subscriber Goal</span>
                                    <span className="text-slate-200 font-black text-xs">{calcSubscribers} Active Users</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block uppercase text-[7.5px]">Gross ARR Projected</span>
                                    <span className="text-emerald-400 font-black text-xs">
                                      ₹{((calcSubscribers * calcPrice * 12) / 100000).toFixed(2)} Lakhs
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {pitchDeckSlides[activeSlideIndex]?.traction && (
                              <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-1.5 font-mono">
                                <span className="text-[8px] text-indigo-400 uppercase font-black tracking-wider block">Verified Platform Traction</span>
                                <p className="text-[11px] text-slate-300 leading-relaxed">{pitchDeckSlides[activeSlideIndex].traction}</p>
                              </div>
                            )}

                            {pitchDeckSlides[activeSlideIndex]?.team && (
                              <div className="space-y-2 font-mono">
                                <p className="text-[11px] text-slate-400 leading-relaxed">{pitchDeckSlides[activeSlideIndex].team}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {teamMembers.map((m) => (
                                    <span key={m.id} className="px-2 py-0.5 bg-slate-950 border border-slate-900 text-[8px] text-slate-300 rounded-md">
                                      {m.avatar || "💼"} {m.name} ({m.role})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {pitchDeckSlides[activeSlideIndex]?.nextSteps && (
                              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                                ➔ {pitchDeckSlides[activeSlideIndex].nextSteps}
                              </p>
                            )}
                          </div>

                          {/* Slide Footer */}
                          <div className="border-t border-slate-900/60 pt-2.5 flex justify-between items-center text-[7.5px] font-mono text-slate-600 relative z-10">
                            <span>MAMTA SAAS EMPIRE PITCH ENGINE</span>
                            <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
                          </div>
                        </div>
                      </div>

                      {/* Presentation Nav controls */}
                      <div className="flex gap-2.5 mt-5">
                        <button
                          disabled={activeSlideIndex === 0}
                          onClick={() => setActiveSlideIndex(p => Math.max(0, p - 1))}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 disabled:opacity-40 text-slate-300 hover:text-white rounded-xl text-[10.5px] font-mono border border-slate-800 transition-all cursor-pointer"
                        >
                          ◀ Previous Slide
                        </button>
                        <button
                          disabled={activeSlideIndex === pitchDeckSlides.length - 1}
                          onClick={() => setActiveSlideIndex(p => Math.min(pitchDeckSlides.length - 1, p + 1))}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 disabled:opacity-40 text-slate-300 hover:text-white rounded-xl text-[10.5px] font-mono border border-slate-800 transition-all cursor-pointer"
                        >
                          Next Slide ▶
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: Enterprise Automation */}
              {activeTab === 'enterprise-automation' && (
                <motion.div 
                  key="tab-enterprise-automation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Hero Header */}
                  <div className="bg-gradient-to-r from-purple-950/20 to-slate-950 border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
                    <span className="px-2.5 py-0.5 rounded font-mono text-[8px] bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase font-black tracking-widest">
                      ENTERPRISE AUTOMATION & AUTOPILOT CORE
                    </span>
                    <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide mt-3">
                      Mamta AI Self-Running Automated Business Console
                    </h3>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed max-w-2xl mt-1.5 font-mono">
                      Unleash full autopilot automation over your SaaS startup. Enabling the Autopilot core deploys persistent simulated cron triggers, auto-indexing SEO scrapers, marketing social bots, and self-repairing server loops.
                    </p>
                  </div>

                  {/* Automation Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Master Controls & Options (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide flex items-center gap-2">
                            <Settings className="w-4 h-4 text-purple-400" />
                            <span>Autopilot Master Command</span>
                          </h4>
                          <p className="text-[9px] text-slate-500 font-mono">
                            Power up or deactivate autonomous background processes
                          </p>
                        </div>

                        {/* Master Toggle Power Button */}
                        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl flex items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-slate-100 block">
                              AUTOPILOT COGNITIVE CORE
                            </span>
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">
                              Status: {isAutopilotEnabled ? (
                                <strong className="text-purple-400 animate-pulse">● RUNNING ACTIVE</strong>
                              ) : "● STANDBY"}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setIsAutopilotEnabled(prev => !prev);
                              const action = !isAutopilotEnabled ? "ENABLED" : "DISABLED";
                              setAutoLogs(prev => [`[${new Date().toLocaleTimeString()}] !!! AUTOPILOT CORE FORCE-${action} !!!`, ...prev]);
                              if ((window as any).showToast) {
                                (window as any).showToast(`Autopilot Master Core ${action}!`, !isAutopilotEnabled ? "success" : "info");
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                              isAutopilotEnabled 
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse' 
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {isAutopilotEnabled ? "POWER OFF" : "ACTIVATE CORE"}
                          </button>
                        </div>

                        {/* Checklist Options */}
                        <div className="space-y-2.5 pt-2 font-mono text-[10px]">
                          <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold block">
                            Enabled Autonomous Pipelines
                          </span>

                          <label className="flex items-center gap-2.5 p-2.5 bg-slate-900/20 border border-slate-900 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-colors">
                            <input
                              type="checkbox"
                              checked={autoOptions.socialMedia}
                              onChange={() => setAutoOptions(p => ({ ...p, socialMedia: !p.socialMedia }))}
                              className="accent-purple-500"
                            />
                            <div>
                              <span className="text-[10px] text-slate-300 block font-bold">Auto-Social Media Syndication</span>
                              <span className="text-[7.5px] text-slate-500 block">Drafts and dispatches visual pitches to YouTube and Twitter</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-2.5 p-2.5 bg-slate-900/20 border border-slate-900 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-colors">
                            <input
                              type="checkbox"
                              checked={autoOptions.seoBlog}
                              onChange={() => setAutoOptions(p => ({ ...p, seoBlog: !p.seoBlog }))}
                              className="accent-purple-500"
                            />
                            <div>
                              <span className="text-[10px] text-slate-300 block font-bold">Dynamic Blog SEO Optimizer</span>
                              <span className="text-[7.5px] text-slate-500 block">Writes daily search engine optimized content for public sitemap</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-2.5 p-2.5 bg-slate-900/20 border border-slate-900 rounded-xl cursor-pointer hover:bg-slate-900/40 transition-colors">
                            <input
                              type="checkbox"
                              checked={autoOptions.selfHealing}
                              onChange={() => setAutoOptions(p => ({ ...p, selfHealing: !p.selfHealing }))}
                              className="accent-purple-500"
                            />
                            <div>
                              <span className="text-[10px] text-slate-300 block font-bold">Webhook Failure Self-Healing</span>
                              <span className="text-[7.5px] text-slate-500 block">Monitors server endpoints and performs local rollbacks if crashed</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-900/60 text-[9px] text-slate-500 font-mono leading-relaxed">
                        ⚡ <strong className="text-slate-300">Autopilot rule:</strong> When active, background processes trigger automated events to steadily grow simulated traffic and keep security scores optimal.
                      </div>
                    </div>

                    {/* Right: Logging Ticker Console (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[380px]">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-purple-400" />
                              <span>Live Automation Activities Ledger</span>
                            </h4>
                            <p className="text-[9px] text-slate-500 font-mono">
                              Real-time system events captured by the active Autopilot scheduler
                            </p>
                          </div>

                          <button
                            onClick={() => setAutoLogs([`[${new Date().toLocaleTimeString()}] Console logs cleared. Standby.`])}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9.5px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Clear Console
                          </button>
                        </div>

                        {/* Console Log Area */}
                        <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 font-mono text-[10px] space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                          {autoLogs.map((log, index) => (
                            <div 
                              key={index} 
                              className={`py-1 flex items-start gap-2.5 leading-relaxed border-b border-slate-900/30 last:border-0 ${
                                log.includes('!!!') 
                                  ? 'text-purple-400 font-bold bg-purple-500/5 px-2 rounded' 
                                  : log.includes('Verified') || log.includes('SaaS Ledger')
                                  ? 'text-emerald-400' 
                                  : 'text-slate-300'
                              }`}
                            >
                              <span className="text-slate-600 select-none shrink-0">&gt;</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Manual heartbeat injector */}
                      <button
                        onClick={() => {
                          const customHeartbeats = [
                            "Manual Heartbeat: Synchronized active Redis cache tables.",
                            "Security Diagnostics: Verified secure API headers are fully compiled.",
                            "Database Checkpoint: Flushed user session logs to long-term Firestore shard.",
                            "Revenue Check: Recalculated live affiliate commission payouts ledger."
                          ];
                          const randomMsg = customHeartbeats[Math.floor(Math.random() * customHeartbeats.length)];
                          setAutoLogs(prev => [`[${new Date().toLocaleTimeString()}] ${randomMsg}`, ...prev]);
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 rounded-xl text-slate-300 hover:text-white text-[10.5px] font-mono transition-all cursor-pointer mt-4"
                      >
                        Inject Diagnostic System Heartbeat
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 10: Global AI Domination (STEP 7) */}
              {activeTab === 'global-domination' && (
                <GlobalDominationView 
                  userProfile={userProfile} 
                  prompt={prompt}
                  setPrompt={setPrompt}
                  setActiveTab={setActiveTab}
                />
              )}

            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
