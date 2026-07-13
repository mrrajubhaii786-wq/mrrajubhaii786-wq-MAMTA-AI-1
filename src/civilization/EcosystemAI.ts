export interface EcosystemApp {
  name: string;
  category: string;
  version: string;
  status: 'ONLINE' | 'UPGRADING' | 'STANDBY';
  connections: string[];
}

export class EcosystemAI {
  public apps: EcosystemApp[] = [
    { name: "Mamta Translate Core", category: "AI Linguistic", version: "v1.0", status: "ONLINE", connections: ["FinSight OS"] },
    { name: "Sovereign Ledger", category: "DeFi", version: "v2.1", status: "ONLINE", connections: ["Mamta Translate Core"] },
    { name: "Finsight OS", category: "Corporate", version: "v4.0", status: "ONLINE", connections: ["Sovereign Ledger"] }
  ];

  createApp(name: string, category: string = "Micro-SaaS") {
    const app: EcosystemApp = {
      name,
      category,
      version: "v1.0",
      status: "ONLINE",
      connections: []
    };
    this.apps.push(app);
    console.log("🌐 Registered new civilization app:", name);
    return app;
  }

  connectApps(a: string, b: string) {
    const appA = this.apps.find(app => app.name === a);
    const appB = this.apps.find(app => app.name === b);
    
    if (appA && appB) {
      if (!appA.connections.includes(b)) appA.connections.push(b);
      if (!appB.connections.includes(a)) appB.connections.push(a);
      console.log(`🔗 Ecosystem Mesh Link: ${a} ➔ ${b}`);
    }
  }

  getApps() {
    return this.apps;
  }
}
