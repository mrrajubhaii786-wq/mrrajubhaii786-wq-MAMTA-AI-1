export class UserLearning {
  learn(profile: any, action: any) {
    if (!profile.behavior) {
      profile.behavior = [];
    }
    profile.behavior.push(action);

    if (profile.behavior.length > 50) {
      profile.behavior.shift();
    }

    return profile;
  }
}
