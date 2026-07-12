// src/voice/VoiceToCode.ts

export async function startVoiceInput(onText: (text: string) => void, onError?: (err: any) => void): Promise<any> {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError(new Error("Speech recognition is not supported in this browser."));
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const text = event.results[event.results.length - 1][0].transcript;
    onText(text);
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event);
  };

  recognition.start();
  return recognition;
}
