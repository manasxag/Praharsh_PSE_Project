import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Attendee } from '@/types';

interface RSVPButtonProps {
  eventId: string;
  attendees: Attendee[];
  onRSVPChange: () => void;
}

type RSVPStatus = 'going' | 'maybe' | 'not_going';

export function RSVPButton({ eventId, attendees, onRSVPChange }: RSVPButtonProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find current user's RSVP status
  const currentUserRSVP = user 
    ? attendees.find(a => a.userId === user.id)
    : null;

  const currentStatus = currentUserRSVP?.status || null;

  const handleRSVP = async (status: RSVPStatus) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to RSVP for this event',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update RSVP');
      }

      toast({
        title: 'RSVP Updated',
        description: `You are ${status.replace('_', ' ')} to this event`,
      });
      
      onRSVPChange();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update your RSVP',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <Button
        variant={currentStatus === 'going' ? 'default' : 'outline'}
        onClick={() => handleRSVP('going')}
        disabled={isSubmitting}
      >
        Going
      </Button>
      <Button
        variant={currentStatus === 'maybe' ? 'default' : 'outline'}
        onClick={() => handleRSVP('maybe')}
        disabled={isSubmitting}
      >
        Maybe
      </Button>
      <Button
        variant={currentStatus === 'not_going' ? 'default' : 'outline'}
        onClick={() => handleRSVP('not_going')}
        disabled={isSubmitting}
      >
        Not Going
      </Button>
    </div>
  );
}