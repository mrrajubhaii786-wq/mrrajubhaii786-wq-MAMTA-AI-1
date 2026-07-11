/**
 * Mamta Human Chat Engine (Production Grade)
 * Implements real-time thinking states, typing simulations, humanizing response decorators,
 * context memory state extraction, and dynamic follow-up options.
 */

/**
 * 1. Thinking UI Steps Simulator
 */
export const THINKING_STEPS = [
  "🧠 Understanding your question...",
  "🔍 Analyzing context...",
  "⚙️ Building response...",
  "✍️ Writing answer..."
];

/**
 * 2. Human Response Engine
 * Decorates standard raw responses with a warm conversational Hinglish/English follow-up query.
 */
export function enhanceResponse(text: string): string {
  // If the text already has the custom follow-up or is an error, return as is
  if (text.includes("By the way") || text.includes("क्या तुम")) {
    return text;
  }

  return `${text}

🤔 **By the way...**

क्या तुम इसके **deeper explanation** चाहते हो या **practical example** भी देखना चाहोगे?`;
}

/**
 * 3. Follow-up AI Engine
 * Generates interactive follow-up question chips based on the user's query context.
 */
export function generateFollowups(input: string): string[] {
  const lower = input.toLowerCase();
  
  if (lower.includes("ai") || lower.includes("bot") || lower.includes("agent") || lower.includes("automation")) {
    return [
      "क्या तुम AI खुद बनाना चाहते हो? 🧠",
      "क्या तुम इसका business use समझना चाहते हो? 💼",
      "इसको Workspace में कैसे लोड करें? 🚀"
    ];
  }
  
  if (lower.includes("plan") || lower.includes("roadmap") || lower.includes("blueprint") || lower.includes("task")) {
    return [
      "इस प्लान का कोड कैसे लिखें? 💻",
      "क्या मैं इसका practical example दूँ? 💡",
      "इसके milestones को detail करें? 📊"
    ];
  }

  if (lower.includes("marketing") || lower.includes("growth") || lower.includes("post") || lower.includes("viral")) {
    return [
      "AI Growth Bot को कैसे चालू करें? 🤖",
      "Viral Loops के metrics को समझाइए? 📈",
      "YouTube Shorts पर कैसे पब्लिश करें? 🎥"
    ];
  }
  
  return [
    "क्या तुम और detail चाहते हो? 🔍",
    "क्या मैं इसका practical example दूँ? 💡",
    "कुछ और पूछें! 💬"
  ];
}

/**
 * 4. Context Memory Extractor
 * Extracts the core topic being discussed to show in the Memory Badge UI.
 */
export function extractActiveTopic(input: string, currentTopic: string | null): string {
  const lower = input.toLowerCase();
  
  if (lower.includes("plan") || lower.includes("roadmap")) return "Strategic Plan Formulation";
  if (lower.includes("ai") || lower.includes("agent")) return "Autonomous AI Agents";
  if (lower.includes("portfolio") || lower.includes("crypto")) return "Crypto Portfolio Tracker";
  if (lower.includes("marketing") || lower.includes("growth")) return "SaaS Growth Marketing";
  if (lower.includes("voice") || lower.includes("avatar")) return "Voice Clone & Video Presenter";
  
  return currentTopic || "General SaaS Conversation";
}
