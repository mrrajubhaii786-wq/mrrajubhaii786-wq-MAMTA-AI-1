export class ClusterManager {
  nodes = ["aws-us", "gcp-eu", "azure-asia"];

  getActive() {
    return this.nodes.map(n => ({
      node: n,
      status: "ACTIVE",
      load: Math.floor(Math.random() * 40) + 20, // simulated default load
      uptime: "99.99%"
    }));
  }
}
