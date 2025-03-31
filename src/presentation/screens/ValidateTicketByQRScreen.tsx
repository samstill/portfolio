import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../firebase/services/ticketService';
import BackButton from '../components/BackButton';
import QRScanner from '../components/QRScanner';
import { pageTransition } from '../../shared/animations';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};
`;

const Card = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  color: ${props => props.theme.text};
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 30px;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const ValidateTicketByQRScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = useCallback(async (data: string | null) => {
    if (!data || isProcessing) return;

    try {
      setIsProcessing(true);
      toast.loading('Scanning ticket...', { id: 'scanning' });
      console.log('QR data received:', data);

      // Parse QR data
      let qrData;
      let ticketId;
      
      try {
        // Try parsing as JSON (our preferred format)
        qrData = JSON.parse(data);
        console.log('Parsed QR data:', qrData);
        
        // Check if we have our optimized format
        if (qrData.t) {
          ticketId = qrData.t;
          console.log('Found ticket ID in optimized format:', ticketId);
        } else if (qrData.ticketId) {
          // Legacy format
          ticketId = qrData.ticketId;
          console.log('Found ticket ID in legacy format:', ticketId);
        }
      } catch (e) {
        // Fallback: try treating the entire data as a ticket ID
        console.log('JSON parse failed, trying as direct ID');
        ticketId = data;
      }

      if (!ticketId) {
        throw new Error('No valid ticket ID in QR code');
      }

      console.log('Fetching ticket:', ticketId);
      const ticket = await ticketService.getTicket(ticketId);
      
      if (!ticket) {
        toast.error('Ticket not found in database');
        return;
      }

      // Verification code validation (if available)
      if (qrData && qrData.v && ticket.verificationCode !== qrData.v) {
        throw new Error('Invalid verification code');
      }
      
      // Navigate to validation page
      console.log('Navigating to validation screen with ticket:', ticket.id);
      navigate(`/admin/tickets/${ticketId}/validate`, {
        state: { initialTicket: ticket }
      });

    } catch (error) {
      console.error('Scan error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid ticket');
    } finally {
      setIsProcessing(false);
      toast.dismiss('scanning');
    }
  }, [navigate, isProcessing]);

  const handleError = useCallback((error: string) => {
    if (!error.includes('No QR code found')) {
      console.error('Scanner error:', error);
      toast.error('Camera error. Please check permissions and try again.');
    }
  }, []);

  return (
    <Container>
      <BackButton />
      <Card
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Title>Scan Ticket QR Code</Title>
        <Description>
          Position the QR code within the frame to validate the ticket.
        </Description>

        <QRScanner
          onScan={handleScan}
          onError={handleError}
          isOpen={true}
          facingMode="environment"
        />
      </Card>
    </Container>
  );
};

export default ValidateTicketByQRScreen;
