export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer';
  password: string; // In a real app, we would never store passwords like this
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizerId: string;
  organizer?: User;
  attendees: Attendee[];
  createdAt: string;
  updatedAt: string;
}

export interface Attendee {
  userId: string;
  eventId: string;
  status: 'going' | 'maybe' | 'not_going';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}