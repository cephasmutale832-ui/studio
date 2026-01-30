'use server';
/**
 * @fileOverview Payment validation flow using transaction details.
 *
 * - validatePaymentWithTransactionDetails - Validates payment using transaction details uploaded by the student.
 * - ValidatePaymentInput - The input type for the validatePaymentWithTransactionDetails function.
 * - ValidatePaymentOutput - The return type for the validatePaymentWithTransactionDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ValidatePaymentInputSchema = z.object({
  transactionDetails: z
    .string()
    .describe(
      'The transaction details uploaded by the student, such as Airtel Money statement or Apple Pay code.'
    ),
});
export type ValidatePaymentInput = z.infer<typeof ValidatePaymentInputSchema>;

const ValidatePaymentOutputSchema = z.object({
  isValidPayment: z
    .boolean()
    .describe('Whether the payment is valid based on the transaction details.'),
  validationResult: z
    .string()
    .describe('The result of the payment validation process.'),
});
export type ValidatePaymentOutput = z.infer<typeof ValidatePaymentOutputSchema>;

export async function validatePaymentWithTransactionDetails(
  input: ValidatePaymentInput
): Promise<ValidatePaymentOutput> {
  return validatePaymentFlow(input);
}

const validatePaymentPrompt = ai.definePrompt({
  name: 'validatePaymentPrompt',
  input: {schema: ValidatePaymentInputSchema},
  output: {schema: ValidatePaymentOutputSchema},
  prompt: `You are an expert payment validation assistant for a service called Mango SmartLearning. A student has uploaded the following transaction details: {{{transactionDetails}}}. Determine if this represents a valid payment for accessing educational materials. To be considered valid, the transaction details must explicitly mention 'money sent to Cephas Mutale' AND 'amount ZMW70'. The isValidPayment field should be true if both keywords are present, and false otherwise. The validationResult field should contain a detailed explanation of your reasoning. Be brief.`,
});

const validatePaymentFlow = ai.defineFlow(
  {
    name: 'validatePaymentFlow',
    inputSchema: ValidatePaymentInputSchema,
    outputSchema: ValidatePaymentOutputSchema,
  },
  async input => {
    const {output} = await validatePaymentPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid response. Please try again.');
    }
    return output;
  }
);
