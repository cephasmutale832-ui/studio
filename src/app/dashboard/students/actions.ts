
'use server';

import { MOCK_USERS } from '@/lib/users';
import { revalidatePath } from 'next/cache';

interface ActionState {
    success: boolean | null;
    message?: string;
}

export async function deleteStudentAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const studentId = formData.get('studentId') as string;
    
    if (!studentId) {
        return { success: false, message: 'Student ID is missing.' };
    }

    const studentIndex = MOCK_USERS.findIndex(u => u.id === studentId);

    if (studentIndex > -1 && MOCK_USERS[studentIndex].role === 'student') {
        const studentName = MOCK_USERS[studentIndex].name;
        // In a real app, you would perform a database delete operation.
        MOCK_USERS.splice(studentIndex, 1);
        
        revalidatePath('/dashboard/students');
        return { success: true, message: `Student "${studentName}" has been deleted.` };
    }
    
    return { success: false, message: 'Student not found.' };
}
