import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Event } from '@/types';
import { api } from '@/lib/api';

interface RSVPButtonProps {
  eventId: string;
  attendees: string[];
  onRSVPChange: () => void;
}

export function RSVPButton({ eventId, attendees, onRSVPChange }: RSVPButtonProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user has RSVP'd
  const hasRSVP = user && attendees.includes(user.id);

  const handleRSVP = async () => {
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
      let response;
      
      if (hasRSVP) {
        response = await api.cancelRsvp(eventId, user.id);
      } else {
        response = await api.rsvpToEvent(eventId, user.id);
      }

      if (!response.success) {
        throw new Error(response.error || 'Failed to update RSVP');
      }

      toast({
        title: hasRSVP ? 'RSVP Cancelled' : 'RSVP Confirmed',
        description: hasRSVP ? 'You are no longer attending this event' : 'You are now attending this event',
      });
      
      onRSVPChange();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update your RSVP',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <Button
        variant={hasRSVP ? "destructive" : "default"}
        onClick={handleRSVP}
        disabled={isSubmitting}
      >
        {hasRSVP ? "Cancel RSVP" : "RSVP to Event"}
      </Button>
    </div>
  );
}