'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { type Message } from 'genkit/ai';

const ChatHistorySchema = z.array(
  z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })
);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;


export async function continueChat(history: ChatHistory) {
  const systemPrompt = `You are a friendly and helpful AI assistant for Mango SmartLearning, an online educational platform. Your goal is to help students with their questions about subjects, learning materials, and general knowledge. Be encouraging and clear in your explanations. Keep your answers concise.`;

    const genkitHistory: Message[] = history.map(h => ({
        role: h.role,
        content: [{ text: h.content }]
    }));

    const response = await ai.generate({
        prompt: systemPrompt,
        history: genkitHistory,
    });

    return response.text;
}
