
'use server';

import { MOCK_USERS } from '@/lib/users';
import { revalidatePath } from 'next/cache';

interface ActionState {
    success: boolean | null;
    message?: string;
}

export async function approveAgentAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const agentId = formData.get('userId') as string;
    
    if (!agentId) {
        return { success: false, message: 'Agent ID is missing.' };
    }

    const agentIndex = MOCK_USERS.findIndex(u => u.id === agentId);

    if (agentIndex > -1 && MOCK_USERS[agentIndex].role === 'agent') {
        (MOCK_USERS[agentIndex] as any).status = 'approved';
        
        revalidatePath('/dashboard/users');
        return { success: true, message: `${MOCK_USERS[agentIndex].name} has been approved.` };
    }
    
    return { success: false, message: 'Agent not found.' };
}

export async function deleteUserAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const userId = formData.get('userId') as string;
    
    if (!userId) {
        return { success: false, message: 'User ID is missing.' };
    }
    
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);

    if (userIndex > -1) {
        const user = MOCK_USERS[userIndex];
        if (user.role === 'admin') {
            return { success: false, message: 'Cannot delete an admin account.' };
        }

        const userName = user.name;
        MOCK_USERS.splice(userIndex, 1);
        
        revalidatePath('/dashboard/users');
        return { success: true, message: `User "${userName}" has been deleted.` };
    }
    
    return { success: false, message: 'User not found.' };
}


interface SendCodeActionState {
    success: boolean | null;
    message?: string;
    whatsAppLink?: string;
}

export async function sendPaymentCodeAction(prevState: SendCodeActionState | null, formData: FormData): Promise<SendCodeActionState> {
    const userId = formData.get('userId') as string;
    if (!userId) {
        return { success: false, message: 'User ID is missing.' };
    }

    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found.' };
    }

    const user = MOCK_USERS[userIndex];
    if (user.role !== 'student' || !user.whatsappNumber) {
        return { success: false, message: 'This user is not a student or has no WhatsApp number.' };
    }
    
    // In a real app, this should be a cryptographically secure random string.
    const paymentCode = `MANGO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    (MOCK_USERS[userIndex] as any).paymentCode = paymentCode;
    (MOCK_USERS[userIndex] as any).paymentCodeSent = true;

    const message = `Hello ${user.name}, your payment validation code for Mango SmartLearning is: ${paymentCode}`;
    const whatsAppLink = `https://wa.me/${user.whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;

    revalidatePath('/dashboard/users');

    return {
        success: true,
        message: 'Code generated. Click the button to send it via WhatsApp.',
        whatsAppLink: whatsAppLink,
    };
}
