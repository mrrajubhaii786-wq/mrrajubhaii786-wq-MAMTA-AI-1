export class NegotiationAI {
  negotiate(offer: number, demand: number) {
    if (offer >= demand) {
      return {
        decision: "ACCEPT",
        finalPrice: offer,
        message: "Terms accepted. Agreement recorded."
      };
    }
    
    // Propose a compromise or counter
    const counterOffer = Math.round((offer + demand) / 2);
    return {
      decision: "COUNTER",
      finalPrice: counterOffer,
      message: `Demand of $${demand} is too high for offer of $${offer}. Counter-offering midway at $${counterOffer}.`
    };
  }
}
