export class WorldState {
  public time: number = 0;
  public events: string[] = [
    "🌍 [System Genesis] World Simulation Matrix fully synchronized.",
    "📈 Federal reserve declares algorithmic market stimulus active."
  ];

  tick() {
    this.time++;

    const dynamicEvents = [
      "🚀 Decentralized AGI startup cluster initiates node merger",
      "🔥 Global chip shortgage increases AI node hosting rates",
      "📣 Viral campaign pushes Mamta translation nodes to trend #1",
      "⚠️ Security check: Minor server DDoS mitigated by Governance firewall",
      "🏦 Corporate venture capital pumps $5M into ecosystem startup group",
      "💎 Blockchain gas fees drop; decentralized transactions scale up"
    ];

    if (this.time % 3 === 0) {
      const chosenEvent = dynamicEvents[Math.floor(Math.random() * dynamicEvents.length)];
      this.events.unshift(`[Tick ${this.time}] ${chosenEvent}`);
      
      if (this.events.length > 30) {
        this.events.pop();
      }
    }
  }

  getEvents() {
    return this.events;
  }
}
