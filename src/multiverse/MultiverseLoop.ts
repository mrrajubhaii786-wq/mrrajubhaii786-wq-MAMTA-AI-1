import { MultiverseManager, UniverseInstance } from "./MultiverseManager";
import { IntelligenceAI } from "./IntelligenceAI";
import { EvolutionAI } from "./EvolutionAI";
import { FitnessAI } from "./FitnessAI";
import { SharedMemory, MemoryRecord } from "./SharedMemory";

const manager = new MultiverseManager();
const intelligence = new IntelligenceAI();
const evolution = new EvolutionAI();
const fitness = new FitnessAI();
const memory = new SharedMemory();

// Spawn default universe
const universe = manager.createUniverse("Sovereign Multiverse-1");

export interface MultiverseSimulationState {
  universes: UniverseInstance[];
  memoryHistory: MemoryRecord[];
  bestModel: MemoryRecord | null;
  isActive: boolean;
  tickCount: number;
  logs: string[];
}

export const multiverseSimulationState: MultiverseSimulationState = {
  universes: manager.universes,
  memoryHistory: [],
  bestModel: null,
  isActive: true,
  tickCount: 0,
  logs: [
    "🌌 [Multiverse Boot] Self-evolving Multiverse Intelligence Core spawned.",
    "🧬 [Neural Lattice] Linked Sirius-X Prime Node, Andromeda Hyper Core, and MilkyWay Frontier Alpha.",
    "🛡️ [Lattice Guard] Connected Shared Memory Mesh for real-time model verification."
  ]
};

export function runMultiverseTick() {
  if (!multiverseSimulationState.isActive) return;

  multiverseSimulationState.tickCount++;
  const timestamp = new Date().toLocaleTimeString();
  const currentTickLogs: string[] = [];

  multiverseSimulationState.universes.forEach((univ) => {
    univ.worlds.forEach((world) => {
      // 1. Generate new intelligence model
      const model = intelligence.generateModel();

      // 2. Evolve the world using the model
      evolution.evolve(world, model);

      // 3. Evaluate world's fitness
      const score = fitness.evaluate(world);

      // 4. Save to shared memory mesh
      const record: MemoryRecord = {
        model,
        score,
        timestamp,
        worldName: world.name
      };
      memory.save(record);

      currentTickLogs.push(
        `[${timestamp}] 🧬 [Evolution] World '${world.name}' evolved with model (Strategy: ${model.strategy.toFixed(2)}, Risk: ${model.risk.toFixed(2)}, Behavior: ${model.behavior}). Score: ${score.toFixed(1)}.`
      );

      // Generate localized events occasionally
      if (Math.random() > 0.7) {
        const localEvents = [
          `Lattice density stabilized under strategy '${model.behavior}'.`,
          `High-yield financial model successfully backtested in ${world.name}.`,
          `Autonomous cognitive optimization triggered.`
        ];
        const event = localEvents[Math.floor(Math.random() * localEvents.length)];
        world.events.unshift(`[Tick ${multiverseSimulationState.tickCount}] 📡 ${event}`);
        if (world.events.length > 15) world.events.pop();
      }
    });
  });

  // Keep records and best models synced
  multiverseSimulationState.memoryHistory = [...memory.getHistory()];
  multiverseSimulationState.bestModel = memory.getBest() || null;

  // Add system-level logs
  currentTickLogs.push(`[${timestamp}] 🌌 [Multiverse Epoch] Step ${multiverseSimulationState.tickCount} completed. Universes synced.`);
  multiverseSimulationState.logs.unshift(...currentTickLogs);
  if (multiverseSimulationState.logs.length > 30) {
    multiverseSimulationState.logs = multiverseSimulationState.logs.slice(0, 30);
  }
}

// Background auto-run interval
setInterval(() => {
  if (multiverseSimulationState.isActive) {
    runMultiverseTick();
  }
}, 30000);
