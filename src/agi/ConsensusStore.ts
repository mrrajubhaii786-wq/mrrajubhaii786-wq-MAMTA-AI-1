import fs from "fs";
import path from "path";

export class ConsensusStore {
  private filePath = path.join(process.cwd(), "consensus.json");

  saveVote(data: any) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  loadVote() {
    if (!fs.existsSync(this.filePath)) {
      return {
        votes: [],
        decision: "NO_ACTION",
        timestamp: Date.now()
      };
    }
    try {
      return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    } catch {
      return {
        votes: [],
        decision: "NO_ACTION",
        timestamp: Date.now()
      };
    }
  }
}
