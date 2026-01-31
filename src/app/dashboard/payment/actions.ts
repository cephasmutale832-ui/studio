
'use server';

import { z } from 'zod';
import { updateSessionPayment } from '@/app/actions';
import { getSession } from '@/lib/auth';
import { getUsers, saveUsers } from '@/lib/users';
import { validatePaymentWithTransactionDetails } from '@/ai/flows/validate-payment-with-transaction-details';

interface FormState {
  success: boolean | null;
  message?: string;
}

const codeSchema = z.string().min(6, { message: 'Please enter a valid code.' });

export async function validatePaymentCodeAction(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'You must be logged in.' };
    }

    const validatedCode = codeSchema.safeParse(formData.get('validationCode'));

    if (!validatedCode.success) {
      return { success: false, message: validatedCode.error.flatten().formErrors[0] };
    }
    const code = validatedCode.data;

    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === session.user.id);
    if (userIndex === -1) {
      return { success: false, message: 'User not found.' };
    }

    const user = users[userIndex];
    
    if (user.paymentCode && user.paymentCode.toUpperCase() === code.toUpperCase()) {
      // Code matches. Update the session.
      await updateSessionPayment();

      // Update status to 'registered' and clear payment code
      users[userIndex].status = 'registered';
      users[userIndex].paymentCode = '';
      await saveUsers(users);

      return { success: true, message: 'Payment validated successfully!' };
    } else {
      return { success: false, message: 'The validation code is incorrect. Please try again.' };
    }
  } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected server error occurred.';
      return { success: false, message };
  }
}

const transactionSchema = z.object({
  transactionDetails: z.string().min(10, { message: 'Please provide more details about the transaction.' }),
});


export async function validateTransactionDetailsAction(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'You must be logged in.' };
    }

    const validatedDetails = transactionSchema.safeParse({
      transactionDetails: formData.get('transactionDetails'),
    });

    if (!validatedDetails.success) {
      return { success: false, message: validatedDetails.error.flatten().formErrors[0] };
    }

    const result = await validatePaymentWithTransactionDetails({
      transactionDetails: validatedDetails.data.transactionDetails,
    });

    if (result.isValidPayment) {
      await updateSessionPayment();
      
      const users = await getUsers();
      const userIndex = users.findIndex(u => u.id === session.user.id);
      if (userIndex > -1) {
        users[userIndex].status = 'registered';
        await saveUsers(users);
      }
      
      return { success: true, message: result.validationResult };
    } else {
      return { success: false, message: result.validationResult };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during validation. Please try again.';
    console.error('AI validation error:', error);
    return { success: false, message: message };
  }
}
