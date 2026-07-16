import { GlobalNodeManager } from "./GlobalNodeManager";
import { GlobalCompute } from "./GlobalCompute";
import { GlobalConsensus } from "./GlobalConsensus";
import { ShardManager } from "./ShardManager";

export class GlobalCore {
  manager = new GlobalNodeManager();
  compute = new GlobalCompute();
  consensus = new GlobalConsensus();
  shard = new ShardManager();

  init() {
    this.manager.createNode("node-us", "US", [37.0902, -95.7129], "54.210.15.22");
    this.manager.createNode("node-eu", "EU", [50.1109, 8.6821], "3.120.45.191");
    this.manager.createNode("node-asia", "ASIA", [35.6762, 139.6503], "18.182.204.5");
  }

  run(data: any) {
    const nodes = this.manager.getNodes();
    
    // Update latencies to show real-time live ping noise in UI
    nodes.forEach(node => node.updateLatency());

    const consensusResult = this.consensus.run(nodes);
    const approved = consensusResult.approved;

    if (!approved) {
      return {
        approved: false,
        status: "REJECTED",
        votes: consensusResult.votes,
        timestamp: Date.now()
      };
    }

    const result = this.compute.process(data);

    // Randomize keys occasionally to demonstrate state sharding in shard partition grid
    const shardKey = `global-data-${Math.floor(Math.random() * 100)}`;
    this.shard.assign(shardKey, result);

    return {
      approved: true,
      status: "APPROVED",
      votes: consensusResult.votes,
      result: result,
      shardKey: shardKey,
      timestamp: Date.now()
    };
  }
}
