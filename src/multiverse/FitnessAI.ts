export class FitnessAI {
  evaluate(world: any): number {
    if (!world || !world.population || !Array.isArray(world.population.users) || world.population.users.length === 0) {
      return 0;
    }

    let total = 0;
    world.population.users.forEach((u: any) => {
      total += u.money;
    });

    return Math.round((total / world.population.users.length) * 100) / 100;
  }
}
