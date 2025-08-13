import { Agent } from './agent/agent';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
export const MEMORY_PATH = path.resolve(__dirname, '../../persistent-memory.json');
export const DEBUG = process.env.DEBUG === 'true' || false;
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1';

const args = process.argv.slice(2);

if (args[0] === 'clear') {
  if (fs.existsSync(MEMORY_PATH)) {
    fs.unlinkSync(MEMORY_PATH);
    console.log('Persistent memory cleared.');
  } else {
    console.log('No persistent memory file found to clear.');
  }
  process.exit(0);
}


async function start_agent() {
    let initialMemory = [];
    if (fs.existsSync(MEMORY_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(MEMORY_PATH, 'utf-8'));
      if (data && data.memory && Array.isArray(data.memory)) {
        initialMemory = data.memory;
      }
    } catch (err) {
      console.warn('Could not load persistent memory, starting fresh.');
    }
  }
  const agent = new Agent(initialMemory);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Chat with WellsAi (type 'exit' or hit Ctrl+C to quit)");
  while (true) {
    const userMessage: string = await new Promise((resolve) => {
      rl.question("You: ", (answer) => resolve(answer));
    });

    if (userMessage.trim().toLowerCase() === 'exit') {
      console.log("Exiting chat. Goodbye!");
      rl.close();
      break;
    }

    const response = await agent.processUserMessage(userMessage);
    console.log("Wells AI:", response);
    // Save updated memory to persistent storage after each interaction in case of CTRL+C exit
    try {
      fs.writeFileSync(MEMORY_PATH, JSON.stringify({ memory: agent.getMemory() }, null, 2), 'utf-8');
    } catch (err) {
      if (DEBUG) {
        console.error('Failed to save persistent memory:', err);
      }
    }
  }
}

if (!args[0] || args[0] === 'chat') {
  start_agent();
}