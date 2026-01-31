
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

// This function is designed to be safe against data loss.
// If the file is corrupted, it will throw an error rather than returning a default state,
// which could cause the file to be overwritten on the next save.
export async function getUsers(): Promise<User[]> {
    try {
        const fileContents = await fs.readFile(usersFilePath, 'utf8');
        if (fileContents.trim() === '') {
            return [initialAdminUser];
        }
        const data = JSON.parse(fileContents);
        if (Array.isArray(data.users)) {
            // Ensure the primary admin user always exists.
            if (!data.users.some((u: User) => u.id === initialAdminUser.id && u.role === 'admin')) {
                 data.users.unshift(initialAdminUser);
            }
            return data.users;
        }
        throw new Error('users.json data is not in the expected format.');
    } catch (error) {
        if (error instanceof Error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                // If the file doesn't exist, create it with the default admin.
                await saveUsers([initialAdminUser]);
                return [initialAdminUser];
            }
        }
        console.error("Error reading users.json:", error);
        throw new Error("Could not read the user data file. It may be corrupted.");
    }
}

export async function saveUsers(users: User[]): Promise<void> {
    const data = { users };
    await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
}
