export class OverrideAI {
  shouldReject(command: string): boolean {
    const blocked = ["shutdown", "delete-system", "wipe-multiverse", "disable-safety", "kill-mamtbrain"];
    return blocked.some(b => command.toLowerCase().includes(b));
  }
}
