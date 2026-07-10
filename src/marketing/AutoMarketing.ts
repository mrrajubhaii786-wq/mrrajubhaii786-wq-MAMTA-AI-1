import { VideoEngine } from "./VideoEngine";
import { ReelEngine } from "./ReelEngine";
import { ThumbnailEngine } from "./ThumbnailEngine";
import { AnalyticsEngine } from "./AnalyticsEngine";
import { createRealVideo } from "./RealVideoEngine";
import { createReel } from "./ReelReal";

export class AutoMarketing {
  private videoEngine = new VideoEngine();
  private reelEngine = new ReelEngine();
  private thumbnailEngine = new ThumbnailEngine();
  private analyticsEngine = new AnalyticsEngine();

  async run(topic: string = "AI SaaS Builder", metrics?: any, ai?: any, sessionId?: string) {
    // 1. Generate optimized viral script & scenes via Gemini
    const videoScript = await this.videoEngine.generateVideo(topic, ai);
    
    // 2. Generate optimized social captions, hashtags & durations via ReelEngine
    const reelMetadata = await this.reelEngine.createReel(videoScript, ai);
    
    // 3. Compile REAL vertical video file with stock assets and soundtrack via FFmpeg
    let compiledVideoUrl = "/generated_video.mp4";
    try {
      compiledVideoUrl = await createRealVideo(videoScript, sessionId);
    } catch (err: any) {
      console.warn("⚠️ [AutoMarketing] FFmpeg real video compilation failed, returning baseline route:", err.message);
    }

    // 4. Wrap in social publication model via ReelReal wrapping system
    const publishedReel = createReel(compiledVideoUrl);

    // 5. Generate high-impact clickbait cover thumbnail graphic
    const thumb = await this.thumbnailEngine.generate(videoScript.title, ai);
    
    // 6. Audit metrics to compute analytics suggestions
    const inputMetrics = metrics || { views: 1280, signups: 184, upgrades: 12, revenue: 5988 };
    const analysis = await this.analyticsEngine.analyze(inputMetrics, ai);

    console.log("🎥 [AutoMarketing Pipeline] Video script generated:", videoScript);
    console.log("🎬 [AutoMarketing Pipeline] Reel formatted:", publishedReel);
    console.log("🖼️ [AutoMarketing Pipeline] Thumbnail created:", thumb);
    console.log("📊 [AutoMarketing Pipeline] Growth analysis:", analysis);

    return {
      topic,
      video: {
        ...videoScript,
        videoPath: compiledVideoUrl
      },
      reel: {
        ...reelMetadata,
        video: compiledVideoUrl,
        published: publishedReel
      },
      thumb,
      analysis,
      timestamp: Date.now()
    };
  }
}
