import WebSocket, { WebSocketServer } from "ws";

export class GlobalNodeSocket {
  wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req: any, socket: any, head: any) => {
      let pathname = req.url || "";
      if (pathname.includes("?")) {
        pathname = pathname.split("?")[0];
      }
      // Routing WebSocket upgrades for Plan 34 Global Network
      if (pathname === "/api/global/ws") {
        this.wss.handleUpgrade(req, socket, head, (ws) => {
          this.wss.emit("connection", ws);
        });
      }
    });

    // Start background sync heartbeat broadcast @ 3 seconds as specified
    setInterval(() => {
      this.broadcast({
        type: "GLOBAL_SYNC",
        time: Date.now()
      });
    }, 3000);
  }

  broadcast(data: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
