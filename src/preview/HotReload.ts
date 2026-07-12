// src/preview/HotReload.ts

/**
 * reloads the preview iframe by targeting its ID,
 * ensuring any local file system changes are immediately visible to the user.
 */
export function reloadPreview(): void {
  const iframe = document.getElementById("preview") as HTMLIFrameElement | null;
  if (iframe) {
    console.log("⚡ [HotReload] Instantly reloading preview sandboxed iframe...");
    try {
      // Clean reload without hard caching issues
      const currentSrc = iframe.src;
      iframe.src = "";
      iframe.src = currentSrc;
    } catch (err) {
      // Fallback
      iframe.src = iframe.src;
    }
  } else {
    // Search by general tag or selector if ID isn't set
    const fallbackIframe = document.querySelector("iframe") as HTMLIFrameElement | null;
    if (fallbackIframe) {
      console.log("⚡ [HotReload] Found fallback iframe, reloading...");
      fallbackIframe.src = fallbackIframe.src;
    }
  }
}

// Global hook registration
if (typeof window !== "undefined") {
  (window as any).reloadPreview = reloadPreview;
}
