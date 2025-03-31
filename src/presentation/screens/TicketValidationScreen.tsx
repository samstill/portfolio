import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);

  .ticket-info {
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    margin: 1.5rem 0;

    p {
      margin: 0.8rem 0;
      font-size: 1.1rem;
    }
  }

  .validate-button {
    background: #4a6cf7;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const TicketValidationScreen: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(location.state?.initialTicket || null);
  const [loading, setLoading] = useState(!location.state?.initialTicket);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        if (ticketId && !ticket) {
          setLoading(true);
          const data = await ticketService.getTicket(ticketId);
          if (!data) {
            throw new Error('Ticket not found');
          }
          setTicket(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Load error:', error);
        setLoading(false);
      }
    };

    if (!ticket) loadTicket();
  }, [ticketId, ticket]);

  const handleValidation = async () => {
    try {
      if (!ticket) return;
      
      if (ticket.validationsRemaining <= 0) {
        throw new Error('No validations remaining');
      }

      await ticketService.validateTicket(ticket.id);
      const updatedTicket = await ticketService.getTicket(ticket.id);
      
      if (!updatedTicket) throw new Error('Ticket update failed');
      
      setTicket(updatedTicket);
      toast.success(`Validated! Remaining: ${updatedTicket.validationsRemaining}`);
      
      if (updatedTicket.validationsRemaining <= 0) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error(error instanceof Error ? error.message : 'Validation failed');
    }
  };

  if (loading) return <div>Loading ticket data...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <Container>
      <h1>Validate Ticket: {ticket.eventDetails.title}</h1>
      <div className="ticket-info">
        <p>Ticket ID: {ticket.id}</p>
        <p>Validations Remaining: {ticket.validationsRemaining}</p>
        <p>Status: {ticket.status}</p>
      </div>
      <button 
        onClick={handleValidation}
        disabled={!ticket || ticket.validationsRemaining <= 0}
        className="validate-button"
      >
        Confirm Validation ({ticket?.validationsRemaining} remaining)
      </button>
    </Container>
  );
};

export default TicketValidationScreen; 