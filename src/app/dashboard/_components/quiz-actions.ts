'use server';

import { generateQuizForVideo, type GenerateQuizInput, type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
    try {
        const quiz = await generateQuizForVideo(input);
        return quiz;
    } catch (error) {
        console.error('Error generating quiz:', error);
        // Re-throw so the client can handle it, e.g. with a toast message.
        throw new Error('An error occurred while generating the quiz.');
    }
}
