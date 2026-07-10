import { generateVoice } from "./VoiceEngine";
import { generateImages } from "./ImageEngine";
import { buildVideo } from "./VideoBuilder";

export async function createRealVideo(script: { voiceover: string; scenes: string[] }, sessionId?: string): Promise<string> {
  console.log("🚀 [RealVideoEngine] Waking up real media orchestration pipeline...");

  console.log("🎤 [RealVideoEngine] Generating voice track...");
  const voiceFile = await generateVoice(script.voiceover, sessionId);

  console.log("🖼️ [RealVideoEngine] Fetching cinematic scene imagery...");
  const imageFiles = await generateImages(script.scenes);

  console.log("🎬 [RealVideoEngine] Compiling scenes to real high-fidelity vertical video via FFmpeg...");
  const videoUrl = await buildVideo(imageFiles, voiceFile);

  console.log("🎉 [RealVideoEngine] Dynamic video compile finished! URL:", videoUrl);
  return videoUrl;
}
