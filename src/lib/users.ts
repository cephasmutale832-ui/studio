
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { type User } from '@/lib/types';

const avatarImage = PlaceHolderImages.find(img => img.id === 'avatar-1');

// Mock user data - This is not persistent. Users will be lost on server restart.
// In a real app, you would use a database.
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Cephas Mutale',
    email: 'cephasmutale832@gmail.com',
    password: 'Cep12345TY',
    avatar: avatarImage?.imageUrl ?? '',
    role: 'admin' as const,
    status: 'approved' as const,
    whatsappNumber: '',
    paymentCode: '',
    paymentCodeSent: false,
  }
];
