import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/hooks/useAuth';
import { Event } from '@/types';

export function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        {user && (
          <Link to="/events/new">
            <Button>Create Event</Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No events found</h2>
          <p className="text-gray-500 mb-6">Be the first to create an event!</p>
          {user ? (
            <Link to="/events/new">
              <Button>Create Event</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button>Login to Create Events</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id}>
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}