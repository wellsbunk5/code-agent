import * as fs from "fs";
import { z } from 'zod';
import { tool } from 'ai';

interface SearchFileInput {
  filePath: string;
  searchString: string;
}

interface SearchFileOutput {
  found: boolean;
  error?: string;
}

function searchFile(input: SearchFileInput): SearchFileOutput {
  try {
    const content = fs.readFileSync(input.filePath, 'utf-8');
    const found = content.includes(input.searchString);
    return { found };
  } catch (err) {
    const errorMessage = `Failed to search file at ${input.filePath}: ${err}`;
    return { found: false, error: errorMessage };
  }
}

export const searchFileTool = tool({
  description: 'Search for a string in a file at the given path. Returns true if the string is found, otherwise false.',
  inputSchema: z.object({
    filePath: z.string().describe('The relative path to the file to search, e.g. ./src/input.txt'),
    searchString: z.string().describe('The string to search for in the file'),
  }),
  execute: searchFile
});