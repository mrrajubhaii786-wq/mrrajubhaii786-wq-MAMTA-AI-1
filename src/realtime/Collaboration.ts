// src/realtime/Collaboration.ts

export interface CollaborationMessage {
  userId: string;
  cursorPos?: { line: number; ch: number };
  activeFile?: string;
  timestamp: number;
}

export class CollaborationChannel {
  private socket: WebSocket | null = null;
  private listeners: ((msg: CollaborationMessage) => void)[] = [];

  constructor(private url: string = "wss://echo.websocket.org") {}

  public connect(onOpen?: () => void) {
    try {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        console.log("🌐 [Collaboration] Connected to real-time sync channel:", this.url);
        if (onOpen) onOpen();
      };

      this.socket.onmessage = (event) => {
        try {
          const msg: CollaborationMessage = JSON.parse(event.data);
          this.listeners.forEach((l) => l(msg));
        } catch (e) {
          // Ignore non-JSON messages
        }
      };
    } catch (err) {
      console.error("Failed to connect collaboration channel:", err);
    }
  }

  public subscribe(listener: (msg: CollaborationMessage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public send(msg: Partial<CollaborationMessage>) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          userId: "user-mamta-collab",
          timestamp: Date.now(),
          ...msg,
        })
      );
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
