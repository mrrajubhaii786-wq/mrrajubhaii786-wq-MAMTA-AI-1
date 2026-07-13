export interface NetworkMessage {
  id: string;
  from: string;
  to: string;
  payload: any;
  timestamp: number;
}

export class Network {
  private transferLogs: string[] = [];

  send(from: string, to: string, payload: any) {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] 📡 Network Relay: ${from} ➔ ${to} | Data: ${JSON.stringify(payload)}`;
    console.log(logMsg);
    
    this.transferLogs.push(logMsg);
    if (this.transferLogs.length > 30) {
      this.transferLogs.shift();
    }

    return {
      status: "relayed",
      from,
      to,
      payload,
      timestamp: Date.now()
    };
  }

  getLogs() {
    return this.transferLogs;
  }
}
