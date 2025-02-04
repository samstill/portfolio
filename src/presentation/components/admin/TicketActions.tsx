import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { ticketService } from '../../../firebase/services/ticketService';
import { Ticket } from '../../../domain/entities/Ticket';

const TicketFooterWrapper = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-left: 35px;
  margin-top: 15px;

  @media (max-width: 768px) {
    margin-left: 15px;
    margin-top: 12px;
  }
`;

const ActionButton = styled(motion.button)<{ $variant: 'verify' | 'cancel' }>`
  padding: 8px 16px;
  background: ${props => props.$variant === 'verify' ? 
    'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.$variant === 'verify' ? '#4CAF50' : '#F44336'};
  border: 1px solid ${props => props.$variant === 'verify' ? '#4CAF50' : '#F44336'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.$variant === 'verify' ? 
      'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
  }
`;

interface TicketActionsProps {
  ticket: Ticket;
  onUpdate: (updatedTicket: Partial<Ticket>) => void;
}

const TicketActions: React.FC<TicketActionsProps> = ({ ticket, onUpdate }) => {
  const handleValidateAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!ticket.id) {
        toast.error('Invalid ticket');
        return;
      }
      if (ticket.status !== 'valid') {
        toast.error('Ticket is already used or cancelled');
        return;
      }

      // Validate all remaining tickets at once
      const result = await ticketService.validateTicket(ticket.id, ticket.validationsRemaining);
      
      if (result.success) {
        onUpdate({
          status: result.status,
          validationsRemaining: result.validationsRemaining,
          usedCount: result.usedCount
        });
        toast.success(result.message);
      } else {
        toast.error('Failed to validate tickets');
      }
    } catch (err: any) {
      console.error('Validation error:', err);
      toast.error(err.message || 'Failed to validate tickets');
    }
  };

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await ticketService.cancelTicket(ticket.id);
      onUpdate({ status: 'cancelled' });
      toast.success('Ticket cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel ticket');
    }
  };

  if (ticket.status !== 'valid') {
    return null;
  }

  return (
    <TicketFooterWrapper>
      <ActionsContainer>
        <ActionButton
          $variant="verify"
          onClick={handleValidateAll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiCheck size={16} />
          Validate All ({ticket.validationsRemaining})
        </ActionButton>
        <ActionButton
          $variant="cancel"
          onClick={handleCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiX size={16} />
          Cancel
        </ActionButton>
      </ActionsContainer>
    </TicketFooterWrapper>
  );
};

export default TicketActions; 