export interface UserReferralState {
  uid: string;
  invites: number;
  plan: "FREE" | "PRO" | "PREMIUM";
}

export function handleReferral(user: UserReferralState): UserReferralState {
  const updatedUser = { ...user };
  updatedUser.invites += 1;

  if (updatedUser.invites >= 3) {
    updatedUser.plan = "PRO";
  }

  return updatedUser;
}
