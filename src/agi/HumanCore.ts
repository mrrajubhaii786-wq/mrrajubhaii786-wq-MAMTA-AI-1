import { UserProfile } from "./UserProfile";
import { UserLearning } from "./UserLearning";
import { PersonalityAI } from "./PersonalityAI";
import { WorkflowAI } from "./WorkflowAI";

const profiles = new UserProfile();
const learning = new UserLearning();
const personality = new PersonalityAI();
const workflow = new WorkflowAI();

export class HumanCore {
  process(userId: string, action: any) {
    let profile = profiles.get(userId);

    profile = learning.learn(profile, action);

    const style = personality.adapt(profile);

    const suggestion = workflow.suggest(profile);

    return {
      style,
      suggestion,
      profile
    };
  }

  getProfile(userId: string) {
    return profiles.get(userId);
  }
}

export const humanCoreInstance = new HumanCore();
