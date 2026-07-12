// src/voice/VoiceOutput.ts

export function speak(text: string): void {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this browser.");
    return;
  }

  // Cancel any ongoing speaking to avoid overlapping speech queue build-up
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 1.0;
  utterance.pitch = 1.1;

  window.speechSynthesis.speak(utterance);
}

let activeVoiceInterval: any = null;

/**
 * Starts a continuous audio feedback loop during building phases,
 * reminding the user that progress is active, and cleanly releases resources upon completion.
 */
export function startVoiceProgressLoop(message = "Building project...", intervalMs = 15000): void {
  stopVoiceProgressLoop(); // prevent duplicates
  
  // Speak immediately
  speak(message);
  
  activeVoiceInterval = setInterval(() => {
    speak(message);
  }, intervalMs);
  
  console.log(`🎙️ [VoiceProgress] Started background voice tracking loop: "${message}"`);
}

/**
 * Stops any active background vocal tracking loop
 */
export function stopVoiceProgressLoop(): void {
  if (activeVoiceInterval) {
    clearInterval(activeVoiceInterval);
    activeVoiceInterval = null;
    console.log(`🎙️ [VoiceProgress] Stopped background voice tracking loop.`);
  }
}

