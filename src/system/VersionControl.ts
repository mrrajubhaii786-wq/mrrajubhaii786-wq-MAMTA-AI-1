// src/system/VersionControl.ts
import fs from "fs";

const VERSION_FILE = "./versions.json";

export function saveVersion(state: any) {
  let versions: any[] = [];
  try {
    if (fs.existsSync(VERSION_FILE)) {
      const fileContent = fs.readFileSync(VERSION_FILE, "utf-8").trim();
      versions = fileContent ? JSON.parse(fileContent) : [];
    }
  } catch (err: any) {
    console.warn("⚠️ [VersionControl] Failed to parse versions.json, resetting list:", err.message);
    versions = [];
  }

  versions.push({
    timestamp: Date.now(),
    state,
  });

  try {
    fs.writeFileSync(VERSION_FILE, JSON.stringify(versions, null, 2), "utf-8");
    console.log("🧾 [VersionControl] System state version successfully saved.");
  } catch (err: any) {
    console.error("❌ [VersionControl] Failed to write version file:", err.message);
  }
}

export function rollback() {
  try {
    if (!fs.existsSync(VERSION_FILE)) {
      console.warn("⚠️ [VersionControl] No version file exists for rollback.");
      return null;
    }

    const fileContent = fs.readFileSync(VERSION_FILE, "utf-8").trim();
    if (!fileContent) {
      console.warn("⚠️ [VersionControl] Version file is empty.");
      return null;
    }

    const versions = JSON.parse(fileContent);
    if (!Array.isArray(versions) || versions.length < 2) {
      console.warn("⚠️ [VersionControl] Insufficient version history to perform rollback.");
      return versions[0]?.state || null;
    }

    const targetVersion = versions[versions.length - 2];
    console.log("🧾 [VersionControl] Reverting system state to previous version timestamp:", targetVersion.timestamp);
    return targetVersion.state;
  } catch (err: any) {
    console.error("❌ [VersionControl] Rollback error:", err.message);
    return null;
  }
}
