import { execSync } from "child_process";
import { z } from 'zod';
import { tool } from 'ai';

interface RunBashCommandInput {
  command: string;
}

interface RunBashCommandOutput {
  stdout: string;
  error?: string;
}

async function runBashCommand(input: RunBashCommandInput): Promise<RunBashCommandOutput> {
  try {
    const stdout = execSync(input.command, { encoding: 'utf-8' });
    return { stdout };
  } catch (err: any) {
    const errorMessage = `Failed to execute command "${input.command}": ${err.message}`;
    return { stdout: '', error: errorMessage };
  }
}

export const runBashCommandTool = tool({
  description: 'Execute a bash command and return the response from stdout.',
  inputSchema: z.object({
    command: z.string().describe('The bash command to execute, e.g. ls -la'),
  }),
  execute: runBashCommand
});