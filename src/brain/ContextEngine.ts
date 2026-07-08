import { MemoryMessage } from "./ConversationMemory";

export interface ConversationContext {
  topic: "science" | "tech" | "philosophy" | "creator" | "identity" | "general";
  mood: "low" | "high" | "curious" | "normal";
  isFollowUp: boolean;
  historyLength: number;
}

export class ContextEngine {
  analyze(input: string, history: MemoryMessage[]): ConversationContext {
    const lastMessages = history.slice(-3).map(m => m.text).join(" ");
    const combinedText = (input + " " + lastMessages).toLowerCase();

    return {
      topic: this.detectTopic(combinedText),
      mood: this.detectMood(input.toLowerCase()),
      isFollowUp: history.length > 1,
      historyLength: history.length
    };
  }

  private detectTopic(text: string): "science" | "tech" | "philosophy" | "creator" | "identity" | "general" {
    if (
      text.includes("ब्रह्मांड") ||
      text.includes("universe") ||
      text.includes("origin") ||
      text.includes("science") ||
      text.includes("space") ||
      text.includes("evolution") ||
      text.includes("तारे") ||
      text.includes("galaxy")
    ) {
      return "science";
    }

    if (
      text.includes("code") ||
      text.includes("build") ||
      text.includes("app") ||
      text.includes("programming") ||
      text.includes("developer") ||
      text.includes("software") ||
      text.includes("bug") ||
      text.includes("database")
    ) {
      return "tech";
    }

    if (
      text.includes("life") ||
      text.includes("marna") ||
      text.includes("jeevan") ||
      text.includes("death") ||
      text.includes("meaning") ||
      text.includes("philosophy") ||
      text.includes("insan") ||
      text.includes("bhagwan") ||
      text.includes("god")
    ) {
      return "philosophy";
    }

    if (
      text.includes("who created") ||
      text.includes("kisne banaya") ||
      text.includes("creator") ||
      text.includes("maker") ||
      text.includes("owner") ||
      text.includes("developer of mamta")
    ) {
      return "creator";
    }

    if (
      text.includes("who are you") ||
      text.includes("kaun ho") ||
      text.includes("tumhara naam") ||
      text.includes("identity") ||
      text.includes("mamta ai") ||
      text.includes("v10") ||
      text.includes("v11")
    ) {
      return "identity";
    }

    return "general";
  }

  private detectMood(text: string): "low" | "high" | "curious" | "normal" {
    if (
      text.includes("sad") ||
      text.includes("tired") ||
      text.includes("thak") ||
      text.includes("udas") ||
      text.includes("boring") ||
      text.includes("bad") ||
      text.includes("bura") ||
      text.includes("help me")
    ) {
      return "low";
    }

    if (
      text.includes("excited") ||
      text.includes("amazing") ||
      text.includes("happy") ||
      text.includes("khush") ||
      text.includes("great") ||
      text.includes("mast") ||
      text.includes("awesome") ||
      text.includes("super")
    ) {
      return "high";
    }

    if (
      text.includes("why") ||
      text.includes("how") ||
      text.includes("kaise") ||
      text.includes("kyun") ||
      text.includes("kya") ||
      text.includes("explain") ||
      text.includes("know") ||
      text.includes("samjhao")
    ) {
      return "curious";
    }

    return "normal";
  }
}
