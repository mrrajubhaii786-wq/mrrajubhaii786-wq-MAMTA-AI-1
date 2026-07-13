import { WorldManager, WorldInstance } from "./WorldManager";
import { ExperimentAI } from "./ExperimentAI";
import { LearningAI } from "./LearningAI";
import { BehaviorAI } from "../world/BehaviorAI";
import { WebSocketServer, WebSocket } from "ws";

const manager = new WorldManager();
const experiment = new ExperimentAI();
const learning = new LearningAI();
const behavior = new BehaviorAI();

export interface UniverseSimulationState {
  worlds: WorldInstance[];
  isActive: boolean;
  tickCount: number;
  learningObservations: any[];
  autoPlan: string;
  logs: string[];
}

export const universeSimulationState: UniverseSimulationState = {
  worlds: manager.getWorlds(),
  isActive: true,
  tickCount: 0,
  learningObservations: learning.getObservations(),
  autoPlan: learning.getImprovementPlan(),
  logs: [
    "🌌 [Universe Engine Core] Initializing multi-world execution matrices.",
    "🚀 [World Boot] Standard simulated planets spawned: Swiss Chrome Core, Alpha Centauri Hub, Silicon Desert Oasis.",
    "🛡️ [Sync Node] Real-time WebSocket synchronization pipelines active."
  ]
};

// Keep list of connected WebSocket clients
const connectedClients: Set<WebSocket> = new Set();

export function runUniverseTick() {
  if (!universeSimulationState.isActive) return;

  universeSimulationState.tickCount++;
  const timestamp = new Date().toLocaleTimeString();
  const currentTickLogs: string[] = [];

  universeSimulationState.worlds.forEach((world) => {
    world.epochTime++;
    
    // 1. Update supply and demand volatility in this world
    world.demand += Math.floor(Math.random() * 12 - 6);
    world.supply += Math.floor(Math.random() * 8 - 4);
    if (world.demand < 30) world.demand = 30;
    if (world.supply < 30) world.supply = 30;
    world.trend = world.demand > world.supply ? 'BULL' : 'BEAR';

    // 2. Simulate random agent behaviors in this world
    world.population.users.forEach((user) => {
      behavior.act(user, world.trend, world.demand);
    });

    // 3. Autonomous Experiment applying occasionally
    if (universeSimulationState.tickCount % 4 === 0) {
      const expList = ["stimulus", "ai_hype", "corporate_tax", "gig_subsidy"];
      const randomExp = expList[Math.floor(Math.random() * expList.length)];
      experiment.run(world, randomExp);
      currentTickLogs.push(`[${timestamp}] 🧪 [Auto-Experiment] Injected experiment '${randomExp}' into world '${world.name}'.`);
    }

    // 4. Learning Engine records this world state
    learning.learn(world);

    // 5. Generate random world-specific events occasionally
    if (Math.random() > 0.6) {
      const eventsPool = [
        "Sovereign node mesh bandwidth expanded by 40%",
        "Quantum computing breakthrough lowers agent cost thresholds",
        "Algorithmic transaction liquidity taxes processed",
        "Regional firewall successfully neutralized foreign port attack vectors"
      ];
      const selectedEvt = eventsPool[Math.floor(Math.random() * eventsPool.length)];
      world.events.unshift(`[Tick ${world.epochTime}] 📡 ${selectedEvt}`);
      if (world.events.length > 20) world.events.pop();
    }
  });

  // Update master learning plans
  universeSimulationState.learningObservations = [...learning.getObservations()];
  universeSimulationState.autoPlan = learning.getImprovementPlan();

  // Push universe-level logs
  currentTickLogs.push(`[${timestamp}] 🌌 [Universe Epoch] Processed tick index ${universeSimulationState.tickCount}. Syncing client nodes.`);
  universeSimulationState.logs.unshift(...currentTickLogs);
  if (universeSimulationState.logs.length > 40) {
    universeSimulationState.logs = universeSimulationState.logs.slice(0, 40);
  }

  // Broadcast updates to all WebSocket clients
  broadcastToAll({
    type: "UNIVERSE_TICK",
    tick: universeSimulationState.tickCount,
    timestamp,
    worlds: universeSimulationState.worlds.map(w => ({
      id: w.id,
      name: w.name,
      populationCount: w.population.users.length,
      demand: w.demand,
      supply: w.supply,
      trend: w.trend
    })),
    plan: universeSimulationState.autoPlan
  });
}

function broadcastToAll(message: any) {
  const payload = JSON.stringify(message);
  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Background simulation trigger (every 30 seconds as specified)
setInterval(() => {
  if (universeSimulationState.isActive) {
    runUniverseTick();
  }
}, 30000);

// Initialize WebSocket server attached to the main Express server
export function initUniverseSockets(server: any) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request: any, socket: any, head: any) => {
    // Only accept path matching /api/universe/ws to avoid intercepting other upgrade events like Vite HMR
    const requestUrl = request.url || "";
    let pathname = "";
    try {
      const url = new URL(requestUrl, `http://${request.headers.host || "localhost"}`);
      pathname = url.pathname;
    } catch (e) {
      pathname = requestUrl.split("?")[0];
    }

    if (pathname === "/api/universe/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    connectedClients.add(ws);
    
    // Send immediate connection acknowledge
    ws.send(JSON.stringify({ 
      type: "CONNECT_ACK", 
      message: "🌍 Universe Connected", 
      time: Date.now(),
      tick: universeSimulationState.tickCount
    }));

    ws.on("close", () => {
      connectedClients.delete(ws);
    });

    ws.on("error", (err) => {
      console.error("WebSocket client connection error:", err);
      connectedClients.delete(ws);
    });
  });

  console.log("🌌 WebSocket Sync System initialized on active production server port.");
}

// Export individual actions
export function triggerExperimentOnWorld(worldId: string, experimentId: string): { success: boolean; message: string } {
  const world = universeSimulationState.worlds.find(w => w.id === worldId);
  if (!world) {
    return { success: false, message: "World node not found in universe." };
  }
  const result = experiment.run(world, experimentId);
  
  // Re-learn state instantly
  learning.learn(world);
  universeSimulationState.learningObservations = [...learning.getObservations()];
  universeSimulationState.autoPlan = learning.getImprovementPlan();

  broadcastToAll({
    type: "EXPERIMENT_TRIGGERED",
    worldId,
    message: result,
    plan: universeSimulationState.autoPlan
  });

  return { success: true, message: result };
}

export function createNewWorldInUniverse(name: string): WorldInstance {
  const newWorld = manager.createWorld(name);
  universeSimulationState.worlds = [...manager.getWorlds()];
  
  universeSimulationState.logs.unshift(`[${new Date().toLocaleTimeString()}] 🪐 Created new simulation world node: '${name}'`);
  
  broadcastToAll({
    type: "WORLD_CREATED",
    world: {
      id: newWorld.id,
      name: newWorld.name,
      populationCount: newWorld.population.users.length,
      demand: newWorld.demand,
      supply: newWorld.supply,
      trend: newWorld.trend
    }
  });

  return newWorld;
}
