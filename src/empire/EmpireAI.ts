export class EmpireAI {
  decideExpansion(companies: any[]) {
    // If the empire holds fewer than 5 active portfolio nodes, spawn a new enterprise
    if (companies.length < 5) {
      return "CREATE_NEW_COMPANY";
    }

    // Evaluate global user scale
    const totalUsers = companies.reduce((sum, c) => sum + (c.users || 0), 0);
    if (totalUsers > 2500) {
      return "SCALE_GLOBAL_NETWORK";
    }

    return "OPTIMIZE_EXISTING";
  }
}
