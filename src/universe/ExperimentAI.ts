import { WorldInstance } from "./WorldManager";

export interface ExperimentType {
  id: string;
  name: string;
  description: string;
  effect: string;
}

export class ExperimentAI {
  public availableExperiments: ExperimentType[] = [
    {
      id: "stimulus",
      name: "Liquid Cash Stimulus",
      description: "Direct capital distribution. Injects random cash flow up to $150 into every active consumer.",
      effect: "Increases consumer buying power instantly."
    },
    {
      id: "ai_hype",
      name: "AI Tech-Grooves Boom",
      description: "Fires localized viral marketing waves, shifting agent interests aggressively toward high-level AI products.",
      effect: "Pushes demand index up, updates user status to BUYING."
    },
    {
      id: "corporate_tax",
      name: "Corporate Tariff Protocol",
      description: "Imposes flat-rate system tax. Decreases client-side balances but sparks infrastructure supply surges.",
      effect: "Sinks money indexes, triggers BEAR market shift."
    },
    {
      id: "gig_subsidy",
      name: "AGI Freelance Gig Subsidy",
      description: "Launches state-sponsored gig portals, subsidizing freelancers with $200 for micro-model training contracts.",
      effect: "Saves low-capital agents from liquidation."
    }
  ];

  run(world: WorldInstance, experimentId: string): string {
    const timestamp = new Date().toLocaleTimeString();
    
    switch (experimentId) {
      case "stimulus":
        world.population.users.forEach(u => {
          const cash = Math.floor(Math.random() * 100) + 50;
          u.money += cash;
          u.lastAction = `Received $${cash} governmental stimulus.`;
        });
        world.demand += 25;
        world.events.unshift(`[${timestamp}] 🧪 [Experiment: Liquid Cash Stimulus] Injected direct helicopter capital! Demand surged.`);
        world.experimentsApplied.push("Liquid Cash Stimulus");
        return "Applied Liquid Cash Stimulus: Distributed capital boost to all users.";

      case "ai_hype":
        world.population.users.forEach(u => {
          u.interest = "AI";
          if (Math.random() > 0.3) {
            u.status = "BUYING";
            u.lastAction = "Overwhelmed by sovereign AI breakthroughs. Procuring agent assets.";
          }
        });
        world.demand += 50;
        world.trend = "BULL";
        world.events.unshift(`[${timestamp}] 🧪 [Experiment: AI Hype Boom] Viral media campaign triggered. Shifting world focus to 'AI' and forcing Bull cycle.`);
        world.experimentsApplied.push("AI Tech-Grooves Boom");
        return "Applied AI Hype Boom: Modified global interests and stimulated immediate demand.";

      case "corporate_tax":
        world.population.users.forEach(u => {
          const tax = Math.floor(u.money * 0.15); // 15% tax
          u.money = Math.max(20, u.money - tax);
          u.lastAction = `Paid $${tax} automated system transaction tax.`;
        });
        world.supply += 40;
        world.demand = Math.max(30, world.demand - 20);
        world.trend = "BEAR";
        world.events.unshift(`[${timestamp}] 🧪 [Experiment: Corporate Tariff Protocol] Mapped system-wide corporate tax. Liquidity reduced, forcing BEAR trend.`);
        world.experimentsApplied.push("Corporate Tariff Protocol");
        return "Applied Corporate Tariff: Taxed digital users, increasing supply reserves.";

      case "gig_subsidy":
        world.population.users.forEach(u => {
          if (u.money < 300) {
            u.money += 200;
            u.status = "SATISFIED";
            u.lastAction = "Participated in subsidized gig contract training AI bots.";
          }
        });
        world.demand += 10;
        world.events.unshift(`[${timestamp}] 🧪 [Experiment: AGI Freelance Gig Subsidy] Funded freelance training contracts for low-capital profiles.`);
        world.experimentsApplied.push("AGI Freelance Gig Subsidy");
        return "Applied Freelance Gig Subsidy: Protected low-capital profiles from exhaustion.";

      default:
        // Fallback default experiment behavior requested by user instructions
        world.population.users.forEach(u => {
          u.money += Math.floor(Math.random() * 50);
        });
        world.events.unshift(`[${timestamp}] 🧪 Applied generic experimental variable calibration.`);
        world.experimentsApplied.push("Generic Calibration");
        return "Experiment Applied: Distributed small cash variables.";
    }
  }
}
