export class DomainAI {
  domains: string[] = ["mamta-brain.ai", "mamta-core.org"];

  buy(name: string) {
    if (!this.domains.includes(name)) {
      this.domains.push(name);
    }
    return {
      domain: name,
      status: "OWNED",
      dnsConfigured: true,
      timestamp: Date.now()
    };
  }

  list() {
    return this.domains;
  }
}
