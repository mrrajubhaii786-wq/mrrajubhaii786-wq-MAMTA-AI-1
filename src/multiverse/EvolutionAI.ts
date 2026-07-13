export class EvolutionAI {
  evolve(world: any, model: any) {
    if (!world || !world.population || !Array.isArray(world.population.users)) return;
    world.population.users.forEach((u: any) => {
      // Modify agents' wealth based on strategy factor and a risk factor multiplier
      const gain = model.strategy * 12 * (model.risk > 0.5 ? 1.5 : 0.8);
      u.money = Math.round((u.money + gain) * 100) / 100;
      u.lastAction = `Model '${model.behavior}' updated strategy to ${model.strategy.toFixed(2)}`;
    });
  }
}
