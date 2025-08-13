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
    this.client = openai("gpt-4o-mini");
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
    const response = await generateText({
      model: this.client,
      system: this.systemPrompt,
      stopWhen: stepCountIs(20),
      messages: [
        ...this.messageMemory,
        { role: 'user', content: userMessage }
      ],
      tools: this.tools,
      temperature: 0,
    //   onStepFinish(result) {
    //     // { text, toolCalls, toolResults, finishReason, usage }
    //     console.log(`Step finished. ${JSON.stringify(result)}`);
      
    // }
    });
    console.log("Agent response:", JSON.stringify(response));
    const { steps, text } = response;
    for (const step of steps) {
      console.log(step.toolCalls);
    }
    // this.messageMemory.push(steps);
    return text;
  };
}
