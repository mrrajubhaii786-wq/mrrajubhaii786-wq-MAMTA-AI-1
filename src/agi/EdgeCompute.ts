export class EdgeCompute {
  execute(clientData: any) {
    return {
      processed: true,
      responseTime: Math.round(5 + Math.random() * 45), // response time in ms
      data: clientData,
      timestamp: Date.now()
    };
  }
}
