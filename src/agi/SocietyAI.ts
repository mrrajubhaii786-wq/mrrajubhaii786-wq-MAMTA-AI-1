export class SocietyAI {
  citizens: number = 250; // Initialize with a small seed population
  growthRate: number = 10;

  grow() {
    this.citizens += this.growthRate;
    return this.citizens;
  }

  getPopulation() {
    return this.citizens;
  }
}
