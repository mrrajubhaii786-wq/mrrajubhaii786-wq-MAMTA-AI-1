import { EdgeCompute } from "./EdgeCompute";

const edge = new EdgeCompute();

export class GlobalCompute {
  process(data: any) {
    const edgeResult = edge.execute(data);

    return {
      edge: edgeResult,
      cloud: "processed",
      timestamp: Date.now()
    };
  }
}
