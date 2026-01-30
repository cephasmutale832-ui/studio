
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const accessCodeSchema = z.object({
  code: z.string().min(6, { message: 'Access code must be at least 6 characters.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const avatarImage = PlaceHolderImages.find(img => img.id === 'avatar-1');

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Cephas Mutale',
    email: 'cephasmutale832@gmail.com',
    password: 'password123',
    avatar: avatarImage?.imageUrl ?? '',
    role: 'admin' as const,
  },
   {
    id: 'agent-1',
    name: 'Trusted Agent 1',
    email: 'agent1@example.com',
    password: 'password123',
    avatar: '',
    role: 'agent' as const,
  },
  {
    id: 'agent-2',
    name: 'Trusted Agent 2',
    email: 'agent2@example.com',
    password: 'password123',
    avatar: '',
    role: 'agent' as const,
  },
  {
    id: 'agent-3',
    name: 'Trusted Agent 3',
    email: 'agent3@example.com',
    password: 'password123',
    avatar: '',
    role: 'agent' as const,
  }
];


const MOCK_TRIAL_CODE = 'TRIAL123';

export async function validateAccessCode(prevState: any, formData: FormData) {
  const validatedFields = accessCodeSchema.safeParse({
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data.',
    };
  }
  
  const { code } = validatedFields.data;

  if (code.toUpperCase() !== MOCK_TRIAL_CODE) {
    return {
      errors: { code: ['Invalid access code.'] },
      message: 'Invalid access code.',
    };
  }

  // Set auth cookie for 7 days
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = {
    user: {
      id: 'trial-user',
      name: 'Trial User',
      email: 'trial@example.com',
      avatar: '',
      role: 'student' as const,
    },
    expires: expires.toISOString(),
    isTrial: true,
  };

  cookies().set('session', JSON.stringify(session), { expires, httpOnly: true });
  
  redirect('/dashboard');
}

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data.',
    };
  }

  const { email, password } = validatedFields.data;

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    return {
      errors: { email: ['Invalid email or password.'] },
      message: 'Invalid credentials.',
    };
  }

  // Set auth cookie with no expiry (for mock purposes)
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = {
     user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    expires: expires.toISOString(),
    isTrial: false,
  };

  cookies().set('session', JSON.stringify(session), { expires, httpOnly: true });

  redirect('/dashboard');
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/');
}

export async function updateSessionPayment() {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return;

    try {
        const sessionData = JSON.parse(sessionCookie);
        
        // Extend expiry and set isTrial to false
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const newSession = {
            ...sessionData,
            expires: expires.toISOString(),
            isTrial: false,
        };
        
        cookies().set('session', JSON.stringify(newSession), { expires, httpOnly: true });
        
    } catch (error) {
        console.error('Failed to update session:', error);
    }
}

const profileSchema = z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
});

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

interface ProfileFormState {
    success: boolean | null;
    message?: string;
    errors?: {
        name?: string[];
        picture?: string[];
    }
}

export async function updateProfile(prevState: ProfileFormState | null, formData: FormData): Promise<ProfileFormState> {
    const validatedFields = profileSchema.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name } = validatedFields.data;
    const picture = formData.get('picture') as File;

    if (picture && picture.size > 0 && !ACCEPTED_IMAGE_TYPES.includes(picture.type)) {
        return {
            success: false,
            message: 'Invalid file type for profile picture.',
            errors: { picture: ['Only .jpg, .jpeg, .png and .webp formats are supported.'] },
        }
    }
    
    console.log('--- Updating Profile ---');
    console.log('Name:', name);
    if (picture && picture.size > 0) {
        console.log('Picture Name:', picture.name);
        console.log('Picture Size:', picture.size);
        console.log('Picture Type:', picture.type);
    }
    console.log('------------------------');

    return {
        success: true,
        message: 'Profile updated successfully!',
    }
}
