export function convertUser(usageCount: number): "SHOW_PAYWALL" | "FREE_USE" {
  if (usageCount >= 10) {
    return "SHOW_PAYWALL";
  }
  return "FREE_USE";
}
