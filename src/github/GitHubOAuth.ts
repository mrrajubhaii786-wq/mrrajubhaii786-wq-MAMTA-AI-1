// src/github/GitHubOAuth.ts

export async function pushCode(token: string, repo: string, path: string, content: string): Promise<any> {
  const base64Content = btoa(unescape(encodeURIComponent(content)));
  
  // First, check if the file already exists to get its SHA (required for updating files in GitHub)
  let sha: string | undefined;
  try {
    const checkRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });
    if (checkRes.ok) {
      const fileData = await checkRes.json();
      sha = fileData.sha;
    }
  } catch (err) {
    console.warn("Could not find existing file to get SHA (this is normal for new file creation):", err);
  }

  const body: any = {
    message: "🤖 Mamta AI automated commit",
    content: base64Content,
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`GitHub push failed: ${res.statusText} - ${errorDetails}`);
  }

  return await res.json();
}

export async function createPullRequest(
  token: string,
  repo: string,
  title: string,
  head = "ai-branch",
  base = "main"
): Promise<any> {
  const res = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      title,
      head,
      base
    })
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    throw new Error(`GitHub PR creation failed: ${res.statusText} - ${errorDetails}`);
  }

  return await res.json();
}

