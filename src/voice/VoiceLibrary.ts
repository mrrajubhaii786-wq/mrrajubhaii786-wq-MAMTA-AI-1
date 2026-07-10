import fs from "fs";
import path from "path";

// Ensure voices directory exists at root
const voicesDir = path.join(process.cwd(), "voices");
if (!fs.existsSync(voicesDir)) {
  fs.mkdirSync(voicesDir, { recursive: true });
}

// Default stock reference files to pre-seed the Mamta Voice AI Engine
export const DEFAULT_VOICES: Record<string, string> = {
  male: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg", // standard fallbacks
  female: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  narrator: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
};

export const voiceLibrary: Record<string, string> = {
  male: "voices/male.wav",
  female: "voices/female.wav",
  narrator: "voices/narrator.wav"
};

export function getVoicePath(role: "male" | "female" | "narrator", sessionId?: string): string {
  if (sessionId) {
    const sessionPath = path.join(process.cwd(), "voices", `${sessionId}_${role}.wav`);
    if (fs.existsSync(sessionPath)) {
      return sessionPath;
    }
  }
  const customPath = path.join(process.cwd(), voiceLibrary[role]);
  if (fs.existsSync(customPath)) {
    return customPath;
  }
  return customPath;
}

export function listVoiceModels(sessionId?: string) {
  const models = [
    { id: "male", name: "Founder Male", description: "Deep, authoritative, professional founder style", status: "Default" },
    { id: "female", name: "Girl AI", description: "High-energy, fast-paced, optimized for Reels/Shorts", status: "Default" },
    { id: "narrator", name: "Pro Narrator", description: "Calm, engaging, storytelling narrator", status: "Default" }
  ];

  return models.map(m => {
    let customPath = path.join(process.cwd(), voiceLibrary[m.id]);
    let exists = fs.existsSync(customPath);
    let pathUrl = exists ? `/voices/${m.id}.wav` : null;

    if (sessionId) {
      const sessionPath = path.join(process.cwd(), "voices", `${sessionId}_${m.id}.wav`);
      if (fs.existsSync(sessionPath)) {
        customPath = sessionPath;
        exists = true;
        pathUrl = `/voices/${sessionId}_${m.id}.wav`;
      }
    }

    return {
      ...m,
      status: exists ? (sessionId && customPath.includes(sessionId) ? "Custom Session Cloned Active" : "Custom Cloned Active") : "Default Built-In",
      path: pathUrl,
      size: exists ? `${(fs.statSync(customPath).size / (1024 * 1024)).toFixed(2)} MB` : "N/A"
    };
  });
}
