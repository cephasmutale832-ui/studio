
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
  },
   {
    id: 'agent-1',
    name: 'Trusted Agent 1',
    email: 'agent1@example.com',
    password: 'password123',
    avatar: '',
    role: 'agent' as const,
    status: 'approved' as const,
    whatsappNumber: '',
    paymentCode: '',
    paymentCodeSent: false,
  },
  {
    id: 'agent-2',
    name: 'Trusted Agent 2',
    email: 'agent2@example.com',
    password: 'password123',
    avatar: '',
    role: 'agent' as const,
    status: 'approved' as const,
    whatsappNumber: '',
    paymentCode: '',
    paymentCodeSent: false,
  },
  {
    id: 'agent-3',
    name: 'Trusted Agent 3',
    email: 'agent3@example.com',
    password: 'password123',
    avatar: '',
    role: 'agent' as const,
    status: 'approved' as const,
    whatsappNumber: '',
    paymentCode: '',
    paymentCodeSent: false,
  },
  {
    id: 'student-1',
    name: 'Existing Student',
    email: 'student@example.com',
    password: 'password123',
    avatar: '',
    role: 'student' as const,
    whatsappNumber: '260774177403',
    paymentCode: '',
    paymentCodeSent: false,
  }
];
