export class GeoNode {
  id: string;
  region: string;
  latency: number;
  weight: number;
  vote: "YES" | "NO";
  ip: string;
  coords: [number, number]; // [lat, lng] for rendering on world map

  constructor(id: string, region: string, coords: [number, number], ip: string) {
    this.id = id;
    this.region = region;
    this.latency = Math.round(15 + Math.random() * 185);
    this.weight = Math.round(1 + Math.random() * 9); // Weighted trust score
    this.vote = "YES";
    this.ip = ip;
    this.coords = coords;
  }

  updateLatency() {
    this.latency = Math.round(15 + Math.random() * 185);
  }

  castVote() {
    this.vote = Math.random() > 0.3 ? "YES" : "NO";
    return this.vote;
  }
}
