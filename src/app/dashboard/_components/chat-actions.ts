'use server';
/**
 * @fileOverview Chat flow for the AI assistant.
 *
 * - continueChat - Continues the conversation with the AI assistant.
 * - ChatHistory - The type for the conversation history.
 */

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

// Define the chat flow
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatHistorySchema,
    outputSchema: z.string(),
  },
  async (history) => {
    const systemPrompt = `You are a friendly and helpful AI assistant for Mango SmartLearning, an online educational platform. Your goal is to help students with their questions about subjects, learning materials, and general knowledge. Be encouraging and clear in your explanations. Keep your answers concise.`;

    const messages: Message[] = [
      { role: 'system', content: [{ text: systemPrompt }] },
      ...history.map((h) => ({
        role: h.role,
        content: [{ text: h.content }],
      })),
    ];

    const llmResponse = await ai.generate({
      history: messages,
    });

    return llmResponse.text;
  }
);

// Export a function that runs the flow
export async function continueChat(history: ChatHistory): Promise<string> {
  return chatFlow(history);
}
