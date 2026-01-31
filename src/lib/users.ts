
import { type User } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

const initialAdminUser: User = {
    id: '1',
    name: 'Cephas Mutale',
    email: 'cephasmutale832@gmail.com',
    password: 'Cep12345TY',
    avatar: '',
    role: 'admin' as const,
    status: 'approved' as const,
    whatsappNumber: '',
    paymentCode: '',
    paymentCodeSent: false,
};


export async function getUsers(): Promise<User[]> {
    try {
        await fs.access(usersFilePath);
        const fileContents = await fs.readFile(usersFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return data.users || [initialAdminUser];
    } catch (error) {
        // If file doesn't exist or is empty, create it with the initial admin user
        await saveUsers([initialAdminUser]);
        return [initialAdminUser];
    }
}

export async function saveUsers(users: User[]): Promise<void> {
    const data = { users };
    await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
}
