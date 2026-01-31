
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'agent' | 'student';
  status?: 'pending' | 'approved';
  whatsappNumber?: string;
  paymentCode?: string;
  paymentCodeSent?: boolean;
  password?: string;
}

export interface Session {
  user: User;
  expires: string; // ISO 8601 date string
  isTrial: boolean;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'document' | 'quiz' | 'past-paper';
  subject: string;
  topic?: string;
  imageId: string;
  url?: string;
}
