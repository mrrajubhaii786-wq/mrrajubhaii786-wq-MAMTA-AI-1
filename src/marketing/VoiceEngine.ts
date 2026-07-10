import { generateVoice as runLocalVoiceEngine } from "../voice/VoiceCloneEngine";

export async function generateVoice(text: string, sessionId?: string): Promise<string> {
  console.log("🎤 [VoiceEngine] Routing request to Mamta local Voice Clone Engine...");
  try {
    const voiceFile = await runLocalVoiceEngine(text, sessionId);
    return voiceFile;
  } catch (err: any) {
    console.error("❌ [VoiceEngine] Mamta voice generation failed, returning baseline:", err.message);
    throw err;
  }
}
