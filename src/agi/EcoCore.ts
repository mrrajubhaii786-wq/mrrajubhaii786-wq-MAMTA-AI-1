import { EconomyAI } from "./EconomyAI";
import { BusinessAI } from "./BusinessAI";
import { Orchestrator } from "./Orchestrator";
import { ResourceAI } from "./ResourceAI";
import { EcoRegistry } from "./EcoRegistry";
import { ClusterManager } from "./ClusterManager";
import { LiveConnector } from "./LiveConnector";
import { OAuthProd } from "./OAuthProd";

const economy = new EconomyAI();
const business = new BusinessAI();
const orchestrator = new Orchestrator();
const resource = new ResourceAI();
const registry = new EcoRegistry();
const clusters = new ClusterManager();
const connector = new LiveConnector();
const oauthProd = new OAuthProd();

export class EcoCore {
  run(goal: string) {
    const biz = business.run(goal);
    const money = economy.transact(100);
    const task = orchestrator.execute(biz);
    const load = resource.allocate(50);

    return {
      biz,
      money,
      task,
      load
    };
  }

  getState() {
    return {
      balance: economy.getBalance(),
      nodes: clusters.getActive(),
      registeredSystems: registry.getAll(),
      systemsDetails: registry.getDetails(),
    };
  }

  getConnector() {
    return connector;
  }

  getOAuthProd() {
    return oauthProd;
  }
}

export const ecoCoreInstance = new EcoCore();
