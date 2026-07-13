import { CompanyManager } from "./CompanyManager";
import { EmpireAI } from "./EmpireAI";
import { MarketAI } from "../brain/MarketAI";
import { Network } from "./Network";

const manager = new CompanyManager();
const empire = new EmpireAI();
const market = new MarketAI();
const network = new Network();

export interface EmpireState {
  companies: any[];
  marketData: any;
  lastDecision: string;
  logs: string[];
  networkLogs: string[];
  isActive: boolean;
  totalRevenue: number;
  totalUsers: number;
  totalCash: number;
}

export const empireState: EmpireState = {
  companies: manager.getAll(),
  marketData: market.analyze(),
  lastDecision: "CREATE_NEW_COMPANY",
  logs: [
    "🚀 [EmpireEngine] Autonomous Multi-Company Network initialized.",
    "🌍 Establishing initial corporate portfolio nodes."
  ],
  networkLogs: [],
  isActive: true,
  totalRevenue: 420,
  totalUsers: 2080,
  totalCash: 7450
};

export function runEmpireTick() {
  const timestamp = new Date().toLocaleTimeString();
  
  // Tick existing companies to simulate dynamic metrics
  manager.tickCompanies();
  
  const companies = manager.getAll();
  const marketData = market.analyze();
  empireState.marketData = marketData;
  empireState.companies = [...companies];

  // Recalculate totals
  empireState.totalRevenue = companies.reduce((sum, c) => sum + (c.revenue || 0), 0);
  empireState.totalUsers = companies.reduce((sum, c) => sum + (c.users || 0), 0);
  empireState.totalCash = companies.reduce((sum, c) => sum + (c.cash || 0), 0);

  // Empire AI Strategy decision
  const decision = empire.decideExpansion(companies);
  empireState.lastDecision = decision;
  empireState.logs.push(`[${timestamp}] 🧠 Empire Brain: ${decision}`);

  if (decision === "CREATE_NEW_COMPANY") {
    // Generate trending niches/names
    const niches = ["AI Agent workflows", "DevOps Copilot", "Audio Streamers", "Legaltech AI", "B2B SaaS Engine"];
    const randomNiche = niches[Math.floor(Math.random() * niches.length)];
    const prefixes = ["Nexus", "Aether", "Sovereign", "Omni", "Synthetix", "Prism", "Clarity"];
    const chosenName = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${randomNiche.split(' ')[0]}`;
    
    const newCo = manager.createCompany(chosenName, randomNiche);
    empireState.logs.push(`[${timestamp}] 🏢 Created brand new enterprise: "${newCo.name}" under niche "${newCo.niche}".`);
    
    // Relay market insights via Inter-Company Network
    network.send("Empire Headquarters", newCo.name, { marketDemand: marketData.demand, trends: marketData.trending });
  } 
  else if (decision === "SCALE_GLOBAL_NETWORK") {
    empireState.logs.push(`[${timestamp}] ⚡ Scaling global network operations across all ${companies.length} nodes.`);
    
    if (companies.length >= 2) {
      // simulate inter-company data sharing
      network.send(companies[0].name, companies[1].name, { payload: "Cross-cohort training weights sharing" });
    }
  }
  else if (decision === "OPTIMIZE_EXISTING") {
    // optimize lowest revenue company
    const sorted = [...companies].sort((a, b) => a.revenue - b.revenue);
    if (sorted.length > 0) {
      const lowCo = sorted[0];
      lowCo.status = 'OPTIMIZING';
      lowCo.revenue += 25;
      lowCo.cash += 150;
      empireState.logs.push(`[${timestamp}] ⚙️ Optimizing operations for "${lowCo.name}". Bootstrapped revenue by +$25/mo.`);
      network.send("Empire HQ Optimizer", lowCo.name, { patch: "Enterprise monetization playbook applied" });
    }
  }

  // capture network logs
  empireState.networkLogs = network.getLogs();

  // Cap log length
  if (empireState.logs.length > 50) {
    empireState.logs.shift();
  }
}

// Background loop running every 40 seconds (Step 5)
setInterval(() => {
  if (empireState.isActive) {
    runEmpireTick();
  }
}, 40000);
