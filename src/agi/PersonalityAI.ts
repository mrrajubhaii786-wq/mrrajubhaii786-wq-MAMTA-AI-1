export class PersonalityAI {
  adapt(profile: any) {
    const behaviorCount = profile?.behavior?.length || 0;
    const style = behaviorCount > 20 ? "PRO" : "SIMPLE";

    return {
      tone: style === "PRO" ? "technical" : "friendly",
      depth: style === "PRO" ? "deep" : "basic"
    };
  }
}
