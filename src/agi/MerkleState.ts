import crypto from "crypto";

export class MerkleState {
  hash(data: string) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}
