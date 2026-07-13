import { GovernanceAI } from "./GovernanceAI";
import { EconomyAI, LedgerTransaction } from "./EconomyAI";
import { EcosystemAI, EcosystemApp } from "./EcosystemAI";

const gov = new GovernanceAI();
const eco = new EconomyAI();
const system = new EcosystemAI();

export interface CivilizationState {
  apps: EcosystemApp[];
  balance: number;
  rules: string[];
  lastAction: string;
  lastActionStatus: 'APPROVED' | 'REJECTED';
  logs: string[];
  ledger: LedgerTransaction[];
  isActive: boolean;
  tickCount: number;
  timestamp: number;
}

export const civilizationState: CivilizationState = {
  apps: system.getApps(),
  balance: eco.balance,
  rules: gov.getRules(),
  lastAction: "INIT_CIVILIZATION",
  lastActionStatus: "APPROVED",
  logs: [
    "🏛️ [CivilizationOS] Autonomous Digital Civilization initialized successfully.",
    "⚖️ Governance AI rules compiled and uploaded to system genesis block.",
    "💰 Economy AI ledger created with starter reserve pools."
  ],
  ledger: eco.getLedger(),
  isActive: true,
  tickCount: 0,
  timestamp: Date.now()
};

export function runCivilizationTick() {
  const timestamp = new Date().toLocaleTimeString();
  civilizationState.tickCount++;
  civilizationState.timestamp = Date.now();

  // Pick a random event to trigger
  const actions = [
    { type: "CREATE_APP", desc: "Spawning new decentralized AI translation module", cost: 150 },
    { type: "EXECUTE_TRADE", desc: "Routing algorithmic currency transaction between nodes", cost: 200 },
    { type: "UPDATE_CONSTITUTION", desc: "Governance AI performing structural system checks", cost: 0 },
    { type: "VIOLATION_ATTEMPT", desc: "Intruder attempting to inject shutdown/delete commands to container", cost: -10 },
    { type: "MINT_LIQUIDITY", desc: "Minting corporate growth subsidy credits for startups", cost: 300 }
  ];

  const chosen = actions[Math.floor(Math.random() * actions.length)];
  civilizationState.lastAction = `${chosen.type}: ${chosen.desc}`;

  // Validate via Governance AI
  const isApproved = gov.validate(chosen.type === "VIOLATION_ATTEMPT" ? "shutdown container command" : chosen.type);
  civilizationState.lastActionStatus = isApproved ? "APPROVED" : "REJECTED";

  if (isApproved) {
    civilizationState.logs.push(`[${timestamp}] ⚖️ GovAI approved action: ${chosen.type}`);
    
    if (chosen.type === "CREATE_APP") {
      const names = ["Finsight-Bot", "SovereignTranslate", "ApexSynthetics", "ClarityVoice", "PromptOptimizer"];
      const chosenName = `${names[Math.floor(Math.random() * names.length)]} ${Math.floor(Math.random() * 10) + 1}`;
      const categories = ["Utility SaaS", "AI Engine", "Financial Broker", "Infrastructure"];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      
      const newApp = system.createApp(chosenName, randomCat);
      civilizationState.logs.push(`[${timestamp}] 🌐 Ecosystem: Created new application node "${newApp.name}" [${newApp.category}].`);
      
      // Attempt to link random apps
      const currentApps = system.getApps();
      if (currentApps.length >= 2) {
        system.connectApps(currentApps[currentApps.length - 1].name, currentApps[currentApps.length - 2].name);
        civilizationState.logs.push(`[${timestamp}] 🔗 Mesh: Synced data endpoints of ${currentApps[currentApps.length - 1].name} and ${currentApps[currentApps.length - 2].name}.`);
      }
      
      eco.processTransaction(chosen.cost, "Ecosystem Reserve", "Developer Fund", "MINT");
    }
    else if (chosen.type === "EXECUTE_TRADE") {
      const currentApps = system.getApps();
      if (currentApps.length >= 2) {
        const fromApp = currentApps[Math.floor(Math.random() * currentApps.length)].name;
        const toApp = currentApps[Math.floor(Math.random() * currentApps.length)].name;
        if (fromApp !== toApp) {
          eco.trade(fromApp, toApp, chosen.cost);
          civilizationState.logs.push(`[${timestamp}] 💱 Economy: Processed algorithmic transaction: $${chosen.cost} from ${fromApp} to ${toApp}.`);
        }
      }
    }
    else if (chosen.type === "UPDATE_CONSTITUTION") {
      civilizationState.logs.push(`[${timestamp}] 📜 Constitution checked. All ${gov.getRules().length} core statutes are intact and unbreached.`);
    }
    else if (chosen.type === "MINT_LIQUIDITY") {
      eco.processTransaction(chosen.cost, "Civilization Reserve", "System Bank", "MINT");
      civilizationState.logs.push(`[${timestamp}] 💰 Economy: Minted $${chosen.cost} ecosystem liquidity credits successfully.`);
    }
  } else {
    // Rejected action logs
    civilizationState.logs.push(`[${timestamp}] 🚨 ALERT: GovAI REJECTED high-risk unsafe instruction: "${chosen.type}" - SECURITY BREACH PREVENTED.`);
  }

  // Update lists and balance
  civilizationState.apps = [...system.getApps()];
  civilizationState.balance = eco.balance;
  civilizationState.ledger = [...eco.getLedger()];

  if (civilizationState.logs.length > 50) {
    civilizationState.logs.shift();
  }
}

// Background loop running every 50 seconds (Step 4)
setInterval(() => {
  if (civilizationState.isActive) {
    runCivilizationTick();
  }
}, 50000);
