import { Event, EventFilters } from '../entities/Event';

export interface EventRepository {
  getEvents(filters?: EventFilters): Promise<Event[]>;
  getEvent(id: string): Promise<Event | null>;
  createEvent(event: Omit<Event, 'id'>): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
} 