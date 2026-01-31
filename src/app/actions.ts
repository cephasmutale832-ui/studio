
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { MOCK_USERS } from '@/lib/users';

// Schemas
const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  whatsappNumber: z.string().min(10, { message: 'Please enter a valid WhatsApp number including country code.' }),
});

const agentSignupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

// Staff Login Action
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

  const user = MOCK_USERS.find(u => u.email === email && (u as any).password === password);

  if (!user || user.role === 'student') {
    return {
      errors: { email: ['Invalid email or password for staff.'] },
      message: 'Invalid credentials.',
    };
  }

  if (user.role === 'agent' && user.status !== 'approved') {
    return {
      errors: { email: ['This agent account has not been approved.'] },
      message: 'Account not approved.',
    };
  }

  // Set auth cookie for 30 days
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = {
     user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    },
    expires: expires.toISOString(),
    isTrial: false,
  };

  cookies().set('session', JSON.stringify(session), { expires, httpOnly: true });

  redirect('/dashboard');
}

// New Student Signup Action
export async function studentSignup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    whatsappNumber: formData.get('whatsappNumber'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data.',
    };
  }
  
  const { name, email, password, whatsappNumber } = validatedFields.data;

  // Check if user already exists
  if (MOCK_USERS.some(u => u.email === email)) {
    return {
      success: false,
      errors: { email: ['An account with this email already exists.'] },
      message: 'User already exists.',
    };
  }
  
  const newUser = {
    id: `student-${Date.now()}`,
    name,
    email,
    password, // In a real app, hash and salt this!
    avatar: '',
    role: 'student' as const,
    status: 'pending' as const,
    whatsappNumber,
    paymentCode: '',
    paymentCodeSent: false,
  };

  MOCK_USERS.push(newUser as any); // Add to in-memory store
  
  return {
      success: true,
      message: "Registration successful! Your account is now pending approval from an administrator."
  }
}

// Agent Signup Action
export async function agentSignup(prevState: any, formData: FormData) {
  const validatedFields = agentSignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data.',
    };
  }
  
  const { name, email, password } = validatedFields.data;

  if (MOCK_USERS.some(u => u.email === email)) {
    return {
      success: false,
      errors: { email: ['An account with this email already exists.'] },
      message: 'User already exists.',
    };
  }
  
  const newAgent = {
    id: `agent-${Date.now()}`,
    name,
    email,
    password, // In a real app, hash and salt this!
    avatar: '',
    role: 'agent' as const,
    status: 'pending' as const,
  };

  MOCK_USERS.push(newAgent as any);

  return {
      success: true,
      message: "Registration successful! Your account is now pending approval from an administrator."
  }
}


// New Student Login Action
export async function studentLogin(prevState: any, formData: FormData) {
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

  const user = MOCK_USERS.find(u => u.email === email && (u as any).password === password && u.role === 'student');

  if (!user) {
    return {
      errors: { email: ['Invalid email or password.'] },
      message: 'Invalid credentials.',
    };
  }

  if (user.status !== 'approved') {
    return {
      errors: { email: ['This student account has not been approved.'] },
      message: 'Account not approved.',
    };
  }

  // Set auth cookie for 30 days.
  // We assume an existing student logging in is no longer on a trial.
  // For new approved users, start a 7-day trial.
  const isNewUser = !user.paymentCodeSent; // Heuristic to check if it's a first real login
  const expires = new Date(Date.now() + (isNewUser ? 7 : 30) * 24 * 60 * 60 * 1000);
  const session = {
     user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    },
    expires: expires.toISOString(),
    isTrial: isNewUser,
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
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
        return { success: false, message: 'Authentication required.' };
    }
    const session = JSON.parse(sessionCookie);
    const userId = session.user.id;

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
    
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found.' };
    }

    // Update user in our mock database
    MOCK_USERS[userIndex].name = name;

    // In a real app, you would handle file upload here and get a new URL
    // For this mock, we'll just log it and not change the avatar
    if (picture && picture.size > 0) {
        console.log('--- Profile Picture Upload ---');
        console.log('File Name:', picture.name);
        console.log('File Size:', picture.size);
        console.log('File Type:', picture.type);
        console.log('Note: File upload is not fully implemented in this mock environment.');
        console.log('----------------------------');
    }

    // Update the session cookie
    const newSession = {
        ...session,
        user: {
            ...session.user,
            name: name,
        }
    };
    const expires = new Date(newSession.expires);
    cookies().set('session', JSON.stringify(newSession), { expires, httpOnly: true });

    revalidatePath('/dashboard/account');
    revalidatePath('/dashboard');

    return {
        success: true,
        message: 'Profile updated successfully!',
    }
}
