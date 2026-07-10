export function getVoiceByTone(text: string): "male" | "female" | "narrator" {
  const lowercaseText = text.toLowerCase();
  
  // High-energy emojis or key terms map to Female (Girl AI)
  if (text.includes("🔥") || text.includes("🤯") || text.includes("OMG") || lowercaseText.includes("viral") || lowercaseText.includes("crazy")) {
    return "female";
  }
  
  // Question marks, storytelling keywords, or guide styles map to Narrator
  if (text.includes("?") || lowercaseText.includes("how to") || lowercaseText.includes("story") || lowercaseText.includes("did you know")) {
    return "narrator";
  }
  
  // Standard business, technical, or default statements map to Male (Founder Male)
  return "male";
}
