export class Node {
  id: string;
  state: any;

  constructor(id: string) {
    this.id = id;
    this.state = {
      isInitialized: true,
      lastSyncTime: Date.now()
    };
  }

  update(data: any) {
    this.state = { 
      ...this.state, 
      ...data,
      lastSyncTime: Date.now()
    };
  }
}
