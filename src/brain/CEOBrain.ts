export class CEOBrain {
  decide(input: string): "BUILD_SAAS" | "GROWTH" | "GENERAL" {
    const text = input.toLowerCase();
    
    if (
      text.includes("startup") || 
      text.includes("idea") || 
      text.includes("saas") || 
      text.includes("product") || 
      text.includes("business")
    ) {
      return "BUILD_SAAS";
    }

    if (
      text.includes("grow") || 
      text.includes("users") || 
      text.includes("marketing") || 
      text.includes("traffic") || 
      text.includes("customers")
    ) {
      return "GROWTH";
    }

    return "GENERAL";
  }
}
