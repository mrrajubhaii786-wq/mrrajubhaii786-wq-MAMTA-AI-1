import { PopulationAI } from "../world/PopulationAI";

export interface WorldInstance {
  id: string;
  name: string;
  population: PopulationAI;
  demand: number;
  supply: number;
  trend: 'BULL' | 'BEAR';
  events: string[];
  experimentsApplied: string[];
  epochTime: number;
}

export class WorldManager {
  public worlds: WorldInstance[] = [];

  constructor() {
    // Generate some default worlds on launch
    this.createWorld("Swiss Chrome Core");
    this.createWorld("Alpha Centauri Hub");
    this.createWorld("Silicon Desert Oasis");
  }

  createWorld(name: string): WorldInstance {
    const population = new PopulationAI();
    population.generateUsers(20); // Generate 20 starting agents per world

    const world: WorldInstance = {
      id: `world_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name,
      population,
      demand: Math.floor(Math.random() * 120) + 60,
      supply: Math.floor(Math.random() * 100) + 50,
      trend: Math.random() > 0.5 ? 'BULL' : 'BEAR',
      events: [
        `🌍 [Genesis] World ${name} spawned successfully.`,
        "🧬 Initializing unique digital user profiles in this region."
      ],
      experimentsApplied: [],
      epochTime: 0
    };

    this.worlds.push(world);
    return world;
  }

  getWorlds(): WorldInstance[] {
    return this.worlds;
  }
}
