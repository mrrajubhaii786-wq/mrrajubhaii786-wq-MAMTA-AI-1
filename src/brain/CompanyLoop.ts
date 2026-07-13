import { CEOAI } from "./CEOAI";
import { launchProduct } from "./LaunchAI";
import { UserEngine } from "../system/UserEngine";
import { RevenueEngine } from "../system/RevenueEngine";
import { ScaleEngine } from "../system/ScaleEngine";

const ceo = new CEOAI();
const userEngine = new UserEngine();
const revenueEngine = new RevenueEngine();
const scaleEngine = new ScaleEngine();

export interface CompanyState {
  revenue: number;
  users: number;
  products: any[];
  logs: string[];
  lastDecision: string;
  isActive: boolean;
  mrr: number;
  cash: number;
}

// Global company state
export const companyState: CompanyState = {
  revenue: 85,
  users: 480,
  products: [
    { product: "Mamta AI Analytics", launch: "Live on mamta.ai", marketing: "Auto campaign started", timestamp: Date.now() - 86400000 }
  ],
  logs: [
    "🚀 [CompanyEngine] Mamta AI Startup Engine initialized successfully.",
    "📊 Initial company metrics: Users: 480, Revenue: $85/mo MRR."
  ],
  lastDecision: "FOCUS_MARKETING",
  isActive: true,
  mrr: 85,
  cash: 1250
};

export function runCompanyTick() {
  const timestamp = new Date().toLocaleTimeString();
  
  // Decide next move
  const decision = ceo.decideNextMove({
    revenue: companyState.revenue,
    users: companyState.users
  });
  
  companyState.lastDecision = decision;
  companyState.logs.push(`[${timestamp}] 🧠 CEO Decision: ${decision}`);
  console.log(`🧠 [CompanyLoop] CEO Decision: ${decision}`);

  if (decision === "FOCUS_MARKETING") {
    const newUsers = Math.floor(Math.random() * 120) + 40;
    companyState.users += newUsers;
    
    // User engine operations
    const simUser = { email: `cohort_user_${Math.floor(Math.random()*1000)}@gmail.com` };
    userEngine.onboard(simUser);
    userEngine.trackActivity(simUser);
    
    companyState.logs.push(`[${timestamp}] 📈 UserEngine: Onboarded fresh cohort. Users: +${newUsers}.`);
  } 
  else if (decision === "SCALE_INFRA") {
    const scaleResult = scaleEngine.scale(companyState.users);
    userEngine.retention({ email: "active_base@gmail.com" });
    
    companyState.logs.push(`[${timestamp}] ⚙️ ScaleEngine: Triggered horizontal scaling to ${scaleResult.pods} pods.`);
  } 
  else if (decision === "BUILD_NEW_PRODUCT") {
    const apps = ["Finsight OS", "DevOps Copilot", "SaaS Boilerplate AI", "AvatarStream Engine", "VoiceClone Hub"];
    const chosenName = apps[Math.floor(Math.random() * apps.length)] + ` v${(Math.random() * 2 + 1).toFixed(1)}`;
    const product = launchProduct(chosenName);
    
    companyState.products.push(product);
    
    const payment = revenueEngine.processPayment({ email: "buyer_agent@mamta.ai" });
    const boost = Math.floor(Math.random() * 60) + 35;
    companyState.revenue += boost;
    companyState.cash += boost * 5;
    revenueEngine.trackRevenue(boost);

    companyState.logs.push(`[${timestamp}] 🚀 LaunchAI: Launched product "${chosenName}" live on mamta.ai!`);
    companyState.logs.push(`[${timestamp}] 💰 RevenueEngine: Secured recurring subscription, added +$${boost}/mo MRR.`);
  }

  // Cap logs length
  if (companyState.logs.length > 50) {
    companyState.logs.shift();
  }
}

// Autonomous background loop running every 30 seconds (Step 6)
setInterval(() => {
  if (companyState.isActive) {
    runCompanyTick();
  }
}, 30000);
