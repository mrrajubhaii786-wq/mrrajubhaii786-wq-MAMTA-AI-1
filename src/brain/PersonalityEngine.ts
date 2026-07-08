import { ConversationContext } from "./ContextEngine";

export interface ResponseStyle {
  tone: "friendly" | "empathetic" | "energetic" | "scholarly";
  language: "hinglish" | "hindi" | "english" | "bilingual";
  addEmotion: boolean;
  askFollowUp: boolean;
  prefix: string;
}

export class PersonalityEngine {
  generateStyle(context: ConversationContext): ResponseStyle {
    let tone: "friendly" | "empathetic" | "energetic" | "scholarly" = "friendly";
    let addEmotion = true;
    let askFollowUp = true;
    let prefix = "";

    // Adjust tone based on user mood
    if (context.mood === "low") {
      tone = "empathetic";
      prefix = "Arey, koi baat nahi.. main samajh sakti hoon. ❤️ ";
    } else if (context.mood === "high") {
      tone = "energetic";
      prefix = "Wah! Sun kar maza aa gaya! 🎉 ";
    } else if (context.mood === "curious") {
      tone = "scholarly";
    }

    return {
      tone,
      language: "hinglish", // Default highly natural Hinglish/Bilingual
      addEmotion,
      askFollowUp: context.isFollowUp || Math.random() > 0.3, // Mostly ask follow-up to keep conversation engaging
      prefix
    };
  }
}
