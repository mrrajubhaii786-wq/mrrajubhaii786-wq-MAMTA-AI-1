export class LiveConnector {
  connect(service: string, key: string) {
    if (!key) return { error: "NO_KEY" };

    return {
      service,
      status: "CONNECTED",
      mode: "LIVE",
      timestamp: Date.now()
    };
  }
}
