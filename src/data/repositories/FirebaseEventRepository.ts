import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  QueryConstraint,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Event, EventFilters } from '../../domain/entities/Event';
import { EventRepository } from '../../domain/repositories/EventRepository';

export class FirebaseEventRepository implements EventRepository {
  private eventsCollection = collection(db, 'events');

  async getEvents(filters?: EventFilters, sort?: string): Promise<Event[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters) {
        if (filters.startDate) {
          constraints.push(where('date', '>=', filters.startDate.toISOString()));
        }
        if (filters.endDate) {
          constraints.push(where('date', '<=', filters.endDate.toISOString()));
        }
        if (filters.minPrice !== undefined) {
          constraints.push(where('price', '>=', filters.minPrice));
        }
        if (filters.maxPrice !== undefined) {
          constraints.push(where('price', '<=', filters.maxPrice));
        }
      }

      if (sort) {
        switch (sort) {
          case 'date-desc':
            constraints.push(orderBy('date', 'desc'));
            break;
          case 'date-asc':
            constraints.push(orderBy('date', 'asc'));
            break;
          case 'price-asc':
            constraints.push(orderBy('price', 'asc'));
            break;
          case 'price-desc':
            constraints.push(orderBy('price', 'desc'));
            break;
        }
      } else {
        constraints.push(orderBy('date', 'desc'));
      }

      const q = query(this.eventsCollection, ...constraints);
      const snapshot = await getDocs(q);
      
      let events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        events = events.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
        );
      }

      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  async getEvent(id: string): Promise<Event | null> {
    try {
      const docRef = doc(this.eventsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Event;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  }

  async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    try {
      const docRef = await addDoc(this.eventsCollection, {
        ...event,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...event
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    try {
      const docRef = doc(this.eventsCollection, id);
      await updateDoc(docRef, {
        ...event,
        updatedAt: new Date().toISOString()
      });
      
      const updated = await this.getEvent(id);
      if (!updated) throw new Error('Event not found');
      return updated;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const docRef = doc(this.eventsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  subscribeToAvailableTickets(eventId: string, callback: (count: number) => void) {
    const eventRef = doc(db, 'events', eventId);
    
    return onSnapshot(eventRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const total = data.totalTickets || 0;
        const booked = data.bookedTickets || 0;
        callback(total - booked);
      }
    });
  }
}