import * as fs from "fs";
import { z } from 'zod';
import { tool } from 'ai';

interface EditFileInput {
  filePath: string;
  oldString: string;
  newString: string;
}

interface EditFileOutput {
  success: boolean;
  error?: string;
}

async function editFile(input: EditFileInput): Promise<EditFileOutput> {
  try {
    const content = fs.readFileSync(input.filePath, 'utf-8');
    const updatedContent = content.replace(input.oldString, input.newString);

    if (updatedContent === content) {
      return { success: false, error: `The old string "${input.oldString}" wasn't found in the file.` };
    }

    fs.writeFileSync(input.filePath, updatedContent, 'utf-8');
    return { success: true };
  } catch (err) {
    const errorMessage = `Failed to update file at ${input.filePath}: ${err}`;
    return { success: false, error: errorMessage };
  }
}

export const editFileTool = tool({
  description: 'Edit a file by replacing an old string with a new string in a file at the given relative path. Returns an error if the old string is not found.',
  inputSchema: z.object({
    filePath: z.string().describe('The relative path to the file to update, e.g. ./src/output.txt'),
    oldString: z.string().describe('The string to replace in the file'),
    newString: z.string().describe('The string to replace with'),
  }),
  execute: editFile
});