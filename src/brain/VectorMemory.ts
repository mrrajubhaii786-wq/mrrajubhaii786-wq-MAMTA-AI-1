export class VectorMemory {
  private memory: { text: string; vector: number[] }[] = [];

  async add(text: string, vector: number[]): Promise<void> {
    this.memory.push({ text, vector });
    if (this.memory.length > 500) {
      this.memory.shift(); // keep safe memory bounds
    }
  }

  async search(queryVector: number[]): Promise<string | null> {
    if (this.memory.length === 0) return null;

    let bestMatch: { text: string; vector: number[] } | null = null;
    let bestScore = -Infinity;

    for (const item of this.memory) {
      const score = this.cosineSimilarity(queryVector, item.vector);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    // Only return matches with a minimum semantic confidence score (e.g., 0.15)
    return bestScore > 0.15 && bestMatch ? bestMatch.text : null;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }
}
