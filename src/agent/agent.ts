import { generateText, LanguageModel, ModelMessage, stepCountIs, ToolSet } from 'ai';
import { openai } from "@ai-sdk/openai";
import { runBashCommandTool } from '../tools/run-bash-command';
import { readFileTool } from '../tools/read-tool';
import { listFilesTool } from '../tools/list-tool';
import { searchFileTool } from '../tools/search-tool';
import { editFileTool } from '../tools/edit-tool';
import { AGENT_INSTRUCTIONS } from './instructions';
import { DEBUG, OPENAI_MODEL } from '..';
import { writeFileTool } from '../tools/write-tool';
import { checkCodeTool } from '../tools/code-check';


export class Agent {
  client: LanguageModel;
  messageMemory: ModelMessage[];
  systemPrompt: string;
  tools: ToolSet;

  constructor(memory: ModelMessage[]) {
    this.client = openai(OPENAI_MODEL);
    this.systemPrompt = AGENT_INSTRUCTIONS;
    this.messageMemory = memory;
    this.tools = {
      listFilesTool,
      writeFileTool,
      checkCodeTool,
      readFileTool,
      searchFileTool,
      editFileTool,
      runBashCommandTool
    };
  }

  public processUserMessage = async (userMessage: string): Promise<string> => {
    this.messageMemory.push({ role: 'user', content: userMessage });
    const agentResponse = await generateText({
      model: this.client,
      system: this.systemPrompt,
      stopWhen: stepCountIs(50),
      messages: this.messageMemory,
      tools: this.tools,
      temperature: 0,
      onStepFinish: (step) => {
        if (DEBUG) {
          console.log(JSON.stringify(step, null, 2));
        }
      }
    });

    const { response, text } = agentResponse;
    this.messageMemory.push(...response.messages);
    return text;
  };

  public getMemory(): ModelMessage[] {
    return this.messageMemory;
  }
}
