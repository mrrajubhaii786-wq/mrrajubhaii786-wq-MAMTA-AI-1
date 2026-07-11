/**
 * Mamta Avatar AI - Video Engine (Production Grade)
 * Orquestrates speech generation, emotion detection, and talking face synthesis.
 */

import { generateVoice } from "../voice/VoiceCloneEngine";
import { generateAvatar } from "./AvatarEngine";
import { getEmotionProfile } from "./EmotionEngine";
import fs from "fs";
import path from "path";

export interface AvatarVideoResult {
  videoPath: string;
  audioPath: string;
  emotion: string;
  scriptText: string;
  avatarImage: string;
  timestamp: string;
}

/**
 * Creates a fully rendered talking avatar video from a plain text script.
 * 
 * @param text The spoken script for the avatar
 * @param customAvatarImage Optional custom image path (defaults to avatar.jpg)
 * @param sessionId Optional session identifier to pull custom cloned user voice
 */
export async function createVideo(
  text: string, 
  customAvatarImage?: string, 
  sessionId?: string
): Promise<AvatarVideoResult> {
  console.log(`🎬 [VideoEngine] Initiating talking avatar creation for script: "${text.slice(0, 50)}..."`);

  // 1. Detect emotion profile
  const profile = getEmotionProfile(text);
  console.log(`🎭 [VideoEngine] Emotion Profile: [${profile.emotion.toUpperCase()}], speech multiplier: ${profile.speechRateMultiplier}`);

  // 2. Synthesize deep-voice audio using Mamta Voice Clone Engine
  // (Passing the sessionId enables the blend with user's actual cloned voice file if it exists)
  const audioPath = await generateVoice(text, sessionId);
  console.log(`🎙️ [VideoEngine] Audio synthesized successfully. File path: ${audioPath}`);

  // 3. Resolve the avatar image path to use
  let activeAvatar = customAvatarImage || "avatar.jpg";
  
  // If the user hasn't uploaded a custom avatar yet, let's see if we have standard files in the project
  if (!fs.existsSync(activeAvatar)) {
    const fallbacks = [
      path.join(process.cwd(), "avatar.jpg"),
      path.join(process.cwd(), "assets", "avatar.jpg"),
      path.join(process.cwd(), "public", "avatar.jpg"),
      // Default to writing an elegant text overlay if no physical image exists
    ];
    
    for (const fb of fallbacks) {
      if (fs.existsSync(fb)) {
        activeAvatar = fb;
        break;
      }
    }
  }

  console.log(`👤 [VideoEngine] Utilizing avatar source image: [${activeAvatar}]`);

  // 4. Generate talking face video
  const videoPath = await generateAvatar(activeAvatar, audioPath, text);
  console.log(`🎥 [VideoEngine] Talking Avatar video rendered successfully! Location: ${videoPath}`);

  return {
    videoPath,
    audioPath,
    emotion: profile.emotion,
    scriptText: text,
    avatarImage: activeAvatar,
    timestamp: new Date().toISOString()
  };
}
