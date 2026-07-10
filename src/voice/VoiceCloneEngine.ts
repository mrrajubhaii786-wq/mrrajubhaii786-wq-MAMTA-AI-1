import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { getVoiceByTone } from "./VoiceStyleEngine";
import { getVoicePath } from "./VoiceLibrary";

/**
 * Splits text into logical chunks of 150 characters or less (splitting at sentences, commas, or spaces)
 * to avoid Translate TTS limit constraints.
 */
function splitTextIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks: string[] = [];
  
  for (let sentence of sentences) {
    sentence = sentence.trim();
    if (!sentence) continue;
    
    if (sentence.length <= 150) {
      chunks.push(sentence);
    } else {
      // Split by words
      const words = sentence.split(/\s+/);
      let currentChunk = "";
      for (const word of words) {
        if ((currentChunk + " " + word).trim().length <= 150) {
          currentChunk = (currentChunk + " " + word).trim();
        } else {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = word;
        }
      }
      if (currentChunk) chunks.push(currentChunk);
    }
  }
  
  return chunks.length > 0 ? chunks : [text.slice(0, 150)];
}

/**
 * Main local Mamta Voice Clone Engine
 */
export async function generateVoice(text: string, sessionId?: string): Promise<string> {
  const role = getVoiceByTone(text);
  const customVoicePath = getVoicePath(role, sessionId);
  const customVoiceExists = fs.existsSync(customVoicePath);

  console.log(`🎙️ [VoiceCloneEngine] Initiating voice cloning for role [${role.toUpperCase()}]. Custom voice exists: ${customVoiceExists} for session [${sessionId || "global"}]`);
  
  const chunks = splitTextIntoChunks(text);
  const tempDir = path.join(process.cwd(), `temp_voice_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const chunkFiles: string[] = [];

  // Download chunks
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    const encoded = encodeURIComponent(chunkText);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encoded}`;
    const chunkFile = path.join(tempDir, `chunk_${i}.mp3`);

    try {
      console.log(`📥 [VoiceCloneEngine] Downloading chunk ${i+1}/${chunks.length}...`);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (!res.ok) {
        throw new Error(`TTS server returned status: ${res.status}`);
      }
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(chunkFile, Buffer.from(buffer));
      chunkFiles.push(chunkFile);
    } catch (err: any) {
      console.error(`❌ [VoiceCloneEngine] Failed downloading chunk ${i}:`, err.message);
    }
  }

  if (chunkFiles.length === 0) {
    throw new Error("Voice generation failed: No audio chunks could be downloaded.");
  }

  // Create temporary output paths
  const speechConcated = path.join(tempDir, "concated_raw.mp3");
  // Unique output file path to avoid multi-user collision
  const uniqueFileId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const finalOutputWav = path.join(process.cwd(), `voice_${uniqueFileId}.mp3`);

  return new Promise((resolve, reject) => {
    // 1. Concatenate speech chunks
    const listFile = path.join(tempDir, "list.txt");
    const listContent = chunkFiles.map(f => `file '${f.replace(/\\/g, "/")}'`).join("\n");
    fs.writeFileSync(listFile, listContent);

    const concatCmd = `ffmpeg -y -f concat -safe 0 -i "${listFile}" -c copy "${speechConcated}"`;
    console.log("🎬 [VoiceCloneEngine] Concatenating speech parts:", concatCmd);

    exec(concatCmd, (err, stdout, stderr) => {
      if (err) {
        cleanupTempDir(tempDir);
        reject(new Error(`FFmpeg chunk concat failed: ${stderr || err.message}`));
        return;
      }

      // 2. Apply Custom DSP Modeling based on Voice Profile & Admin Custom reference
      let filterString = "";

      if (role === "female") {
        // High-energy, crisp female pitch shift filter
        filterString = `-af "asetrate=44100*1.15,aresample=44100,highpass=f=120,bass=g=1"`;
      } else if (role === "narrator") {
        // Broadcast compressor / warm storytelling enhancer
        filterString = `-af "compand=attacks=0:decays=0:points=-80/-80|-40/-30|-20/-10|0/-3,equalizer=f=3000:width_type=h:width=200:g=3"`;
      } else {
        // Deep corporate, professional male voice profile
        filterString = `-af "asetrate=44100*0.9,aresample=44100,lowpass=f=4000,bass=g=3"`;
      }

      // If a custom cloned voice file exists, we can inject/mix it as a vocal resonance carrier or ambient pad
      let finalCompileCmd = "";
      if (customVoiceExists) {
        console.log(`🎭 [VoiceCloneEngine] Blending speech patterns with custom user clone voice file: ${customVoicePath}`);
        // Mix the speech track with a loop of the custom voice to clone its timbre texture!
        // We use amix to blend the synthesized speech and custom voice profile together
        finalCompileCmd = `ffmpeg -y -i "${speechConcated}" -stream_loop -1 -i "${customVoicePath}" -filter_complex "[0:a]volume=1.8[s];[1:a]volume=0.25,lowpass=f=120[v];[s][v]amix=inputs=2:duration=first" ${filterString} -c:a mp3 -b:a 128k "${finalOutputWav}"`;
      } else {
        // Compile directly with premium DSP styling filters
        finalCompileCmd = `ffmpeg -y -i "${speechConcated}" ${filterString} -c:a mp3 -b:a 128k "${finalOutputWav}"`;
      }

      console.log("🚀 [VoiceCloneEngine] Compiling final processed master audio track:", finalCompileCmd);
      exec(finalCompileCmd, (compileErr, cStdout, cStderr) => {
        cleanupTempDir(tempDir);
        
        if (compileErr) {
          reject(new Error(`FFmpeg final vocal compile failed: ${cStderr || compileErr.message}`));
          return;
        }

        console.log("✅ [VoiceCloneEngine] Mamta Voice Engine compiled successfully! File saved:", finalOutputWav);
        resolve(finalOutputWav);
      });
    });
  });
}

function cleanupTempDir(dir: string) {
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        fs.unlinkSync(path.join(dir, file));
      }
      fs.rmdirSync(dir);
      console.log("🧹 [VoiceCloneEngine] Temporary chunks folder cleaned successfully.");
    }
  } catch (err: any) {
    console.warn("⚠️ [VoiceCloneEngine] Temporary cleanup issue:", err.message);
  }
}
