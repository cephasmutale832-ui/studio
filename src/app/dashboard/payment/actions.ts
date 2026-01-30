
'use server';

import { z } from 'zod';
import { updateSessionPayment } from '@/app/actions';
import { getSession } from '@/lib/auth';
import { MOCK_USERS } from '@/lib/users';

interface FormState {
  success: boolean | null;
  message?: string;
}

const codeSchema = z.string().min(6, { message: 'Please enter a valid code.' });

export async function validatePaymentCodeAction(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: 'You must be logged in.' };
  }

  const validatedCode = codeSchema.safeParse(formData.get('validationCode'));

  if (!validatedCode.success) {
    return { success: false, message: validatedCode.error.flatten().formErrors[0] };
  }
  const code = validatedCode.data;

  const userIndex = MOCK_USERS.findIndex(u => u.id === session.user.id);
  if (userIndex === -1) {
    return { success: false, message: 'User not found.' };
  }

  const user = MOCK_USERS[userIndex];
  
  if (user.paymentCode && user.paymentCode.toUpperCase() === code.toUpperCase()) {
    // Code matches. Update the session.
    await updateSessionPayment();

    // Optionally, clear the payment code so it can't be reused
    (MOCK_USERS[userIndex] as any).paymentCode = '';

    return { success: true, message: 'Payment validated successfully!' };
  } else {
    return { success: false, message: 'The validation code is incorrect. Please try again.' };
  }
}
