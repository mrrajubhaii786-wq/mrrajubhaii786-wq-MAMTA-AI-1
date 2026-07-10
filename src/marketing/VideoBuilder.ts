import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function buildVideo(imageFiles: string[], audioFile: string): Promise<string> {
  console.log("🎬 [VideoBuilder] Preparing FFmpeg compilation script...");

  return new Promise((resolve, reject) => {
    try {
      const inputsFile = "inputs.txt";
      let concatContent = "";

      // Each scene gets exactly 5 seconds
      for (const img of imageFiles) {
        concatContent += `file '${img}'\nduration 5.0\n`;
      }
      // FFmpeg concat demuxer rule: last file needs to be listed once more without a duration
      if (imageFiles.length > 0) {
        concatContent += `file '${imageFiles[imageFiles.length - 1]}'\n`;
      }

      fs.writeFileSync(inputsFile, concatContent);
      console.log("📝 [VideoBuilder] Generated concat demuxer config:\n", concatContent);

      // We want to write the compiled video to public/ and dist/ so it is servable by Express & Vite
      const relativeVideoPath = "generated_video.mp4";
      
      // Ensure directories exist
      if (!fs.existsSync("public")) {
        fs.mkdirSync("public", { recursive: true });
      }
      if (!fs.existsSync("dist")) {
        fs.mkdirSync("dist", { recursive: true });
      }

      const tempOutput = "temp_output.mp4";

      // FFmpeg Command:
      // -y : overwrite output files
      // -f concat : use concat demuxer
      // -safe 0 : allow absolute/relative paths
      // -i inputs.txt : input scenes
      // -i voice.mp3 : input audio track
      // -c:v libx264 -pix_fmt yuv420p : standard safe H.264 encoding for browsers
      // -shortest : clip audio to match video duration
      // -vf "scale=720:1280" : output vertical 9:16 aspect ratio
      const cmd = `ffmpeg -y -f concat -safe 0 -i ${inputsFile} -i ${audioFile} -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -c:a aac -shortest -vf "scale=720:1280" -t 20 ${tempOutput}`;

      console.log("🚀 [VideoBuilder] Executing FFmpeg CLI:", cmd);

      exec(cmd, (err, stdout, stderr) => {
        // Clean up temporary files
        try {
          if (fs.existsSync(inputsFile)) fs.unlinkSync(inputsFile);
          for (const img of imageFiles) {
            if (fs.existsSync(img)) fs.unlinkSync(img);
          }
          if (fs.existsSync(audioFile)) fs.unlinkSync(audioFile);
        } catch (cleanupErr) {
          console.warn("⚠️ [VideoBuilder] Temporary files cleanup warning:", cleanupErr);
        }

        if (err) {
          console.error("❌ [VideoBuilder] FFmpeg command execution failed:", stderr);
          reject(new Error(`FFmpeg compilation failed: ${err.message}`));
          return;
        }

        console.log("✅ [VideoBuilder] FFmpeg compiled successfully!");

        // Move/copy compiled file to standard serving directories
        try {
          if (fs.existsSync(tempOutput)) {
            fs.copyFileSync(tempOutput, path.join("public", relativeVideoPath));
            fs.copyFileSync(tempOutput, path.join("dist", relativeVideoPath));
            fs.unlinkSync(tempOutput);
            console.log(`📦 [VideoBuilder] Video dispatched to /public and /dist!`);
          }
        } catch (copyErr: any) {
          console.warn("⚠️ [VideoBuilder] Copy to distribution paths warning:", copyErr.message);
        }

        resolve(`/generated_video.mp4`);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}
