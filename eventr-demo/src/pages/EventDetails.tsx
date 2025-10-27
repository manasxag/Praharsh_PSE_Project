import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RSVPButton } from '@/components/RSVPButton';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Event } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';
import { api } from '@/lib/api';

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const response = await api.getEvent(id!);
      if (response.success) {
        setEvent(response.data as Event);
      } else {
        throw new Error(response.error || 'Event not found');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event details',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await api.deleteEvent(id!);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete event');
      }

      toast({
        title: 'Event Deleted',
        description: 'The event has been successfully deleted',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-lg">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const isOrganizer = user && user.id === event.organizerId;
  const eventDate = new Date(event.date);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              &larr; Back to Events
            </Button>
          </Link>
        </div>

        {event.image && (
          <div className="mb-6 rounded-lg overflow-hidden h-64 md:h-80">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Date:</span> {formatDate(eventDate)}
            </div>
            <div>
              <span className="font-medium">Time:</span> {formatTime(event.time)}
            </div>
            <div>
              <span className="font-medium">Location:</span> {event.location}
            </div>
          </div>
          
          <div className="mb-8 whitespace-pre-wrap">{event.description}</div>
          
          {isOrganizer ? (
            <div className="flex flex-wrap gap-4">
              <Link to={`/events/${event.id}/edit`}>
                <Button variant="outline">Edit Event</Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Event
              </Button>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">RSVP to this event</h3>
              <RSVPButton 
                eventId={event.id} 
                attendees={event.attendees || []} 
                onRSVPChange={fetchEvent}
              />
            </div>
          )}
        </div>

        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Attendees ({event.attendees?.length || 0})</h2>
          
          {!event.attendees || event.attendees.length === 0 ? (
            <p className="text-muted-foreground">No attendees yet. Be the first to RSVP!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.attendees.map((attendee) => (
                <div key={attendee.userId} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {attendee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{attendee.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {attendee.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}