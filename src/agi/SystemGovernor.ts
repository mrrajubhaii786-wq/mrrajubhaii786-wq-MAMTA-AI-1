import { SystemRegistry } from "./SystemRegistry";
import { PriorityAI } from "./PriorityAI";
import { ConflictAI } from "./ConflictAI";
import { ResolutionAI } from "./ResolutionAI";
import { GlobalOracle } from "./GlobalOracle";
import { SecureAuth } from "./SecureAuth";
import { UITestAI } from "./UITestAI";
import { NodeSync } from "./NodeSync";

const registry = new SystemRegistry();
const priority = new PriorityAI();
const conflict = new ConflictAI();
const resolve = new ResolutionAI();
const oracle = new GlobalOracle();
const secureAuth = new SecureAuth();
const uiTestAI = new UITestAI();
const nodeSync = new NodeSync();

export interface GovernorControlResult {
  systems: string[];
  signals: {
    market: "BULL" | "BEAR" | "STABLE";
    infra: "HEALTHY" | "DEGRADED" | "CRITICAL";
    load: number;
    timestamp: number;
  };
  priority: "STABILIZE" | "OPTIMIZE" | "EXPAND";
  conflict: boolean;
  decision: "SAFE_MODE" | "PROCEED";
  uiValidation: any;
  nodeSyncStatus: any[];
  timestamp: number;
}

export class SystemGovernor {
  async control(state: { health: number }, actions: string[]): Promise<GovernorControlResult> {
    const systems = registry.getSystems();
    const signals = await oracle.fetch();

    const priorityLevel = priority.assign({
      health: state.health,
      load: signals.load
    });

    const hasConflict = conflict.detect(actions);
    const decision = resolve.resolve(hasConflict);

    // Run additional systems validation & node coordination
    const uiValidation = uiTestAI.runUI();
    const nodeSyncStatus = nodeSync.sync(["NODE_MAIN_GOVERNOR", "NODE_FAILOVER_SECURE", "NODE_EDGE_DISTRIBUTED"]);

    return {
      systems,
      signals,
      priority: priorityLevel,
      conflict: hasConflict,
      decision,
      uiValidation,
      nodeSyncStatus,
      timestamp: Date.now()
    };
  }

  verifySecuritySignature(signature?: string) {
    return secureAuth.verify(signature);
  }

  getResolutionConfig(decision: "SAFE_MODE" | "PROCEED") {
    return resolve.getResolutionStrategy(decision);
  }
}
