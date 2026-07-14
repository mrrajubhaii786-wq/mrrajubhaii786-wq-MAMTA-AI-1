export class ASTValidator {
  validate(code: string): { valid: boolean; reason?: string } {
    const dangerousPatterns = [
      { pattern: "while(true)", reason: "Infinite blocking loop (while true)" },
      { pattern: "while (true)", reason: "Infinite blocking loop (while true)" },
      { pattern: "process.exit", reason: "Attempted Node.js process suicide" },
      { pattern: "rm -rf", reason: "Malicious filesystem delete command" },
      { pattern: "child_process", reason: "Attempted shell command injection" },
      { pattern: "eval(", reason: "Dynamic unsafe string evaluation" }
    ];

    for (const item of dangerousPatterns) {
      if (code.includes(item.pattern)) {
        return { valid: false, reason: `AST Violation: Blocked due to possible '${item.reason}' pattern.` };
      }
    }

    return { valid: true };
  }
}
