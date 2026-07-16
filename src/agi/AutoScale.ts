export class AutoScale {
  scale(load: number) {
    if (load > 80) {
      return "SPAWN_NEW_NODE";
    }

    if (load < 30) {
      return "REDUCE_NODE";
    }

    return "STABLE";
  }
}
