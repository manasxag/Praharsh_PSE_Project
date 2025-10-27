import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/hooks/useAuth';
import { Event } from '@/types';
import { api } from '@/lib/api';

export function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'myEvents' | 'rsvpEvents'>('myEvents');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      try {
        // Fetch events organized by the user
        const myEventsResponse = await api.getUserEvents(user.id);
        if (myEventsResponse.success) {
          setMyEvents(myEventsResponse.data as Event[]);
        }
        
        // Fetch events the user has RSVP'd to
        const rsvpEventsResponse = await api.getUserRsvps(user.id);
        if (rsvpEventsResponse.success) {
          setRsvpEvents(rsvpEventsResponse.data as Event[]);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchEvents();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link to="/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'myEvents'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('myEvents')}
          >
            My Events
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'rsvpEvents'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('rsvpEvents')}
          >
            My RSVPs
          </button>
        </div>
      </div>

      {activeTab === 'myEvents' && (
        <>
          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">You haven't created any events yet</h2>
              <p className="text-gray-500 mb-6">Create your first event to get started!</p>
              <Link to="/events/new">
                <Button>Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id}>
                  <EventCard event={event} />
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'rsvpEvents' && (
        <>
          {rsvpEvents.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">You haven't RSVP'd to any events yet</h2>
              <p className="text-gray-500 mb-6">Browse events and RSVP to see them here!</p>
              <Link to="/">
                <Button>Browse Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rsvpEvents.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id}>
                  <EventCard event={event} />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}