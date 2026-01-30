'use server';

import { validatePaymentWithTransactionDetails } from '@/ai/flows/validate-payment-with-transaction-details';
import { updateSessionPayment } from '@/app/actions';

interface FormState {
  success: boolean | null;
  message?: string;
  result?: {
    isValidPayment: boolean;
    validationResult: string;
  };
}

export async function validatePaymentAction(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const transactionDetails = formData.get('transactionDetails') as string;

  if (!transactionDetails || transactionDetails.trim().length < 10) {
    return { success: false, message: 'Please provide valid transaction details.' };
  }

  try {
    const result = await validatePaymentWithTransactionDetails({
      transactionDetails,
    });
    
    if (result.isValidPayment) {
        await updateSessionPayment();
        return { success: true, result };
    } else {
        return { success: false, result, message: result.validationResult };
    }

  } catch (error) {
    console.error('AI validation failed:', error);
    return { success: false, message: 'An unexpected error occurred during validation. Please try again later.' };
  }
}
