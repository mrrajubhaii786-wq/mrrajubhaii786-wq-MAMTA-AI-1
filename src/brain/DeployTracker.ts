// src/brain/DeployTracker.ts

export type DeployStatus = "IDLE" | "BUILDING" | "UPLOADING" | "LIVE" | "PROCESSING" | "FAILED";

export function trackDeploy(log: string): DeployStatus {
  const lowercaseLog = log.toLowerCase();
  
  if (lowercaseLog.includes("fail") || lowercaseLog.includes("error") || lowercaseLog.includes("err:")) {
    return "FAILED";
  }
  if (lowercaseLog.includes("building") || lowercaseLog.includes("compiling") || lowercaseLog.includes("npm run build")) {
    return "BUILDING";
  }
  if (lowercaseLog.includes("uploading") || lowercaseLog.includes("transferring") || lowercaseLog.includes("deploying")) {
    return "UPLOADING";
  }
  if (lowercaseLog.includes("ready") || lowercaseLog.includes("live") || lowercaseLog.includes("success") || lowercaseLog.includes("complete")) {
    return "LIVE";
  }
  
  return "PROCESSING";
}
