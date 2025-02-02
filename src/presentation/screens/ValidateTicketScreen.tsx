import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';
import BackButton from '../components/BackButton';
import { FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
`;

const ValidationCard = styled.div`
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  color: ${props => props.theme.text};
`;

const TicketInfo = styled.div`
  margin: 20px 0;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  p {
    margin: 8px 0;
    color: ${props => props.theme.textSecondary};
  }
`;

const ValidationButton = styled.button<{ $status?: string }>`
  width: 100%;
  padding: 15px;
  background: ${props => 
    props.$status === 'used' ? 'rgba(255, 71, 87, 0.2)' :
    props.$status === 'partially_used' ? 'rgba(255, 165, 0, 0.2)' :
    'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: ${props => props.$status === 'used' ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  opacity: ${props => props.$status === 'used' ? 0.7 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
`;

const ValidationCount = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-align: center;

  h3 {
    margin-bottom: 10px;
  }

  .count-input {
    width: 100px;
    padding: 8px;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    margin: 0 10px;
  }
`;

const ValidateTicketScreen: React.FC = () => {
  const { ticketId = '' } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [validationCount, setValidationCount] = useState(1);

  useEffect(() => {
    if (!ticketId) return;

    // Subscribe to real-time updates
    const unsubscribe = ticketService.subscribeToTicketUpdates(ticketId, (updatedTicket) => {
      setTicket(updatedTicket);
    });

    return () => unsubscribe();
  }, [ticketId]);

  const handleValidate = async () => {
    if (!ticketId || !ticket || !currentUser) return;
    
    if (validationCount > ticket.validationsRemaining) {
      toast.error(`Only ${ticket.validationsRemaining} validations remaining`);
      return;
    }
    
    setIsValidating(true);
    try {
      await ticketService.validateTicket(ticketId, validationCount, currentUser.uid);
      toast.success(`Successfully validated ${validationCount} ticket(s)`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to validate ticket');
    } finally {
      setIsValidating(false);
    }
  };

  if (!ticket) {
    return (
      <Container>
        <BackButton />
        <ValidationCard>
          <h2>Loading ticket...</h2>
        </ValidationCard>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton />
      <ValidationCard>
        <TicketInfo>
          <h2>{ticket.eventDetails.title}</h2>
          <p>Ticket #: {ticket.ticketNumber}</p>
          <p>Total Tickets: {ticket.quantity}</p>
          <p>Validations Remaining: {ticket.validationsRemaining}</p>
          <p>Status: {ticket.status.replace('_', ' ')}</p>
        </TicketInfo>

        <ValidationCount>
          <h3>Number of Tickets to Validate</h3>
          <input
            type="number"
            className="count-input"
            value={validationCount}
            onChange={(e) => setValidationCount(Math.max(1, Math.min(ticket.validationsRemaining, parseInt(e.target.value) || 1)))}
            min={1}
            max={ticket.validationsRemaining}
            disabled={ticket.status === 'used'}
          />
        </ValidationCount>

        <ValidationButton
          onClick={handleValidate}
          disabled={isValidating || ticket.status === 'used'}
          $status={ticket.status}
        >
          {isValidating ? (
            'Validating...'
          ) : ticket.status === 'used' ? (
            <>
              <FiX size={18} />
              Ticket Already Used
            </>
          ) : (
            <>
              <FiCheck size={18} />
              Validate {validationCount} Ticket{validationCount > 1 ? 's' : ''}
            </>
          )}
        </ValidationButton>
      </ValidationCard>
    </Container>
  );
};

export default ValidateTicketScreen;
