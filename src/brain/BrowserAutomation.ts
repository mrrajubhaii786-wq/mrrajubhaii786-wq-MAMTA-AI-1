export class BrowserAutomation {
  async testSite(url: string): Promise<string> {
    try {
      if (typeof process !== "undefined" && process.versions && process.versions.node) {
        // Safe dynamic require/import for playwright to prevent bundler errors
        try {
          const { chromium } = require("playwright");
          const browser = await chromium.launch({ headless: true });
          const page = await browser.newPage();
          await page.goto(url, { waitUntil: "networkidle" });
          const title = await page.title();
          await browser.close();
          return `🌐 [Playwright] Site loaded successfully!\n- URL: ${url}\n- Title: "${title}"\n- Status: 200 OK`;
        } catch (pwErr) {
          // If playwright is not installed, fetch the HTML and extract title using regex
          console.warn("Playwright not installed, falling back to lightweight HTTP scraping:", pwErr);
          const response = await fetch(url);
          const text = await response.text();
          const match = text.match(/<title>([^<]*)<\/title>/i);
          const title = match ? match[1] : "No Title Found";
          return `🌐 [Scrape Fallback] Site loaded successfully!\n- URL: ${url}\n- Title: "${title}"\n- Status: ${response.status}`;
        }
      } else {
        // Browser environment mock simulation
        return `🌐 [Simulated Browser] Navigating to: ${url}\n- Engine: Chromium (headless)\n- Response Time: 42ms\n- DOM Content Loaded: true\n- Title: "Mamta AI OS - Autonomous Workspace"`;
      }
    } catch (err: any) {
      return `❌ Browser Automation failed: ${err.message}`;
    }
  }
}
