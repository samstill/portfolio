import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, runTransaction, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';
import { Ticket } from '../../domain/entities/Ticket';
import { generateQR } from '../../shared/utils/qrcode';
import { eventService } from './eventService';
import { useAuth } from '../../shared/context/AuthContext';
import logger from '../../shared/utils/logger';

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

      // Create initial ticket data
      const initialTicketData = {
        ...ticketData,
        status: 'valid',
        validationsRemaining: ticketData.quantity,
        usedCount: 0,
        validations: [],
        purchasedAt: new Date().toISOString()
      };

      // Create the ticket document
      const ticketRef = await addDoc(collection(db, 'tickets'), initialTicketData);
      
      // Generate QR code with ticket details
      const qrCodeData = {
        ticketId: ticketRef.id,
        eventId: ticketData.eventId,
        eventDetails: {
          title: ticketData.eventDetails.title,
          date: ticketData.eventDetails.date,
          location: ticketData.eventDetails.location
        },
        ticketNumber: ticketData.ticketNumber,
        quantity: ticketData.quantity,
        validationsRemaining: ticketData.quantity,
        verificationCode: ticketData.verificationCode,
        purchasedAt: initialTicketData.purchasedAt,
        status: 'valid'
      };
      
      // Generate and verify QR code
      const qrCode = await generateQR(JSON.stringify(qrCodeData));
      if (!qrCode) {
        throw new Error('Failed to generate QR code');
      }
      
      // Update ticket with QR code
      await updateDoc(ticketRef, { qrCode });

      // Update event ticket count
      await eventService.updateTicketCount(ticketData.eventId, ticketData.quantity);
      
      // Return complete ticket data
      return {
        id: ticketRef.id,
        ...initialTicketData,
        qrCode
      };
    } catch (error) {
      logger.error('Error creating ticket:', error);
      throw error;
    }
  },

  getTicket: async (ticketId: string): Promise<Ticket | null> => {
    try {
      const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
      if (!ticketDoc.exists()) return null;
      return transformTicketData(ticketDoc.id, ticketDoc.data());
    } catch (error) {
      logger.error('Error getting ticket:', error);
      return null;
    }
  },

  // Alias for getTicket to maintain API consistency
  getTicketById: async (ticketId: string): Promise<Ticket | null> => {
    return ticketService.getTicket(ticketId);
  },

  async getTicketsByUserId(userId: string): Promise<Ticket[]> {
    try {
      const q = query(collection(db, 'tickets'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Ticket));
    } catch (error) {
      logger.error('Error fetching user tickets:', error);
      throw new Error('Failed to fetch user tickets');
    }
  },

  async validateTicket(ticketId: string): Promise<ValidationResult> {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }

      const data = ticketDoc.data();
      const validationsRemaining = data.quantity - data.usedCount;
      const usedCount = data.usedCount || 0;

      if (validationsRemaining <= 0 || data.status !== 'valid') {
        throw new Error('Ticket is no longer valid');
      }

      await updateDoc(ticketRef, {
        usedCount: usedCount + 1,
        status: validationsRemaining === 1 ? 'used' : 'valid',
        lastValidatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Ticket validated successfully',
        validationsRemaining: validationsRemaining - 1
      };
    } catch (error) {
      throw new Error('Failed to validate ticket');
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
      logger.error('Error getting validation history:', error);
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
    const unsubscribe = onSnapshot(
      doc(db, 'tickets', ticketId),
      (doc) => {
        if (doc.exists()) {
          const transformedTicket = this.transformTicketData(doc.id, doc.data());
          callback(transformedTicket);
        }
      },
      (error) => {
        throw new Error('Failed to subscribe to ticket updates');
      }
    );
    return unsubscribe;
  },

  transformTicketData(id: string, data: any): Ticket {
    if (!data) throw new Error('Invalid ticket data');

    const transformedTicket: Ticket = {
      id,
      eventId: data.eventId,
      userId: data.userId,
      userEmail: data.userEmail,
      eventDetails: data.eventDetails,
      ticketNumber: data.ticketNumber,
      quantity: data.quantity || 0,
      validationsRemaining: data.validationsRemaining || 0,
      usedCount: data.usedCount || 0,
      status: data.status || 'valid',
      purchasedAt: data.purchasedAt?.toDate?.() || data.purchasedAt,
      lastValidatedAt: data.lastValidatedAt?.toDate?.() || data.lastValidatedAt,
      amountPaid: data.amountPaid,
      paymentMode: data.paymentMode,
      transactionId: data.transactionId,
      qrCode: data.qrCode || null,
      validations: data.validations || [],
      verificationCode: data.verificationCode
    };

    return transformedTicket;
  },

  async searchTickets(searchText: string): Promise<Ticket[]> {
    try {
      const ticketsRef = collection(db, 'tickets');
      const q = query(
        ticketsRef,
        where('userEmail', '>=', searchText),
        where('userEmail', '<=', searchText + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
    } catch (error) {
      console.error('Error searching tickets:', error);
      return [];
    }
  },
};
