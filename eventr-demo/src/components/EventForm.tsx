import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Event } from '@/types';

interface EventFormProps {
  event?: Event;
  isEditing?: boolean;
}

export function EventForm({ event, isEditing = false }: EventFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    time: event?.time || '',
    location: event?.location || '',
    image: event?.image || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create or edit events',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isEditing ? `/api/events/${event?.id}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          organizerId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      const data = await response.json();
      
      toast({
        title: isEditing ? 'Event Updated' : 'Event Created',
        description: `${formData.title} has been ${isEditing ? 'updated' : 'created'} successfully`,
      });
      
      navigate(`/events/${data.data.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} event`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Event Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter event title"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md min-h-[100px]"
              placeholder="Describe your event"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Event location"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Image URL (optional)
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}