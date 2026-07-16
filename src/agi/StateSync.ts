export class StateSync {
  sync(nodes: any[]) {
    if (!nodes || nodes.length <= 1) return;
    const master = { ...nodes[0].state };
    nodes.forEach((node, index) => {
      if (index > 0) {
        // Synchronize and update last sync timestamps safely
        node.state = { 
          ...node.state, 
          ...master,
          lastSyncTime: Date.now()
        };
      }
    });
  }
}
