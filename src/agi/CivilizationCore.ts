import { SocietyAI } from "./SocietyAI";
import { GovernanceAI } from "./GovernanceAI";
import { PolicyAI } from "./PolicyAI";
import { CivilizationAgents } from "./CivilizationAgents";

const society = new SocietyAI();
const gov = new GovernanceAI();
const policy = new PolicyAI();
const agents = new CivilizationAgents();

export class CivilizationCore {
  private history: Array<any> = [];

  run() {
    const pop = society.grow();
    const law = gov.enforce("normal");
    const mode = policy.decide({ risk: 2 });
    const assign = agents.assign("build");

    const result = {
      pop,
      law,
      mode,
      assign,
      timestamp: Date.now()
    };

    this.history.push(result);
    if (this.history.length > 50) {
      this.history.shift(); // Keep history size small
    }

    return result;
  }

  getLatestState() {
    return {
      pop: society.getPopulation(),
      rules: gov.getRules(),
      mode: policy.getMode(),
      agents: agents.getAgents()
    };
  }

  getHistory() {
    return this.history;
  }
}
export const civilizationCore = new CivilizationCore();
