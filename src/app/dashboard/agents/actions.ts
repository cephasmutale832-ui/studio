
'use server';

import { getUsers, saveUsers } from '@/lib/users';
import { revalidatePath } from 'next/cache';

interface ActionState {
    success: boolean | null;
    message?: string;
}

export async function approveAgentAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const agentId = formData.get('agentId') as string;
    
    if (!agentId) {
        return { success: false, message: 'Agent ID is missing.' };
    }

    const users = await getUsers();
    const agentIndex = users.findIndex(u => u.id === agentId);

    if (agentIndex > -1 && users[agentIndex].role === 'agent') {
        users[agentIndex].status = 'approved';
        await saveUsers(users);
        
        revalidatePath('/dashboard/agents');
        return { success: true, message: `${users[agentIndex].name} has been approved.` };
    }
    
    return { success: false, message: 'Agent not found.' };
}
