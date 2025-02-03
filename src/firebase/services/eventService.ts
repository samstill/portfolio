import { eventsCollection, db } from '../../firebase';
import { addDoc, getDocs, serverTimestamp, query, orderBy, doc, deleteDoc, updateDoc, onSnapshot, increment, runTransaction, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../firebase';

export const eventService = {
  createEvent: async (eventData: any) => {
    try {
      const eventToSave = {
        ...eventData,
        price: Number(eventData.price) || 0,
        totalTickets: Number(eventData.totalTickets) || 0,
        availableTickets: Number(eventData.totalTickets) || 0,
        soldTickets: 0,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(eventsCollection, eventToSave);
      return { id: docRef.id, ...eventToSave };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  getEvents: async () => {
    try {
      const snapshot = await getDocs(eventsCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        availableTickets: doc.data().availableTickets || 0,
        soldTickets: doc.data().soldTickets || 0
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  updateTicketCount: async (eventId: string, quantity: number): Promise<void> => {
    const eventRef = doc(db, 'events', eventId);
    
    try {
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error('Event not found');
        }

        const data = eventDoc.data();
        const currentAvailable = data.availableTickets || 0;
        const currentSold = data.soldTickets || 0;
        const totalTickets = data.totalTickets || 0;

        // Calculate new values
        const newAvailable = currentAvailable - quantity;
        const newSold = currentSold + quantity;

        // Validate the update
        if (newAvailable < 0 || newSold > totalTickets) {
          throw new Error('Invalid ticket count update');
        }

        // Update with all required fields preserved
        transaction.update(eventRef, {
          ...data,
          availableTickets: newAvailable,
          soldTickets: newSold,
          lastUpdated: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('Error updating ticket count:', error);
      throw error;
    }
  },

  updateTicketCountBulk: async (eventId: string, count: number): Promise<void> => {
    const eventRef = doc(db, 'events', eventId);
    
    await runTransaction(db, async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists()) {
        throw new Error('Event does not exist!');
      }

      const data = eventDoc.data();
      const currentAvailable = data.availableTickets ?? data.totalTickets ?? 0;
      const currentSold = data.soldTickets ?? 0;
      
      if (currentAvailable < count) {
        throw new Error(`Only ${currentAvailable} tickets available`);
      }

      // Update counts in one transaction
      transaction.update(eventRef, {
        availableTickets: currentAvailable - count,
        soldTickets: currentSold + count,
        lastUpdated: serverTimestamp()
      });
    });
  },

  checkTicketAvailability: async (eventId: string, requestedQuantity: number): Promise<boolean> => {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      throw new Error('Event does not exist');
    }

    const data = eventDoc.data();
    const availableTickets = data.availableTickets ?? data.totalTickets ?? 0;
    return availableTickets >= requestedQuantity;
  },

  subscribeToTicketCount: (eventId: string, callback: (availableCount: number, soldCount: number) => void): () => void => {
    const eventRef = doc(db, 'events', eventId);
    
    return onSnapshot(eventRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.availableTickets || 0, data.soldTickets || 0);
      }
    });
  },

  lockTickets: async (eventId: string, quantity: number): Promise<void> => {
    const eventRef = doc(db, 'events', eventId);
    
    try {
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error('Event not found');
        }

        const data = eventDoc.data();
        const currentAvailable = data.availableTickets || 0;
        const currentSold = data.soldTickets || 0;
        const totalTickets = data.totalTickets || 0;
        
        // Validate ticket availability
        if (currentAvailable < quantity) {
          throw new Error(`Only ${currentAvailable} tickets available`);
        }

        // Calculate new values
        const newAvailable = currentAvailable - quantity;
        const newSold = currentSold + quantity;

        // Validate new values
        if (newAvailable < 0 || newSold > totalTickets) {
          throw new Error('Invalid ticket count update');
        }

        // Update with all required fields preserved
        transaction.update(eventRef, {
          ...data,  // Keep all existing fields
          availableTickets: newAvailable,
          soldTickets: newSold,
          lastUpdated: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('Error in lockTickets:', error);
      throw error;
    }
  }
};
