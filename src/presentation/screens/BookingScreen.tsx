import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import { Event } from '../../domain/entities/Event';
import { FirebaseEventRepository } from '../../data/repositories/FirebaseEventRepository';
import { useAuth } from '../../shared/context/AuthContext';
import { toast } from 'react-hot-toast';
import { BookingSkeleton } from '../components/common/BookingSkeleton';
import { ticketService } from '../../firebase/services/ticketService';
import { eventService } from '../../firebase/services/eventService';
import { loadRazorpayScript, initializeRazorpayPayment } from '../../services/razorpayService';
import { paymentService } from '../../services/paymentService';
import { doc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};

  @media (max-width: 768px) {
    padding: 60px 15px;
  }
`;

const BookingCard = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  text-align: center;
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 20px;
  margin: 30px 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PaymentOption = styled(motion.button)<{ $selected?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: ${props => props.$selected 
    ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
    : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  svg {
    font-size: 24px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const PriceInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;

  .price-row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    color: ${props => props.theme.text};
  }

  .total {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 10px;
    padding-top: 10px;
    font-weight: bold;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

type PaymentMethod = 'CARD' | 'UPI';

const generateTicketNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TKT-${timestamp}-${random}`;
};

const generateVerificationCode = () => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TXN-${timestamp}-${random}`;
};

const createTicketData = (event: Event, currentUser: any, transactionId: string, paymentMethod: string) => {
  // Create event details without imageUrl first
  const eventDetails = {
    title: event.title,
    date: event.date,
    location: event.location,
  };

  // Only add imageUrl if it exists and is not undefined
  if (event.imageUrl) {
    Object.assign(eventDetails, { imageUrl: event.imageUrl });
  }

  return {
    eventId: event.id,
    userId: currentUser.uid,
    ticketNumber: generateTicketNumber(),
    verificationCode: generateVerificationCode(),
    transactionId,
    paymentMode: paymentMethod.toLowerCase(),
    amountPaid: event.price,
    quantity: 1,
    status: 'valid' as const,
    purchasedAt: new Date().toISOString(),
    eventDetails
  };
};

export const BookingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [processing, setProcessing] = useState(false);
  const [availableTickets, setAvailableTickets] = useState(0);
  const [soldTickets, setSoldTickets] = useState(0);
  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const eventRepo = new FirebaseEventRepository();
        const eventData = await eventRepo.getEvent(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event?.id) return;

    const unsubscribe = eventService.subscribeToTicketCount(
      event.id,
      (availableCount, soldCount) => {
        setAvailableTickets(availableCount);
        setSoldTickets(soldCount);
      }
    );

    return () => unsubscribe();
  }, [event?.id]);

  useEffect(() => {
    const loadRazorpay = async () => {
      const isLoaded = await loadRazorpayScript();
      setIsRazorpayLoaded(isLoaded);
    };
    loadRazorpay();
  }, []);

  const handleBooking = async () => {
    if (!event || !currentUser) return;
    
    setProcessing(true);
    
    try {
      // 1. Process payment first
      const paymentResult = await processPayment();
      
      // 2. Create ticket only after successful payment
      const ticketData = {
        eventId: event.id,
        userId: currentUser.uid,
        ticketNumber: generateTicketNumber(),
        verificationCode: generateVerificationCode(),
        transactionId: paymentResult.transactionId,
        paymentMode: paymentMethod,
        amountPaid: event.price * quantity,
        quantity: quantity,
        status: 'valid',
        purchasedAt: new Date().toISOString(),
        eventDetails: {
          title: event.title,
          date: event.date,
          location: event.location,
          // Only include imageUrl if it exists
          ...(event.imageUrl && { imageUrl: event.imageUrl })
        }
      };

      const ticket = await ticketService.createTicket(ticketData);
      
      // Show success message
      toast.success('Ticket booked successfully!');
      
      // 3. Navigate to ticket page on success
      navigate(`/tickets/${ticket.id}`);
      
    } catch (error: any) {
      console.error('Error after payment:', error);
      
      // Record failed transaction
      try {
        await addDoc(collection(db, 'failed_transactions'), {
          userId: currentUser.uid,
          eventId: event.id,
          error: error.message,
          timestamp: serverTimestamp(),
          quantity: quantity,
          amount: event.price * quantity
        });
      } catch (recordError) {
        console.error('Failed to record failed transaction:', recordError);
      }
      
      // Show error message
      toast.error(error.message || 'Payment failed');
      
      // Navigate to error page
      navigate('/payment-error', { 
        state: { 
          error,
          eventId: event.id,
          paymentId: error.paymentId 
        }
      });
    } finally {
      setProcessing(false);
    }
  };

  // Helper function to process payment
  const processPayment = async (): Promise<{ success: boolean; transactionId: string }> => {
    if (!event || !currentUser) {
      throw new Error('Missing event or user data');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: event.price * quantity * 100, // Convert to smallest currency unit
        currency: "INR",
        name: event.title,
        description: `${quantity} ticket(s) for ${event.title}`,
        handler: function(response: any) {
          if (response.razorpay_payment_id) {
            resolve({
              success: true,
              transactionId: response.razorpay_payment_id
            });
          } else {
            reject(new Error('Payment failed'));
          }
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        },
        prefill: {
          name: currentUser.displayName || undefined,
          email: currentUser.email || undefined,
          contact: currentUser.phoneNumber || undefined
        },
        notes: {
          eventId: event.id,
          quantity: quantity,
          userId: currentUser.uid
        },
        theme: {
          color: "#4a6cf7"
        }
      };

      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        reject(error);
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <BookingSkeleton />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <div>Event not found</div>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton
        onClick={() => navigate(`/events/${id}`)}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft size={18} />
        Back to Event
      </BackButton>

      <BookingCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Book Tickets</Title>

        <PaymentOptions>
          <PaymentOption
            $selected={paymentMethod === 'CARD'}
            onClick={() => setPaymentMethod('CARD')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiCreditCard size={24} />
            Card Payment
          </PaymentOption>

          <PaymentOption
            $selected={paymentMethod === 'UPI'}
            onClick={() => setPaymentMethod('UPI')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSmartphone size={24} />
            UPI Payment
          </PaymentOption>
        </PaymentOptions>

        <PriceInfo>
          <div className="price-row">
            <span>Ticket Price</span>
            <span>₹{event.price} × {quantity}</span>
          </div>
          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{event.price * quantity}</span>
          </div>
          <div className="price-row">
            <span>Booking Fee</span>
            <span>₹{Math.round(event.price * quantity * 0.02)}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>₹{event.price * quantity + Math.round(event.price * quantity * 0.02)}</span>
          </div>
        </PriceInfo>

        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBooking}
          disabled={processing || !isRazorpayLoaded || !event || !currentUser || availableTickets < quantity}
        >
          {processing ? 'Processing...' : availableTickets < quantity ? 'Not enough tickets' : 'Proceed to Pay'}
        </Button>
      </BookingCard>
    </Container>
  );
};

export default BookingScreen;
