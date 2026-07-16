export class UserProfile {
  profiles: Map<string, any> = new Map();

  get(userId: string) {
    if (!this.profiles.has(userId)) {
      this.profiles.set(userId, {
        userId,
        preferences: [] as string[],
        behavior: [] as any[],
        goals: [] as string[]
      });
    }
    return this.profiles.get(userId);
  }
}
