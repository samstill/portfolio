export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  userEmail: string;
  eventDetails: {
    title: string;
    date: string;
    location: string;
  };
  ticketNumber: string;
  quantity: number;
  validationsRemaining: number;
  usedCount: number;
  status: 'valid' | 'used' | 'cancelled';
  purchasedAt: string;
  lastValidatedAt?: string;
  cancelledAt?: string;
  amountPaid: number;
  paymentMode: string;
  transactionId: string;
  qrCode: string;
  validations: {
    timestamp: string;
    validatedBy: string;
  }[];
  verificationCode: string;
}

export type TicketStatus = Ticket['status']; 