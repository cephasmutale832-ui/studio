
import { cookies } from 'next/headers';
import { type Session } from '@/lib/types';

export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  
  try {
    const session = JSON.parse(sessionCookie);
    // Basic validation
    if (session && session.user && session.expires) {
      return session as Session;
    }
  } catch (error) {
    console.error('Invalid session cookie:', error);
  }
  
  return null;
}
