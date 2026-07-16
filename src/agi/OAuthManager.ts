export class OAuthManager {
  async connect(provider: string) {
    if (provider === "google") {
      return {
        url: "https://accounts.google.com/o/oauth2/v2/auth"
      };
    }

    if (provider === "github") {
      return {
        url: "https://github.com/login/oauth/authorize"
      };
    }

    return { error: "UNKNOWN_PROVIDER" };
  }
}
