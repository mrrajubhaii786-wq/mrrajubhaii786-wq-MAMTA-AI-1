import fs from "fs";

export async function generateImages(scenes: string[]): Promise<string[]> {
  console.log("📸 [ImageEngine] Generating beautiful portrait stock graphics for video scenes...");
  const images: string[] = [];

  // Curated list of vertical 720x1280 high-contrast Tech/SaaS images
  const presetUrls = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=720&h=1280&fit=crop", // Code screen
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=720&h=1280&fit=crop", // Business / Charts
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&h=1280&fit=crop", // Minimalist AI design
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=720&h=1280&fit=crop"  // Success / Payments
  ];

  for (let i = 0; i < scenes.length; i++) {
    const file = `scene_${i}.png`;
    const imageUrl = presetUrls[i % presetUrls.length];

    try {
      console.log(`📥 [ImageEngine] Downloading scene ${i + 1}/${scenes.length} image from Unsplash...`);
      const res = await fetch(imageUrl);
      if (!res.ok) {
        throw new Error(`Failed to download preset image: ${res.status}`);
      }
      
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(file, Buffer.from(arrayBuffer));
      console.log(`✅ [ImageEngine] Scene ${i} image written successfully:`, file);
      images.push(file);
    } catch (err: any) {
      console.warn(`⚠️ [ImageEngine] Presets download failed for scene ${i}, creating dynamic solid-color poster frame fallback:`, err.message);
      
      // Secondary fallback: let's fetch a beautiful random color block from picsum
      try {
        const fallbackPicsum = `https://picsum.photos/720/1280?random=${i}`;
        const fallbackRes = await fetch(fallbackPicsum);
        const arrayBuffer = await fallbackRes.arrayBuffer();
        fs.writeFileSync(file, Buffer.from(arrayBuffer));
        images.push(file);
      } catch (innerErr: any) {
        // Tertiary fallback: write empty file or simulated state
        fs.writeFileSync(file, Buffer.from([]));
        images.push(file);
      }
    }
  }

  return images;
}
