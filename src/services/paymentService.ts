import { db } from '../firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface RefundData {
  paymentId: string;
  amount: number;
  reason: string;
  eventId: string;
  userId: string;
}

export const paymentService = {
  async initiateRefund(data: RefundData) {
    try {
      // Create a unique refund document ID
      const refundRef = doc(collection(db, 'refunds'));
      
      // First create the refund record
      await setDoc(refundRef, {
        ...data,
        refundId: refundRef.id,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      try {
        // Call your backend API to process the refund
        const response = await fetch('/api/refund', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: data.paymentId,
            amount: data.amount,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process refund');
        }

        // Update refund status to completed
        await setDoc(refundRef, {
          status: 'completed',
          completedAt: serverTimestamp(),
        }, { merge: true });

        toast.success('Refund initiated successfully');
        return true;
      } catch (apiError) {
        // If API call fails, update status to failed
        await setDoc(refundRef, {
          status: 'failed',
          error: apiError.message,
          failedAt: serverTimestamp(),
        }, { merge: true });
        
        throw apiError;
      }
    } catch (error) {
      console.error('Refund error:', error);
      // Create a failed refund record if initial creation fails
      try {
        const failedRefundRef = doc(collection(db, 'failed_refunds'));
        await setDoc(failedRefundRef, {
          ...data,
          error: error.message,
          createdAt: serverTimestamp(),
        });
      } catch (recordError) {
        console.error('Failed to record failed refund:', recordError);
      }
      throw error;
    }
  }
}; 