export class OAuthProd {
  validate(domain: string) {
    if (domain && domain.includes("https")) {
      return { verified: true, protocol: "SSL/TLS SECURE" };
    }

    return { verified: false, protocol: "INSECURE_HTTP_DENIED" };
  }
}
