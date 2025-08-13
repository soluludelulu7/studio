'use server';

/**
 * @fileOverview AI-powered code hint system for the interactive coding playground.
 *
 * - getCodeHint - A function that provides helpful hints based on the user's code and the expected solution.
 * - CodeHintInput - The input type for the getCodeHint function.
 * - CodeHintOutput - The return type for the getCodeHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeHintInputSchema = z.object({
  code: z.string().describe('The user-submitted code.'),
  expectedOutput: z.string().describe('The expected output of the code.'),
  lessonContent: z.string().describe('The content of the current lesson.'),
});
export type CodeHintInput = z.infer<typeof CodeHintInputSchema>;

const CodeHintOutputSchema = z.object({
  hint: z.string().describe('A helpful hint to guide the user towards the correct solution.'),
});
export type CodeHintOutput = z.infer<typeof CodeHintOutputSchema>;

export async function getCodeHint(input: CodeHintInput): Promise<CodeHintOutput> {
  return codeHintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeHintPrompt',
  input: {schema: CodeHintInputSchema},
  output: {schema: CodeHintOutputSchema},
  prompt: `You are an AI coding tutor. Your goal is to provide helpful, specific hints to a student who is learning Python.

  The student is working on the following lesson:
  {{lessonContent}}

  The student's code is:
  {{code}}

  The expected output of the code is:
  {{expectedOutput}}

  Provide a single, concise hint that will help the student correct their code and achieve the expected output. Do not provide the complete answer, only give a step in the right direction.`,
});

const codeHintFlow = ai.defineFlow(
  {
    name: 'codeHintFlow',
    inputSchema: CodeHintInputSchema,
    outputSchema: CodeHintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
