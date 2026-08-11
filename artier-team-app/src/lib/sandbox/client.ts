export interface SandboxConfig {
  apiKey?: string;
  domain?: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

// Mock execution for development without OpenSandbox service
// Replace with real implementation when OpenSandbox is deployed
export async function executeCommand(
  command: string,
  _config?: SandboxConfig
): Promise<ExecutionResult> {
  const startTime = Date.now();

  // Simulate execution delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock response for development
  return {
    stdout: `[Mock] Command executed: ${command}\n\nOutput would appear here when connected to OpenSandbox.\nConfigure OPENSANDBOX_API_KEY in .env.local to use real sandbox.`,
    stderr: "",
    exitCode: 0,
    duration: Date.now() - startTime,
  };
}

export async function executeScript(
  script: string,
  language: "bash" | "python" | "node" = "bash",
  config?: SandboxConfig
): Promise<ExecutionResult> {
  let command: string;
  switch (language) {
    case "python":
      command = `python3 -c "${script.replace(/"/g, '\\"')}"`;
      break;
    case "node":
      command = `node -e "${script.replace(/"/g, '\\"')}"`;
      break;
    default:
      command = script;
  }

  return executeCommand(command, config);
}
