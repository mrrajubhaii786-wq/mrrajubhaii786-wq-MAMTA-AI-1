import { PopulationAI, User } from "./PopulationAI";
import { BehaviorAI } from "./BehaviorAI";
import { MarketAI } from "./MarketAI";
import { WorldState } from "./WorldState";

const pop = new PopulationAI();
const behavior = new BehaviorAI();
const market = new MarketAI();
const world = new WorldState();

export interface WorldSimulationState {
  users: User[];
  trend: 'BULL' | 'BEAR';
  time: number;
  events: string[];
  demand: number;
  supply: number;
  isActive: boolean;
  logs: string[];
  lastUpdate: number;
}

export const worldSimulationState: WorldSimulationState = {
  users: pop.getUsers(),
  trend: market.getTrend(),
  time: world.time,
  events: world.getEvents(),
  demand: market.demand,
  supply: market.supply,
  isActive: true,
  logs: [
    "🌍 [Simulation Init] Populating 50 synthetic human agent models.",
    "🧬 [Behavior Config] Standard purchase models and finance drivers mapped.",
    "💹 [Market Indexer] Initiating Bull/Bear supply-demand indices."
  ],
  lastUpdate: Date.now()
};

export function runWorldSimulationTick() {
  world.tick();
  market.update();

  const timestamp = new Date().toLocaleTimeString();
  const trend = market.getTrend();
  const currentLogs: string[] = [];

  // Run behavior acts for users
  pop.users.forEach(user => {
    const outcome = behavior.act(user, trend, market.demand);
    if (Math.random() > 0.85) {
      currentLogs.push(`[${timestamp}] ${outcome.log}`);
    }
  });

  // Push some market update indicators
  currentLogs.push(`[${timestamp}] 📊 Market Index updated: Demand=${market.demand}, Supply=${market.supply}. Trend=${trend}.`);

  // Merge back to global state
  worldSimulationState.users = [...pop.users];
  worldSimulationState.trend = trend;
  worldSimulationState.time = world.time;
  worldSimulationState.events = [...world.getEvents()];
  worldSimulationState.demand = market.demand;
  worldSimulationState.supply = market.supply;
  worldSimulationState.lastUpdate = Date.now();

  // Push new logs
  worldSimulationState.logs.unshift(...currentLogs);
  if (worldSimulationState.logs.length > 60) {
    worldSimulationState.logs = worldSimulationState.logs.slice(0, 60);
  }
}

// Background simulation trigger (every 40 seconds)
setInterval(() => {
  if (worldSimulationState.isActive) {
    runWorldSimulationTick();
  }
}, 40000);
