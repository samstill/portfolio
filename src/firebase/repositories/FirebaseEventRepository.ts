export class FirebaseEventRepository implements EventRepository {
  // ... existing code ...

  subscribeToAvailableTickets(eventId: string, callback: (count: number) => void): () => void {
    const eventRef = doc(db, 'events', eventId);
    
    return onSnapshot(eventRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Use availableTickets directly instead of totalTickets
        callback(data.availableTickets || 0);
      }
    });
  }

  async getEvent(id: string): Promise<Event> {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Event not found');
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      availableTickets: data.availableTickets || 0,
      soldTickets: data.soldTickets || 0
    } as Event;
  }

  async getEvents(): Promise<Event[]> {
    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(eventsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      availableTickets: doc.data().availableTickets || 0,
      soldTickets: doc.data().soldTickets || 0
    } as Event));
  }
} 