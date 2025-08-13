import { check, z } from 'zod';
import { generateObject, generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { DEBUG, OPENAI_MODEL } from '..';

interface CodeCheckInput {
  code: string;
  description: string;
}

async function checkCodeMeasures(input: CodeCheckInput): Promise<string> {
  const { code, description } = input;
  let updatedCode = '';
  let iterations = 0;
  const MAX_ITERATIONS = 3;

  updatedCode = code;

  while (iterations < MAX_ITERATIONS) {
    const { object: evaluation } = await generateObject({
      model: openai(OPENAI_MODEL),
      schema: z.object({
        correctness: z.number().min(1).max(10),
        readability: z.number().min(1).max(10),
        performance: z.number().min(1).max(10),
        security: z.number().min(1).max(10),
        duplication: z.number().min(1).max(10),
        improvementSuggestions: z.array(z.string()),
      }),
      system: `You are an expert at reviewing code. Provide a score from 1-10 on each of the following categories:
        correctness: Does the code do what it is supposed to? Are there any bugs or logical errors?
        readability: Is the code easy to understand? Are variable and function names clear?
        performance: Is the code efficient? Are there unnecessary computations or memory usage?
        security: Are there any vulnerabilities or unsafe practices?
        duplication: Does the code avoid unnecessary repetition?

        The most important category is correctness.
        Additionally, provide specific suggestions for improvement if there are any issues found.
        It is okay to provide high scores if the code is excellent. The code needs to receive at least a 9 in correctness and a 7 in the other categories to be considered acceptable.
      `,
      prompt: `Evaluate this code against the quality measures based on the description of what the code should do and return.:

      Description: ${description}
      Code: ${code}`,
    });

    if (DEBUG) {
      console.log('Code evaluation:', evaluation);
    }
    
    if (
      evaluation.correctness >= 8 &&
      evaluation.readability >= 7 &&
      evaluation.security >= 7 &&
      evaluation.duplication >= 7
    ) {
      break;
    }

    const { text: improvedCode } = await generateText({
      model: openai(OPENAI_MODEL),
      system: 'You are an expert at taking feedback from code and modifying it to improve its quality based on specific issues and suggestions provided.',
      temperature: 0,
      prompt: `Improve this code based on the following suggestions and description of what the code should do.:
      Description: ${description}
      Improvement Suggestions: ${evaluation.improvementSuggestions.join('\n')}

      Code: ${updatedCode}`,
    });

    updatedCode = improvedCode;
    iterations++;
  }

  return updatedCode;
}

export const checkCodeTool = tool({
  description: `Checks new code against quality measures and returns the code if it is approved or returns updated code that is higher quality.
  A description of what the code should do and return should also be provided to determine correctness.`,
  inputSchema: z.object({
    description: z.string().describe('A brief description of what the code should do and return'),
    code: z.string().describe('The new code to check'),
  }),
  execute: checkCodeMeasures
});
