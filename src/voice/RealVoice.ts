export class RealVoice {
  private samples: Blob[] = [];

  addSample(sample: Blob) {
    this.samples.push(sample);
  }

  async speak(text: string) {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel active speaking states to prevent stack blocking
      window.speechSynthesis.cancel();
      
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-IN"; // Indian English voice base for custom local synthesis
      utter.rate = 0.95;    // Balanced, comfortable professional tempo
      utter.pitch = 1.0;
      
      // Attempt to load regional or custom local voices if available
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('IN'));
      if (inVoice) {
        utter.voice = inVoice;
      }
      
      window.speechSynthesis.speak(utter);
    } else {
      console.log(`[RealVoice Simulated Speech]: ${text}`);
    }
  }

  getSamplesCount() {
    return this.samples.length;
  }
}
