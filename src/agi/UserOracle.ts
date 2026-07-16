export class UserOracle {
  getContext(user: any) {
    return {
      time: new Date(),
      activity: user?.lastAction || "idle",
      device: user?.device || "unknown",
      moodSignal: "neutral"
    };
  }
}
