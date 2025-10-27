export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  organizerId: string;
  attendees: string[];
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}