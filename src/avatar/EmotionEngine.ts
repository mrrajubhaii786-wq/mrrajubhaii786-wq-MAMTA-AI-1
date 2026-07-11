/**
 * Mamta Avatar AI - Emotion Engine (Production Grade)
 * Analyzes input text to determine the emotional tone of the speech.
 */

export type AvatarEmotion = "excited" | "thinking" | "serious" | "friendly" | "normal";

export interface EmotionProfile {
  emotion: AvatarEmotion;
  pitchMultiplier: number;
  speechRateMultiplier: number;
  overlayColor: string;
  expressionScale: number;
}

export function getEmotion(text: string): AvatarEmotion {
  const cleanText = text.toLowerCase();
  
  if (text.includes("🔥") || text.includes("🚀") || cleanText.includes("awesome") || cleanText.includes("amazing") || cleanText.includes("great")) {
    return "excited";
  }
  if (text.includes("?") || cleanText.includes("why") || cleanText.includes("how") || cleanText.includes("think") || cleanText.includes("wonder")) {
    return "thinking";
  }
  if (cleanText.includes("warning") || cleanText.includes("error") || cleanText.includes("critical") || cleanText.includes("important") || cleanText.includes("serious")) {
    return "serious";
  }
  if (cleanText.includes("welcome") || cleanText.includes("hello") || cleanText.includes("hi") || cleanText.includes("friend") || cleanText.includes("love") || cleanText.includes("happy")) {
    return "friendly";
  }
  
  return "normal";
}

export function getEmotionProfile(text: string): EmotionProfile {
  const emotion = getEmotion(text);
  
  switch (emotion) {
    case "excited":
      return {
        emotion,
        pitchMultiplier: 1.15,
        speechRateMultiplier: 1.2,
        overlayColor: "#f97316", // Orange
        expressionScale: 1.3
      };
    case "thinking":
      return {
        emotion,
        pitchMultiplier: 0.95,
        speechRateMultiplier: 0.9,
        overlayColor: "#3b82f6", // Blue
        expressionScale: 0.8
      };
    case "serious":
      return {
        emotion,
        pitchMultiplier: 0.88,
        speechRateMultiplier: 0.95,
        overlayColor: "#ef4444", // Red
        expressionScale: 0.9
      };
    case "friendly":
      return {
        emotion,
        pitchMultiplier: 1.05,
        speechRateMultiplier: 1.05,
        overlayColor: "#10b981", // Emerald
        expressionScale: 1.1
      };
    case "normal":
    default:
      return {
        emotion: "normal",
        pitchMultiplier: 1.0,
        speechRateMultiplier: 1.0,
        overlayColor: "#6366f1", // Indigo
        expressionScale: 1.0
      };
  }
}
