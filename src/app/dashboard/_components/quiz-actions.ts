'use server';

import { generateQuizForVideo, type GenerateQuizInput, type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
    try {
        const quiz = await generateQuizForVideo(input);
        return quiz;
    } catch (error) {
        console.error('Error generating quiz:', error);
        // Return an empty quiz or throw, let's return empty for now to not break the UI
        return { questions: [] };
    }
}
