export class SelfLearning {
  learn(memory: any[], input: string, response: string): void {
    memory.push({
      input: input.trim(),
      response: response.trim(),
      time: Date.now()
    });

    if (memory.length > 100) {
      memory.shift(); // maintain safe memory bounds
    }
  }
}
