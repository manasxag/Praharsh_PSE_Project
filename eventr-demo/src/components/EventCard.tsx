import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>{formatDate(event.date)}</span>
        </CardDescription>
        <CardDescription className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          <span>{event.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link to={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}