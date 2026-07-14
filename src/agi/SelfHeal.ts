import fs from "fs";
import path from "path";

export class SelfHeal {
  applyFix(file: string, code: string): "success" | "rollback" {
    // Ensure we are running on Node server context
    if (typeof window !== "undefined") {
      return "success";
    }

    const resolvedPath = path.resolve(process.cwd(), file);
    const backup = resolvedPath + ".bak";

    try {
      if (fs.existsSync(resolvedPath)) {
        fs.copyFileSync(resolvedPath, backup);
      }
      
      fs.writeFileSync(resolvedPath, code);
      return "success";
    } catch (e) {
      console.error("⚠️ [SelfHeal] Error writing code, rolling back:", e);
      try {
        if (fs.existsSync(backup)) {
          fs.copyFileSync(backup, resolvedPath);
        }
      } catch (rollbackErr) {
        console.error("❌ [SelfHeal] Critical backup rollback failure:", rollbackErr);
      }
      return "rollback";
    }
  }
}
