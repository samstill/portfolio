import { useState, useEffect } from 'react';
import { Event } from '../../domain/entities/Event';
import { FirebaseEventRepository } from '../../data/repositories/FirebaseEventRepository';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { eventsCollection } from '../../firebase';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    const eventsQuery = query(eventsCollection, orderBy('date', 'asc'));
    
    const unsubscribe = onSnapshot(eventsQuery, 
      (snapshot) => {
        const updatedEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          availableTickets: doc.data().availableTickets || 0,
          soldTickets: doc.data().soldTickets || 0
        } as Event));
        
        setEvents(updatedEvents);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching events:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const deleteEvent = async (id: string) => {
    try {
      const eventRepository = new FirebaseEventRepository();
      await eventRepository.deleteEvent(id);
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    deleteEvent
  };
}; 