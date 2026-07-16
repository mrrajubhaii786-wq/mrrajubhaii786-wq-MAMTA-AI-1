import { NodeManager } from "./NodeManager";
import { StateSync } from "./StateSync";
import { DistributedConsensus, VoteRecord } from "./DistributedConsensus";
import { GlobalOracle } from "./GlobalOracle";
import { NodeHealth } from "./NodeHealth";

export interface DistributedCycleOutput {
  timestamp: number;
  nodes: any[];
  approved: boolean;
  signals: any;
  nodeHealthStatus: any[];
  decision: string;
}

export class DistributedCore {
  public manager = new NodeManager();
  public sync = new StateSync();
  public consensus = new DistributedConsensus();
  public oracle = new GlobalOracle();
  public health = new NodeHealth();

  constructor() {
    this.init();
  }

  init() {
    this.manager.createNode("node-alpha");
    this.manager.createNode("node-beta");
    this.manager.createNode("node-gamma");
  }

  async runCycle(): Promise<DistributedCycleOutput> {
    const nodes = this.manager.getNodes();

    // 1. Fetch live Global Oracle data
    const signals = await this.oracle.fetch();

    // 2. Perform node health analysis (failure simulation & fault tolerance)
    const nodeHealthStatus = this.health.check(nodes);

    // 3. Collect consensus votes across nodes
    const votes: VoteRecord[] = nodeHealthStatus.map(node => {
      const isAlive = node.alive;
      const voteVal = isAlive ? (Math.random() > 0.25 ? "YES" : "NO") : "NO";
      return {
        nodeId: node.id,
        vote: voteVal,
        latency: isAlive ? Math.round(15 + Math.random() * 80) : 999
      };
    });

    // 4. Decide distributed consensus
    const approved = this.consensus.decide(votes);

    // 5. Update state on approved cycles
    if (approved) {
      nodes.forEach(n => {
        const isNodeAlive = nodeHealthStatus.find(h => h.id === n.id)?.alive;
        if (isNodeAlive) {
          n.update({ 
            signals,
            isHealthy: true,
            networkStatus: "CONNECTED"
          });
        } else {
          n.update({
            isHealthy: false,
            networkStatus: "DISCONNECTED"
          });
        }
      });
    }

    // 6. Sync state across distributed network
    this.sync.sync(nodes);

    const decision = approved ? "SYNC_COMMIT_SUCCESS" : "REJECT_CONSENSUS_FALLBACK";

    return {
      timestamp: Date.now(),
      nodes: nodes.map(n => ({
        id: n.id,
        state: { ...n.state },
        isAlive: nodeHealthStatus.find(h => h.id === n.id)?.alive ?? false
      })),
      approved,
      signals,
      nodeHealthStatus,
      decision
    };
  }
}

export const distributedCoreInstance = new DistributedCore();
