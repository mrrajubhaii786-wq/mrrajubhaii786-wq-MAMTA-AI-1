import { BuilderAgent, BuiltArtifact } from "./BuilderAgent";

export class AgentManagerV2 {
  public builder = new BuilderAgent();

  async run(tasks: any[]): Promise<BuiltArtifact[]> {
    const results: BuiltArtifact[] = [];

    for (const task of tasks) {
      const result = await this.builder.build(task);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }
}
