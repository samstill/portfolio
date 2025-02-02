import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMinus, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';

const ValidationContainer = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 20px 0;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`;

const QuantityButton = styled(motion.button)`
  background: rgba(74, 108, 247, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
`;

const ValidationSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  
  .label {
    color: ${props => props.theme.textSecondary};
  }
  
  .value {
    font-weight: bold;
  }
`;

const ValidateButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ValidationProps {
  ticket: Ticket;
  onValidationComplete: () => void;
}

const TicketValidation: React.FC<ValidationProps> = ({ ticket, onValidationComplete }) => {
  const [validationCount, setValidationCount] = useState(1);
  const [isValidating, setIsValidating] = useState(false);

  const handleIncrement = () => {
    if (validationCount < ticket.validationsRemaining) {
      setValidationCount(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (validationCount > 1) {
      setValidationCount(prev => prev - 1);
    }
  };

  const handleValidate = async () => {
    try {
      setIsValidating(true);
      await ticketService.validateTicket(ticket.id, validationCount);
      toast.success(`Successfully validated ${validationCount} ticket${validationCount > 1 ? 's' : ''}`);
      onValidationComplete();
    } catch (error) {
      toast.error(error.message || 'Failed to validate tickets');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <ValidationContainer>
      <h3>Validate Tickets</h3>
      
      <ValidationSummary>
        <SummaryRow>
          <span className="label">Total Tickets</span>
          <span className="value">{ticket.quantity}</span>
        </SummaryRow>
        <SummaryRow>
          <span className="label">Used</span>
          <span className="value">{ticket.usedCount}</span>
        </SummaryRow>
        <SummaryRow>
          <span className="label">Remaining</span>
          <span className="value">{ticket.validationsRemaining}</span>
        </SummaryRow>
      </ValidationSummary>

      <QuantitySelector>
        <QuantityButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={validationCount <= 1 || isValidating}
        >
          <FiMinus />
        </QuantityButton>
        
        <QuantityDisplay>{validationCount}</QuantityDisplay>
        
        <QuantityButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={validationCount >= ticket.validationsRemaining || isValidating}
        >
          <FiPlus />
        </QuantityButton>
      </QuantitySelector>

      <ValidateButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleValidate}
        disabled={isValidating || ticket.validationsRemaining === 0}
      >
        {isValidating ? (
          <>Processing...</>
        ) : (
          <>
            <FiCheck size={18} />
            Validate {validationCount} Ticket{validationCount > 1 ? 's' : ''}
          </>
        )}
      </ValidateButton>

      {ticket.validationSummary?.lastBatchValidation && (
        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
          Last batch: {ticket.validationSummary.lastBatchValidation.count} tickets at{' '}
          {new Date(ticket.validationSummary.lastBatchValidation.timestamp).toLocaleString()}
        </div>
      )}
    </ValidationContainer>
  );
};

export default TicketValidation; 