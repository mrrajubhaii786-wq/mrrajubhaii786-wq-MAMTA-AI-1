export async function postToTwitter(post: any) {
  const token = process.env.TWITTER_BEARER;
  if (!token) {
    console.warn("⚠️ [Twitter Bot] TWITTER_BEARER environment variable is missing. Running in simulated Sandbox mode.");
    return {
      success: true,
      status: "SIMULATED",
      message: `[Twitter Bot] Simulated post successful: "${post.caption || post.reel}"`
    };
  }

  try {
    const res = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: `${post.caption || post.reel} ${post.hashtags || ""} 🚀`
      })
    });

    if (!res.ok) {
      if (res.status === 403) {
        console.warn("⚠️ [Twitter/X Bot] Twitter API returned 403 Forbidden. Note: posting tweets via POST /2/tweets is restricted on standard App-Only Bearer Tokens. It requires OAuth 1.0a or OAuth 2.0 User-Context authentication with 'tweet.write' scopes. Falling back to Simulated Sandbox mode gracefully.");
        return {
          success: true,
          status: "SIMULATED_FALLBACK",
          message: `[Twitter Bot] (Sandbox Fallback - 403) "${post.caption || post.reel}"`
        };
      }
      throw new Error(`Twitter API returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      status: "PUBLISHED",
      data
    };
  } catch (err: any) {
    console.error("❌ [Twitter Bot] Error posting to Twitter:", err);
    return {
      success: false,
      status: "FAILED",
      error: err.message
    };
  }
}
