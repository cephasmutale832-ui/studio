
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
const MOCK_USER = {
  id: '1',
  name: 'Alex Doe',
  email: 'student@example.com',
  password: 'password123',
  avatar: avatarImage?.imageUrl ?? ''
};

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
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      avatar: MOCK_USER.avatar
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

  if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
    return {
      errors: { email: ['Invalid email or password.'] },
      message: 'Invalid credentials.',
    };
  }

  // Set auth cookie with no expiry (for mock purposes)
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = {
     user: {
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      avatar: MOCK_USER.avatar
    },
    expires: expires.toISOString(),
    isTrial: false,
  };

  cookies().set('session', JSON.stringify(session), { expires, httpOnly: true });

  redirect('/dashboard');
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/login');
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
