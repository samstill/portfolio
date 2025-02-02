import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, runTransaction, onSnapshot } from 'firebase/firestore';
import { db } from '../config';
import { Ticket } from '../../domain/entities/Ticket';
import { generateQR } from '../../shared/utils/qrcode';
import { eventService } from './eventService';
import { useAuth } from '../../shared/context/AuthContext';

export const ticketService = {
  async createTicket(ticketData: Omit<Ticket, 'id' | 'qrCode' | 'validationsRemaining' | 'validations'>): Promise<Ticket> {
    try {
      // First check ticket availability
      const eventRef = doc(db, 'events', ticketData.eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data();
      if ((eventData.availableTickets || 0) < ticketData.quantity) {
        throw new Error(`Only ${eventData.availableTickets} tickets available`);
      }

      // Create the ticket document with multiple validations support
      const ticketRef = await addDoc(collection(db, 'tickets'), {
        ...ticketData,
        status: 'valid',
        validationsRemaining: ticketData.quantity, // Set initial validations
        validations: [], // Initialize empty validations array
        purchasedAt: new Date().toISOString()
      });
      
      // Generate QR code with ticket details
      const qrCodeData = {
        ticketId: ticketRef.id,
        eventId: ticketData.eventId,
        quantity: ticketData.quantity,
        verificationCode: ticketData.verificationCode
      };
      
      const qrCode = await generateQR(JSON.stringify(qrCodeData));
      
      // Update ticket with QR code
      await updateDoc(ticketRef, { qrCode });

      // Update event ticket count
      await eventService.updateTicketCount(ticketData.eventId, ticketData.quantity);
      
      return {
        id: ticketRef.id,
        qrCode,
        validationsRemaining: ticketData.quantity,
        validations: [],
        ...ticketData
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async getTicket(ticketId: string): Promise<Ticket | null> {
    try {
      console.log('Fetching ticket:', ticketId); // Debug log
      const docRef = doc(db, 'tickets', ticketId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.log('No ticket found'); // Debug log
        return null;
      }

      const data = docSnap.data();
      console.log('Ticket data:', data); // Debug log

      return {
        id: docSnap.id,
        ...data,
        validationsRemaining: data.validationsRemaining || data.quantity,
        validations: data.validations || [],
        status: data.status || 'valid',
        eventDetails: {
          title: data.eventDetails?.title || '',
          date: data.eventDetails?.date || '',
          location: data.eventDetails?.location || '',
          imageUrl: data.eventDetails?.imageUrl
        }
      } as Ticket;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  async getUserTickets(userId: string): Promise<Ticket[]> {
    const q = query(collection(db, 'tickets'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Ticket));
  },

  async validateTicket(ticketId: string, validationCount: number = 1, validatedBy?: string): Promise<boolean> {
    const ticketRef = doc(db, 'tickets', ticketId);
    
    try {
      await runTransaction(db, async (transaction) => {
        const ticketDoc = await transaction.get(ticketRef);
        if (!ticketDoc.exists()) {
          throw new Error('Ticket not found');
        }

        const ticketData = ticketDoc.data();
        
        // Validation checks
        if (ticketData.status === 'cancelled') {
          throw new Error('Ticket has been cancelled');
        }
        if (ticketData.status === 'used') {
          throw new Error('Ticket has already been fully used');
        }
        if (ticketData.validationsRemaining < validationCount) {
          throw new Error(`Cannot validate ${validationCount} tickets. Only ${ticketData.validationsRemaining} validations remaining.`);
        }

        // Create a single validation entry for the batch
        const newValidation = {
          timestamp: new Date().toISOString(),
          validatedBy: validatedBy || null,
          count: validationCount,
          batchId: `batch-${Date.now()}`
        };

        const newValidationsRemaining = ticketData.validationsRemaining - validationCount;
        const currentUsedCount = ticketData.usedCount || 0;
        const newUsedCount = currentUsedCount + validationCount;

        // Validate total counts
        if (newUsedCount > ticketData.quantity) {
          throw new Error(`Cannot validate ${validationCount} tickets. Would exceed total quantity of ${ticketData.quantity}`);
        }

        // Determine new status
        let newStatus: 'valid' | 'partially_used' | 'used';
        if (newValidationsRemaining === 0) {
          newStatus = 'used';
        } else if (newUsedCount > 0) {
          newStatus = 'partially_used';
        } else {
          newStatus = 'valid';
        }

        console.log('Batch Validation Details:', {
          ticketId,
          validationCount,
          currentValidationsRemaining: ticketData.validationsRemaining,
          newValidationsRemaining,
          currentUsedCount,
          newUsedCount,
          newStatus,
          batchId: newValidation.batchId
        });

        // Ensure all fields have non-undefined values
        const validationSummary = {
          total: ticketData.quantity,
          used: newUsedCount,
          remaining: newValidationsRemaining,
          lastUpdated: new Date().toISOString(),
          lastBatchValidation: {
            count: validationCount,
            timestamp: new Date().toISOString(),
            batchId: newValidation.batchId
          }
        };

        // Create update object with only defined values
        const updateData = {
          validationsRemaining: newValidationsRemaining,
          status: newStatus,
          validations: [...(ticketData.validations || []), newValidation],
          usedCount: newUsedCount,
          lastValidatedAt: new Date().toISOString(),
          validationSummary
        };

        // Verify no undefined values
        Object.entries(updateData).forEach(([key, value]) => {
          if (value === undefined) {
            console.error(`Found undefined value for key: ${key}`);
            throw new Error(`Invalid data: ${key} is undefined`);
          }
        });

        transaction.update(ticketRef, updateData);
      });

      return true;
    } catch (error) {
      console.error('Error in batch ticket validation:', error);
      throw error;
    }
  },

  async getValidationHistory(ticketId: string): Promise<Ticket['validations']> {
    try {
      const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }
      return ticketDoc.data().validations || [];
    } catch (error) {
      console.error('Error getting validation history:', error);
      throw error;
    }
  },

  async getAllTickets(): Promise<Ticket[]> {
    const querySnapshot = await getDocs(collection(db, 'tickets'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Ticket));
  },

  async cancelTicket(ticketId: string): Promise<void> {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });
  },

  subscribeToTicketUpdates(ticketId: string, callback: (ticket: Ticket) => void) {
    const ticketRef = doc(db, 'tickets', ticketId);
    return onSnapshot(ticketRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const validationsRemaining = data.validationsRemaining ?? data.quantity;
        
        // Calculate usedCount based on status and stored value
        let usedCount: number;
        if (data.status === 'used') {
          // If ticket is used, all tickets are considered used
          usedCount = data.quantity;
        } else {
          // Otherwise use stored value or calculate from remaining
          usedCount = data.usedCount ?? (data.quantity - validationsRemaining);
        }
        
        console.log('Raw ticket data:', data);
        console.log('Firebase status:', data.status);
        console.log('Validations remaining:', validationsRemaining);
        console.log('Used count:', usedCount);
        console.log('Total quantity:', data.quantity);
        
        const transformedTicket = {
          id: doc.id,
          ...data,
          validationsRemaining: data.status === 'used' ? 0 : validationsRemaining,
          validations: data.validations || [],
          status: data.status || 'valid',
          usedCount,
          validationSummary: {
            total: data.quantity,
            used: usedCount,
            remaining: data.status === 'used' ? 0 : validationsRemaining,
            lastUpdated: data.lastValidatedAt || data.purchasedAt
          },
          eventDetails: {
            title: data.eventDetails?.title || '',
            date: data.eventDetails?.date || '',
            location: data.eventDetails?.location || '',
            imageUrl: data.eventDetails?.imageUrl
          }
        } as Ticket;

        console.log('Transformed ticket:', transformedTicket);
        callback(transformedTicket);
      }
    },
    (error) => {
      console.error('Error in ticket subscription:', error);
    });
  }
};
