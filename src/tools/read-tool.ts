import * as fs from "fs";
import { z } from 'zod';
import { tool } from 'ai';

interface ReadFileInput {
  path: string;
}

interface ReadFileOutput {
  content: string;
  error?: string;
}

async function readFile(input: ReadFileInput): Promise<ReadFileOutput> {
  try {
    const content = fs.readFileSync(input.path, 'utf-8');
    return {content};
  } catch (err) {
    const errorMessage = `Failed to read file at ${input.path}: ${err}`;
    return {content: '', error: errorMessage};
  }
}

export const readFileTool = tool({
      description: 'Read the contents of a given relative file path. Use this when you want to see whats inside a file. Do not use this with directory names.',
      inputSchema: z.object({
        path: z.string().describe('The relative path to the file to read, e.g. ./src/index.ts'),
      }),
      execute: readFile
    });