export class UserGoal {
  update(profile: any, goal: string) {
    if (!profile.goals) {
      profile.goals = [];
    }
    if (!profile.goals.includes(goal)) {
      profile.goals.push(goal);
    }
    return profile;
  }
}
