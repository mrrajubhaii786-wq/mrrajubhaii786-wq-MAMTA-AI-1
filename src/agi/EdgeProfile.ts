export class EdgeProfile {
  detect() {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    return {
      mode: isMobile ? "LIGHT" : "FULL",
      compute: isMobile ? "EDGE" : "SERVER"
    };
  }
}
