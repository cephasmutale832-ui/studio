'use server';
/**
 * @fileOverview A flow to generate a quiz for a video.
 *
 * - generateQuizForVideo - Generates a multiple-choice quiz based on a video's title and description.
 * - GenerateQuizInput - The input type for the generateQuizForVideo function.
 * - GenerateQuizOutput - The return type for the generateQuizForVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const GenerateQuizInputSchema = z.object({
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('The description of the video.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
});

export const GenerateQuizOutputSchema = z.object({
  questions: z
    .array(QuestionSchema)
    .describe('A list of 3-5 quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuizForVideo(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const quizPrompt = ai.definePrompt({
  name: 'quizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert educator. Based on the following video title and description, generate a short multiple-choice quiz with 3 to 5 questions to test a student's understanding. For each question, provide 4 plausible options and indicate the correct answer.

Video Title: {{{title}}}
Video Description: {{{description}}}

Generate the quiz now.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await quizPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid quiz. Please try again.');
    }
    return output;
  }
);
