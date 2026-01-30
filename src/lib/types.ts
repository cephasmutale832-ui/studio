
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Session {
  user: User;
  expires: string; // ISO 8601 date string
  isTrial: boolean;
}
