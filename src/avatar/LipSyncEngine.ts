/**
 * Mamta Avatar AI - Lip Sync Engine (Production Grade)
 * Synchronizes voice audios with specific facial coordinates or video inputs.
 * Gracefully defaults to a synchronized video composition system if Wav2Lip checkpoints are not found.
 */

import { exec } from "child_process";
import fs from "fs";
import path from "path";

export function lipSync(audio: string, face: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const finalLipOutput = path.join(outputDir, `lip_sync_${Date.now()}.mp4`);

    // Verify if Wav2Lip checkpoint and script exist
    const wav2lipScript = path.join(process.cwd(), "wav2lip", "inference.py");
    const wav2lipCheckpoint = path.join(process.cwd(), "wav2lip.pth");
    
    const wav2LipExists = fs.existsSync(wav2lipScript) && fs.existsSync(wav2lipCheckpoint);

    if (wav2LipExists) {
      console.log(`👄 [LipSyncEngine] Wav2Lip model and checkpoints detected! Processing audio-to-mouth sync...`);
      const cmd = `python "${wav2lipScript}" --checkpoint_path "${wav2lipCheckpoint}" --face "${face}" --audio "${audio}" --outfile "${finalLipOutput}"`;
      
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error(`❌ [LipSyncEngine] Wav2Lip model process crashed:`, err.message);
          console.log(`💡 [LipSyncEngine] Falling back to synchronized video composition compiler...`);
          runCompositionSync(audio, face, finalLipOutput)
            .then(resolve)
            .catch(reject);
        } else {
          console.log(`✅ [LipSyncEngine] Wav2Lip lipsync rendered successfully! File: ${finalLipOutput}`);
          resolve(finalLipOutput);
        }
      });
    } else {
      console.log(`⚡ [LipSyncEngine] Wav2Lip script/checkpoint not found. Running synchronized visual compiler...`);
      runCompositionSync(audio, face, finalLipOutput)
        .then(resolve)
        .catch(reject);
    }
  });
}

/**
 * Visual synchronization composition fallback: pairs face clips and audio waves cleanly.
 */
function runCompositionSync(audioPath: string, facePath: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(audioPath)) {
      reject(new Error(`Audio path not found: ${audioPath}`));
      return;
    }

    const faceExists = fs.existsSync(facePath);
    let cmd = "";

    if (faceExists && facePath.endsWith(".mp4")) {
      // If facePath is already a video, we re-encode it with the new audio track!
      console.log(`👄 [LipSyncEngine Sync] Re-encoding facial video template with fresh vocal audio track...`);
      cmd = `ffmpeg -y -i "${facePath}" -i "${audioPath}" -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${outputPath}"`;
    } else if (faceExists) {
      // If facePath is a static image, we compile it into an MP4 and apply a talking pulse filter!
      console.log(`👄 [LipSyncEngine Sync] Compiling facial static image with voice track and speech overlays...`);
      cmd = `ffmpeg -y -loop 1 -i "${facePath}" -i "${audioPath}" -filter_complex "[0:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=brightness=0.02:saturation=1.05[v];[1:a]showwaves=s=720x180:mode=cline:colors=0xa855f7[wave];[v][wave]overlay=x=0:y=1050:shortest=1[outv]" -map "[outv]" -map 1:a -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k -shortest "${outputPath}"`;
    } else {
      // Complete solid state canvas
      console.log(`👄 [LipSyncEngine Sync] Creating default procedural video container...`);
      cmd = `ffmpeg -y -f lavfi -i color=c=0x0f172a:s=720x1280 -i "${audioPath}" -filter_complex "[1:a]showwaves=s=720x300:mode=line:colors=0x6366f1[wave];[0:v][wave]overlay=x=0:y=490:shortest=1[outv]" -map "[outv]" -map 1:a -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k -shortest "${outputPath}"`;
    }

    console.log(`🚀 [LipSyncEngine Sync] Executing composition:`, cmd);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ [LipSyncEngine Sync] Composition compilation failed:", stderr || err.message);
        // Fallback to simple still audio frame
        const basicSync = `ffmpeg -y -loop 1 -r 1 -i "${faceExists ? facePath : 'color=c=black:s=640x640'}" -i "${audioPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 128k -pix_fmt yuv420p -shortest "${outputPath}"`;
        exec(basicSync, (basicErr) => {
          if (basicErr) reject(basicErr);
          else resolve(outputPath);
        });
      } else {
        console.log(`✅ [LipSyncEngine Sync] Voice video successfully synthesized: ${outputPath}`);
        resolve(outputPath);
      }
    });
  });
}
