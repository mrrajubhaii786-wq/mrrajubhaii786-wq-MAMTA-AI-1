export class WorkflowAI {
  suggest(profile: any) {
    const goals = profile?.goals || [];
    if (goals.includes("earn_money")) {
      return "Suggest freelancing + AI tools";
    }
    if (goals.includes("build_app")) {
      return "Suggest dev roadmap";
    }
    return "General assistance";
  }
}
