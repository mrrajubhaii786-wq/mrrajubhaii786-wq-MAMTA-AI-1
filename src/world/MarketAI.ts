export class MarketAI {
  public demand: number = 100;
  public supply: number = 100;

  update() {
    this.demand += Math.floor(Math.random() * 16 - 8); // fluctuate -8 to +8
    this.supply += Math.floor(Math.random() * 12 - 6);  // fluctuate -6 to +6

    // Bound limits to keep simulation realistic
    if (this.demand < 30) this.demand = 30;
    if (this.demand > 300) this.demand = 300;
    if (this.supply < 30) this.supply = 30;
    if (this.supply > 300) this.supply = 300;
  }

  getTrend(): 'BULL' | 'BEAR' {
    if (this.demand > this.supply) return "BULL";
    return "BEAR";
  }

  getNicheTrend(): { niche: string; factor: number }[] {
    return [
      { niche: "Linguistic AI Agents", factor: Math.floor(this.demand * 1.2) },
      { niche: "Sovereign Ledger Networks", factor: Math.floor(this.demand * 0.9 + this.supply * 0.2) },
      { niche: "Cloned Synthetics & Voice", factor: Math.floor(this.demand * 1.5) }
    ];
  }
}
