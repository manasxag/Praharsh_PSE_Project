import { http, HttpResponse, delay } from 'msw';
import mockData from './mockData.json';
import { Event, User, AuthResponse, ApiResponse } from '@/types';

// Helper to simulate network delay
const simulateDelay = () => delay(Math.floor(Math.random() * 500) + 300);

// Helper to get data from localStorage or fallback to mock data
const getEvents = (): Event[] => {
  const storedEvents = localStorage.getItem('eventr_events');
  return storedEvents ? JSON.parse(storedEvents) : mockData.events;
};

const getUsers = (): User[] => {
  const storedUsers = localStorage.getItem('eventr_users');
  return storedUsers ? JSON.parse(storedUsers) : mockData.users;
};

// Helper to save data to localStorage
const saveEvents = (events: Event[]) => {
  localStorage.setItem('eventr_events', JSON.stringify(events));
};

export const handlers = [
  // Get all events
  http.get('/api/events', async () => {
    await simulateDelay();
    const events = getEvents();
    
    return HttpResponse.json<ApiResponse<Event[]>>({
      data: events,
      message: 'Events retrieved successfully',
      success: true,
    });
  }),

  // Get single event by ID
  http.get('/api/events/:id', async ({ params }) => {
    await simulateDelay();
    const events = getEvents();
    const event = events.find(e => e.id === params.id);
    
    if (!event) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Event not found',
          success: false,
        }),
        { status: 404 }
      );
    }
    
    // Add organizer details
    const users = getUsers();
    const organizer = users.find(u => u.id === event.organizerId);
    const eventWithOrganizer = { ...event, organizer };
    
    return HttpResponse.json<ApiResponse<Event>>({
      data: eventWithOrganizer,
      message: 'Event retrieved successfully',
      success: true,
    });
  }),

  // Create new event
  http.post('/api/events', async ({ request }) => {
    await simulateDelay();
    const events = getEvents();
    const newEvent = await request.json() as Event;
    
    // Add required fields
    newEvent.id = `event-${Date.now()}`;
    newEvent.createdAt = new Date().toISOString();
    newEvent.updatedAt = new Date().toISOString();
    newEvent.attendees = [];
    
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    
    return HttpResponse.json<ApiResponse<Event>>({
      data: newEvent,
      message: 'Event created successfully',
      success: true,
    }, { status: 201 });
  }),

  // Update event
  http.put('/api/events/:id', async ({ params, request }) => {
    await simulateDelay();
    const events = getEvents();
    const eventIndex = events.findIndex(e => e.id === params.id);
    
    if (eventIndex === -1) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Event not found',
          success: false,
        }),
        { status: 404 }
      );
    }
    
    const updatedEvent = await request.json() as Event;
    updatedEvent.updatedAt = new Date().toISOString();
    
    // Preserve fields that shouldn't be updated by the client
    updatedEvent.id = events[eventIndex].id;
    updatedEvent.createdAt = events[eventIndex].createdAt;
    updatedEvent.attendees = events[eventIndex].attendees;
    
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = updatedEvent;
    saveEvents(updatedEvents);
    
    return HttpResponse.json<ApiResponse<Event>>({
      data: updatedEvent,
      message: 'Event updated successfully',
      success: true,
    });
  }),

  // Delete event
  http.delete('/api/events/:id', async ({ params }) => {
    await simulateDelay();
    const events = getEvents();
    const eventIndex = events.findIndex(e => e.id === params.id);
    
    if (eventIndex === -1) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Event not found',
          success: false,
        }),
        { status: 404 }
      );
    }
    
    const updatedEvents = events.filter(e => e.id !== params.id);
    saveEvents(updatedEvents);
    
    return HttpResponse.json({
      message: 'Event deleted successfully',
      success: true,
    });
  }),

  // RSVP to event
  http.post('/api/events/:id/rsvp', async ({ params, request }) => {
    await simulateDelay();
    const events = getEvents();
    const eventIndex = events.findIndex(e => e.id === params.id);
    
    if (eventIndex === -1) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Event not found',
          success: false,
        }),
        { status: 404 }
      );
    }
    
    const { userId, status } = await request.json() as { userId: string; status: 'going' | 'maybe' | 'not_going' };
    const event = events[eventIndex];
    
    // Check if user already has an RSVP
    const attendeeIndex = event.attendees.findIndex(a => a.userId === userId);
    
    if (attendeeIndex !== -1) {
      // Update existing RSVP
      event.attendees[attendeeIndex].status = status;
    } else {
      // Add new RSVP
      event.attendees.push({
        userId,
        eventId: event.id,
        status,
      });
    }
    
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = event;
    saveEvents(updatedEvents);
    
    return HttpResponse.json({
      data: event,
      message: 'RSVP updated successfully',
      success: true,
    });
  }),

  // Login
  http.post('/api/auth/login', async ({ request }) => {
    await simulateDelay();
    const { email, password } = await request.json() as { email: string; password: string };
    const users = getUsers();
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Invalid credentials',
          success: false,
        }),
        { status: 401 }
      );
    }
    
    // Create a fake token
    const token = `fake-jwt-token-${Math.random().toString(36).substring(2, 15)}`;
    
    // Store in localStorage
    localStorage.setItem('eventr_auth', JSON.stringify({ user, token }));
    
    return HttpResponse.json<ApiResponse<AuthResponse>>({
      data: {
        user: { ...user, password: '' }, // Don't send password back
        token,
      },
      message: 'Login successful',
      success: true,
    });
  }),

  // Logout
  http.post('/api/auth/logout', async () => {
    await simulateDelay();
    localStorage.removeItem('eventr_auth');
    
    return HttpResponse.json({
      message: 'Logout successful',
      success: true,
    });
  }),
];