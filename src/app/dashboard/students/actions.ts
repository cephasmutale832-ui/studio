
'use server';

import { getUsers, saveUsers } from '@/lib/users';
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

    const users = await getUsers();
    const studentIndex = users.findIndex(u => u.id === studentId);

    if (studentIndex > -1 && users[studentIndex].role === 'student') {
        const studentName = users[studentIndex].name;
        users.splice(studentIndex, 1);
        await saveUsers(users);
        
        revalidatePath('/dashboard/students');
        return { success: true, message: `Student "${studentName}" has been deleted.` };
    }
    
    return { success: false, message: 'Student not found.' };
}
