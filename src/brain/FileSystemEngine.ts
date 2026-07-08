export interface VirtualFile {
  fileName: string;
  content: string;
  size: string;
  createdAt: number;
}

export class FileSystemEngine {
  private basePath = "./generated";
  private virtualStorage: Map<string, VirtualFile> = new Map();

  createFile(fileName: string, content: string): string {
    // Generate browser-safe virtual file representation
    const fileRecord: VirtualFile = {
      fileName,
      content,
      size: `${(content.length / 1024).toFixed(2)} KB`,
      createdAt: Date.now()
    };
    
    this.virtualStorage.set(fileName, fileRecord);
    console.log(`📁 [Virtual FS] Saved "${fileName}" to local virtual workspace storage.`);

    // Optional safe dynamic check for server-side environments
    try {
      // We check if we are in a real server-side Node environment with write permission
      if (typeof process !== "undefined" && process.versions && process.versions.node) {
        // Safe dynamic require to bypass browser-side bundler errors
        const fs = require("fs");
        const path = require("path");
        const targetDir = path.join(process.cwd(), "generated");
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(path.join(targetDir, fileName), content);
        return `✅ File created physically & virtually: ${fileName} (${fileRecord.size})`;
      }
    } catch (e) {
      // Silent catch for browser environment
    }

    return `✅ File created in virtual workspace: ${fileName} (${fileRecord.size})`;
  }

  getVirtualFiles(): VirtualFile[] {
    return Array.from(this.virtualStorage.values());
  }
}
