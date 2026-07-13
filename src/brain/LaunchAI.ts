export function launchProduct(name: string) {
  return {
    product: name,
    launch: "Live on mamta.ai",
    marketing: "Auto campaign started",
    timestamp: Date.now()
  };
}
