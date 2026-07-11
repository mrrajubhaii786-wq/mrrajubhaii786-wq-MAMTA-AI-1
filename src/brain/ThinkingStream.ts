// src/brain/ThinkingStream.ts

export class ThinkingStream {
  private listeners: ((step: string) => void)[] = [];

  subscribe(fn: (step: string) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  emit(step: string) {
    this.listeners.forEach(fn => {
      try {
        fn(step);
      } catch (err) {
        console.error("ThinkingStream listener error:", err);
      }
    });
  }
}
