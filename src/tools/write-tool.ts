import * as fs from "fs";
import { z } from "zod";
import { tool } from "ai";

export const writeFileTool = tool({
  description: "Write contents to a new or empty file at the given path. Overwrites if the file exists and is empty.",
  inputSchema: z.object({
    filePath: z.string().describe("The relative path to the file to write, e.g. ./src/newfile.txt"),
    content: z.string().describe("The contents to write to the file"),
  }),
  execute: ({ filePath, content }) => {
    if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf-8").length > 0) {
      return {
        success: false,
        error: "File already exists and is not empty.",
      };
    }
    fs.writeFileSync(filePath, content, "utf-8");
    return { success: true };
  },
});