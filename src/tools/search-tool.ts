import * as fs from "fs";
import * as path from "path";
import { z } from 'zod';
import { tool } from 'ai';

interface SearchFileInput {
  query: string;
  directory?: string;
}

interface SearchFileOutput {
  found: boolean;
  filePath?: string;
  error?: string;
}

function searchForFileOrContent(
  dir: string,
  query: string
): string | undefined {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const result = searchForFileOrContent(fullPath, query);
      if (result) {
        return result;
      }
    } else {
      if (entry.name.includes(query)) {
        return fullPath;
      }
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes(query)) {
          return fullPath;
        }
      } catch {
        continue; // Ignore error reading specific file.
      }
    }
  }
  return undefined;
}

function searchFile(input: SearchFileInput): SearchFileOutput {
  const startDir = input.directory || process.cwd();
  try {
    const foundPath = searchForFileOrContent(startDir, input.query);
    if (foundPath) {
      return { found: true, filePath: foundPath };
    } else {
      return { found: false, error: `No file found matching query "${input.query}" in ${startDir}` };
    }
  } catch (err) {
    return { found: false, error: `Search failed: ${err}` };
  }
}

export const searchFileTool = tool({
  description: 'Searches for a file by file name or by content. Returns the path to the first matching file.',
  inputSchema: z.object({
    query: z.string().describe('File name or content to search for'),
    directory: z.string().optional().describe('Optional directory to start search (defaults to project root)'),
  }),
  execute: searchFile
});
