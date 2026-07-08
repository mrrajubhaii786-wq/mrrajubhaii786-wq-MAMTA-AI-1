import { VectorMemory } from "./VectorMemory";
import { EmbeddingEngine } from "./EmbeddingEngine";

export class RAGEngine {
  public memory = new VectorMemory();
  public embedder = new EmbeddingEngine();

  async retrieveContext(input: string): Promise<string> {
    const queryVector = this.embedder.embed(input);
    const matchedContext = await this.memory.search(queryVector);
    return matchedContext || "";
  }

  async store(input: string, response: string): Promise<void> {
    const combined = `${input.trim()} -> ${response.trim()}`;
    const vector = this.embedder.embed(combined);
    await this.memory.add(combined, vector);
  }
}
