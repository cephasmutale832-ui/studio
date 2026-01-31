
'use server';

import { MOCK_USERS } from '@/lib/users';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

interface ActionState {
    success: boolean | null;
    message?: string;
}

export async function approveUserAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const userId = formData.get('userId') as string;
    
    if (!userId) {
        return { success: false, message: 'User ID is missing.' };
    }

    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);

    if (userIndex > -1) {
        const user = MOCK_USERS[userIndex];
        if (user.status === 'approved') {
            return { success: false, message: 'User is already approved.' };
        }
        (MOCK_USERS[userIndex] as any).status = 'approved';
        
        revalidatePath('/dashboard/users');
        return { success: true, message: `${user.name} has been approved.` };
    }
    
    return { success: false, message: 'User not found.' };
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


const updateUserSchema = z.object({
    userId: z.string(),
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    role: z.enum(['agent', 'student']),
    status: z.enum(['pending', 'approved']),
    whatsappNumber: z.string().optional(),
});

interface UpdateUserActionState {
    success: boolean | null;
    message?: string;
    errors?: {
        name?: string[];
        role?: string[];
        status?: string[];
        whatsappNumber?: string[];
    }
}

export async function updateUserAction(prevState: UpdateUserActionState | null, formData: FormData): Promise<UpdateUserActionState> {
    const validatedFields = updateUserSchema.safeParse({
        userId: formData.get('userId'),
        name: formData.get('name'),
        role: formData.get('role'),
        status: formData.get('status'),
        whatsappNumber: formData.get('whatsappNumber'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid data.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { userId, name, role, status, whatsappNumber } = validatedFields.data;

    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return { success: false, message: 'User not found.' };
    }

    const user = MOCK_USERS[userIndex];
    if (user.role === 'admin') {
        return { success: false, message: 'Administrator accounts cannot be modified through this form.' };
    }

    // Update user
    MOCK_USERS[userIndex] = {
        ...user,
        name,
        role,
        status,
        whatsappNumber: whatsappNumber ?? user.whatsappNumber,
    };
    
    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/edit/${userId}`);
    redirect('/dashboard/users');
}
