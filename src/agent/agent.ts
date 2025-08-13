import { generateText, LanguageModel, ModelMessage, stepCountIs, ToolSet } from 'ai';
import { openai } from "@ai-sdk/openai"
import { runBashCommandTool } from '../tools/run-bash-command';
import { readFileTool } from '../tools/read-tool';
import { listFilesTool } from '../tools/list-tool';
import { searchFileTool } from '../tools/search-tool';
import { editFileTool } from '../tools/edit-tool';
import { AGENT_INSTRUCTIONS } from './instructions';
import dotenv from 'dotenv';


export class Agent {
  client: LanguageModel;
  messageMemory: ModelMessage[];
  systemPrompt: string;
  tools: ToolSet;

  constructor() {
    dotenv.config();
    this.client = openai("gpt-4.1");
    this.systemPrompt = AGENT_INSTRUCTIONS;
    this.messageMemory = [];
    this.tools = {
      listFilesTool,
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
      temperature: 0
    });

    const { response, text } = agentResponse;
    this.messageMemory.push(...response.messages);
    return text;
  };
}
