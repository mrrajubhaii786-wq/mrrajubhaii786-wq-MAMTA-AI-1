// src/system/Guardrails.ts

const BLOCKED_COMMANDS = [
  "rm -rf",
  "shutdown",
  "reboot",
  "mkfs",
];

export function validateCommand(cmd: string) {
  if (!cmd) return true;
  for (const blocked of BLOCKED_COMMANDS) {
    if (cmd.includes(blocked)) {
      throw new Error("❌ Unsafe command blocked");
    }
  }

  return true;
}

export function validateAction(action: string) {
  const allowed = ["BUILD", "FIX", "DEPLOY", "TEST", "BLOCKED"];

  if (!allowed.includes(action)) {
    throw new Error("❌ Invalid AGI action");
  }

  return true;
}
