import * as path from 'path';
import * as fs from 'fs';
import { z } from 'zod';
import { generateText, tool, ImagePart, TextPart } from 'ai';
import { openai } from '@ai-sdk/openai';
import { OPENAI_MODEL } from '..';


const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'];

interface ReadImageTextInput {
  imagePath: string;
}

interface ReadImageTextOutput {
  text: string;
  error: string;
}

function isValidImagePath(imagePath: string): boolean {
  try {
    fs.accessSync(imagePath);
  } catch {
    return false;
  }
  const ext = path.extname(imagePath).toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.includes(ext);
}

async function readImage(input: ReadImageTextInput): Promise<ReadImageTextOutput> {
  const { imagePath } = input;
  if (!isValidImagePath(imagePath)) {
    return {
      text: '',
      error: 'File does not exist or is not a valid image type.'
    };
  }

  

  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const imagePart: ImagePart = { type: 'image', image: imageBuffer };
    const textPart: TextPart = { type: 'text', text: 'Extract all readable text from the image.' };
    
    const { text: imageText } = await generateText({
      model: openai(OPENAI_MODEL),
      system: 'You are an expert at looking at an image and extracting any text you can read on it. You will return only the text you can read and nothing else.',
      messages: [{role: 'user', content: [textPart, imagePart]}],
      temperature: 0,
    });

    return {
      text: imageText.trim(),
      error: ''
    };

  } catch (err) {
    return {
      text: '',
      error: `Error reading image: ${err}`
    };
  }
}

export const readImageTextTool = tool({
  description: 'Reads and returns text off an image. The image is received by a relative path to the image file.',
  inputSchema: z.object({
    imagePath: z.string().describe('The relative path to the image file, e.g. "example.jpg"'),
  }),
  execute: readImage
});
