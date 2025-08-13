import * as fs from "fs";
import { z } from 'zod';
import { tool } from 'ai';

interface ListFilesInput {
  path: string;
}

interface ListFilesOutput {
  items: string[];
  error?: string;
}

async function listFiles(input: ListFilesInput): Promise<ListFilesOutput> {
  const dirPath = input.path === "" ? "." : input.path;
  try {
    const items = fs.readdirSync(dirPath);
    const relativeItems = items.map(item => {
      const fullPath = `${dirPath}/${item}`;
      const isDir = fs.statSync(fullPath).isDirectory();
      return isDir ? `${fullPath}/` : fullPath;
    });
    return { items: relativeItems };
  } catch (err) {
    const errorMessage = `Failed to list files in directory ${dirPath}: ${err}`;
    return { items: [], error: errorMessage };
  }
}

export const listFilesTool = tool({
  description: 'List files and directories inside a given directory path. If the path is empty, lists items in the current directory. Returns a list of relative paths, with directories ending in a slash (/).',
  inputSchema: z.object({
    path: z.string().describe('The relative path to the directory to list, e.g. ./src or leave empty for current directory'),
  }),
  execute: listFiles
});