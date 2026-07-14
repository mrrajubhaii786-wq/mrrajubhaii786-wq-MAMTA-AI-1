export class LearningSync {
  update(memory: any, result: any) {
    const successCount = (memory?.successCount || 0) + (result.success ? 1 : 0);
    const totalCount = (memory?.totalCount || 0) + 1;
    const successRate = totalCount > 0 ? successCount / totalCount : 0;

    return {
      ...memory,
      successCount,
      totalCount,
      lastUpdate: Date.now(),
      successRate,
      status: result.success ? "OPTIMAL" : "STABILIZING"
    };
  }
}
