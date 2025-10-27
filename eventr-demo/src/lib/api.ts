import { Event, User, ApiResponse } from '@/types';

// Mock data
const USERS_KEY = 'eventr_users';
const EVENTS_KEY = 'eventr_events';

// Initialize mock data if not exists
const initMockData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers = [
      {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'password123'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(EVENTS_KEY)) {
    const defaultEvents = [
      {
        id: '1',
        title: 'Tech Conference 2023',
        description: 'Join us for the biggest tech conference of the year featuring speakers from around the world.',
        date: '2023-12-15T09:00:00.000Z',
        location: 'San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=60',
        organizerId: '1',
        attendees: []
      },
      {
        id: '2',
        title: 'Startup Networking Mixer',
        description: 'Connect with fellow entrepreneurs and investors in a casual setting.',
        date: '2023-11-20T18:00:00.000Z',
        location: 'New York, NY',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=60',
        organizerId: '1',
        attendees: []
      }
    ];
    localStorage.setItem(EVENTS_KEY, JSON.stringify(defaultEvents));
  }
};

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    await delay(500); // Simulate API delay
    initMockData();
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return { success: true, data: userWithoutPassword };
    }
    
    return { success: false, error: 'Invalid email or password' };
  },
  
  register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
    await delay(500);
    initMockData();
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.some((u: User) => u.email === email)) {
      return { success: false, error: 'Email already in use' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, data: userWithoutPassword };
  },
  
  // Events
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    await delay(300);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    return { success: true, data: events };
  },
  
  getEvent: async (id: string): Promise<ApiResponse<Event>> => {
    await delay(300);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const event = events.find((e: Event) => e.id === id);
    
    if (event) {
      return { success: true, data: event };
    }
    
    return { success: false, error: 'Event not found' };
  },
  
  createEvent: async (eventData: Omit<Event, 'id' | 'attendees'>): Promise<ApiResponse<Event>> => {
    await delay(500);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      attendees: []
    };
    
    events.push(newEvent);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    
    return { success: true, data: newEvent };
  },
  
  updateEvent: async (id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
    await delay(500);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const eventIndex = events.findIndex((e: Event) => e.id === id);
    
    if (eventIndex === -1) {
      return { success: false, error: 'Event not found' };
    }
    
    events[eventIndex] = { ...events[eventIndex], ...eventData };
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    
    return { success: true, data: events[eventIndex] };
  },
  
  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const filteredEvents = events.filter((e: Event) => e.id !== id);
    
    localStorage.setItem(EVENTS_KEY, JSON.stringify(filteredEvents));
    
    return { success: true };
  },
  
  // RSVPs
  rsvpToEvent: async (eventId: string, userId: string): Promise<ApiResponse<Event>> => {
    await delay(300);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const eventIndex = events.findIndex((e: Event) => e.id === eventId);
    
    if (eventIndex === -1) {
      return { success: false, error: 'Event not found' };
    }
    
    const event = events[eventIndex];
    
    if (event.attendees.includes(userId)) {
      return { success: false, error: 'User already RSVP\'d to this event' };
    }
    
    event.attendees.push(userId);
    events[eventIndex] = event;
    
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    
    return { success: true, data: event };
  },
  
  cancelRsvp: async (eventId: string, userId: string): Promise<ApiResponse<Event>> => {
    await delay(300);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const eventIndex = events.findIndex((e: Event) => e.id === eventId);
    
    if (eventIndex === -1) {
      return { success: false, error: 'Event not found' };
    }
    
    const event = events[eventIndex];
    event.attendees = event.attendees.filter(id => id !== userId);
    events[eventIndex] = event;
    
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    
    return { success: true, data: event };
  },
  
  getUserEvents: async (userId: string): Promise<ApiResponse<Event[]>> => {
    await delay(300);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const userEvents = events.filter((e: Event) => e.organizerId === userId);
    
    return { success: true, data: userEvents };
  },
  
  getUserRsvps: async (userId: string): Promise<ApiResponse<Event[]>> => {
    await delay(300);
    initMockData();
    
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const rsvpEvents = events.filter((e: Event) => e.attendees.includes(userId));
    
    return { success: true, data: rsvpEvents };
  }
};