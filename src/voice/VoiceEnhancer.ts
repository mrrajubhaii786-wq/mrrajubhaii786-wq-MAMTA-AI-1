// src/voice/VoiceEnhancer.ts

/**
 * Normalizes an audio PCM Float32Array buffer to a targeted peak level
 * (e.g. 0.8 of absolute maximum amplitude) to eliminate digital clipping and distortion.
 */
export function cleanAudio(buffer: Float32Array): Float32Array {
  if (buffer.length === 0) return buffer;

  // 1. Find absolute peak amplitude
  let maxVal = 0;
  for (let i = 0; i < buffer.length; i++) {
    const val = Math.abs(buffer[i]);
    if (val > maxVal) {
      maxVal = val;
    }
  }

  // If silent or already quiet, return original
  if (maxVal < 0.0001) {
    return buffer;
  }

  // 2. Normalize to a target peak of 0.8
  const targetPeak = 0.8;
  const multiplier = targetPeak / maxVal;

  const output = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    // scale and soft-clamp just in case
    let v = buffer[i] * multiplier;
    if (v > 1.0) v = 1.0;
    if (v < -1.0) v = -1.0;
    output[i] = v;
  }

  return output;
}

/**
 * Builds a real-time Web Audio API filter pipeline (Noise Gate and Equalizer)
 * for active microphone inputs during live clone voice recording.
 */
export function applyWebAudioEnhancements(audioContext: AudioContext, sourceNode: MediaStreamAudioSourceNode): AudioNode {
  // 1. Noise gate / Highpass filter to suppress low-frequency environmental rumble and hum (under 100Hz)
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 100; // eliminate hum
  highpass.Q.value = 1.0;

  // 2. Vocal peak equalizer to boost presence around 2kHz - 4kHz
  const eq = audioContext.createBiquadFilter();
  eq.type = "peaking";
  eq.frequency.value = 3000;
  eq.Q.value = 1.2;
  eq.gain.value = 3.0; // 3dB boost for clarity

  // 3. Dynamic compressor to prevent transient clipping and keep volumes consistent
  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-24, audioContext.currentTime);
  compressor.knee.setValueAtTime(30, audioContext.currentTime);
  compressor.ratio.setValueAtTime(12, audioContext.currentTime);
  compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
  compressor.release.setValueAtTime(0.25, audioContext.currentTime);

  // Connect pipeline
  sourceNode.connect(highpass);
  highpass.connect(eq);
  eq.connect(compressor);

  return compressor;
}
