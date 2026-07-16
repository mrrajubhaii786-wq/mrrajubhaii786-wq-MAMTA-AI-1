import WebSocket, { WebSocketServer } from "ws";

export class NodeSocket {
  wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req: any, socket: any, head: any) => {
      let pathname = req.url || "";
      if (pathname.includes("?")) {
        pathname = pathname.split("?")[0];
      }
      if (pathname === "/api/node/ws") {
        this.wss.handleUpgrade(req, socket, head, (ws) => {
          this.wss.emit("connection", ws);
        });
      }
    });
  }

  broadcast(data: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
