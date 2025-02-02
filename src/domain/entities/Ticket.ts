export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketNumber: string;
  verificationCode: string;
  transactionId: string;
  paymentMode: string;
  amountPaid: number;
  quantity: number;
  validationsRemaining: number;
  usedCount: number;
  status: 'valid' | 'partially_used' | 'used' | 'cancelled';
  purchasedAt: string;
  lastValidatedAt?: string;
  validations: {
    timestamp: string;
    validatedBy?: string;
    count: number;
  }[];
  validationSummary?: {
    total: number;
    used: number;
    remaining: number;
    lastUpdated: string;
  };
  eventDetails: {
    title: string;
    date: string;
    location: string;
    imageUrl?: string;
  };
  qrCode?: string;
}
