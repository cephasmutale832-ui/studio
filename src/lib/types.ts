
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'agent' | 'student';
}

export interface Session {
  user: User;
  expires: string; // ISO 8601 date string
  isTrial: boolean;
}
