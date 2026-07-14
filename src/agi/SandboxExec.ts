export class SandboxExec {
  test(code: string): { success: boolean; error?: string } {
    try {
      // Direct syntax check & dry run using Function constructor
      new Function(code);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Unknown compile/syntax error" };
    }
  }
}
