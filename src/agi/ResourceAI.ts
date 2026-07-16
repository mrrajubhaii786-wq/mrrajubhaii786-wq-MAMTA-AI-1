export class ResourceAI {
  allocate(load: number) {
    return load > 70 ? "REDISTRIBUTE" : "STABLE";
  }
}
