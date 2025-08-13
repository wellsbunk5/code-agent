import { Agent } from './agent/agent';
import * as readline from 'readline';


async function start_agent() {
  const agent = new Agent();
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
  }
}

start_agent();

