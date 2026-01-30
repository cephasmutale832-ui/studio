
'use server';

import { MOCK_USERS } from '@/lib/users';
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

    const agentIndex = MOCK_USERS.findIndex(u => u.id === agentId);

    if (agentIndex > -1 && MOCK_USERS[agentIndex].role === 'agent') {
        // This is a mock database, so we can mutate it directly.
        // In a real app, you would perform a database update operation.
        (MOCK_USERS[agentIndex] as any).status = 'approved';
        
        revalidatePath('/dashboard/agents');
        return { success: true, message: `${MOCK_USERS[agentIndex].name} has been approved.` };
    }
    
    return { success: false, message: 'Agent not found.' };
}
