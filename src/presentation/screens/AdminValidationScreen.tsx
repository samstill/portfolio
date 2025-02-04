import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMinus, FiPlus, FiCheck, FiX, FiClock } from 'react-icons/fi';
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

const ValidationHistory = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  h4 {
    margin: 0 0 15px;
    color: ${props => props.theme.textSecondary};
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const HistoryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }

  .validation-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }

  .count {
    color: ${props => props.theme.primary};
    font-weight: 500;
    white-space: nowrap;
  }

  .timestamp {
    color: ${props => props.theme.textSecondary};
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .validator {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    display: flex;
    align-items: center;
    gap: 5px;
    word-break: break-all;

    .email {
      color: ${props => props.theme.text};
      font-weight: 500;
    }
  }
`;

interface ValidationProps {
  ticket: Ticket;
  onValidationComplete: () => void;
}

const TicketValidation: React.FC<ValidationProps> = ({ ticket, onValidationComplete }) => {
  const [validationCount, setValidationCount] = useState(1);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset validation count when ticket changes
  useEffect(() => {
    setValidationCount(1);
    setError(null);
  }, [ticket.id]);

  const handleIncrement = () => {
    setError(null);
    if (validationCount < ticket.validationsRemaining) {
      setValidationCount(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    setError(null);
    if (validationCount > 1) {
      setValidationCount(prev => prev - 1);
    }
  };

  const handleValidate = async () => {
    setError(null);

    // Validate inputs
    if (!ticket.id) {
      setError('Invalid ticket');
      return;
    }

    if (validationCount > ticket.validationsRemaining) {
      setError(`Cannot validate ${validationCount} tickets. Only ${ticket.validationsRemaining} remaining.`);
      return;
    }

    if (validationCount < 1) {
      setError('Must validate at least 1 ticket');
      return;
    }

    try {
      setIsValidating(true);
      const result = await ticketService.validateTicket(ticket.id, validationCount);
      
      if (result.success) {
        toast.success(result.message);
        // Reset validation count after successful validation
        setValidationCount(1);
        onValidationComplete();
      } else {
        setError('Validation failed');
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      setError(error.message || 'Failed to validate tickets');
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

      {error && (
        <div style={{ 
          color: '#ff4d4d', 
          background: 'rgba(255, 77, 77, 0.1)', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '15px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <QuantitySelector>
        <QuantityButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={validationCount <= 1 || isValidating || ticket.validationsRemaining === 0}
        >
          <FiMinus />
        </QuantityButton>
        
        <QuantityDisplay>{validationCount}</QuantityDisplay>
        
        <QuantityButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={validationCount >= ticket.validationsRemaining || isValidating || ticket.validationsRemaining === 0}
        >
          <FiPlus />
        </QuantityButton>
      </QuantitySelector>

      <ValidateButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleValidate}
        disabled={
          isValidating || 
          ticket.validationsRemaining === 0 || 
          validationCount > ticket.validationsRemaining ||
          validationCount < 1
        }
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

      {ticket.validations && ticket.validations.length > 0 && (
        <ValidationHistory>
          <h4>
            <FiClock size={14} />
            Validation History
          </h4>
          {ticket.validations.map((validation, index) => (
            <HistoryItem key={`${validation.timestamp}_${index}`}>
              <div className="validation-info">
                <span className="count">
                  {validation.count} ticket{validation.count > 1 ? 's' : ''} validated
                </span>
                <span className="timestamp">
                  {new Date(validation.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="validator">
                Validated by: <span className="email">{validation.validatedByEmail}</span>
              </div>
            </HistoryItem>
          ))}
        </ValidationHistory>
      )}
    </ValidationContainer>
  );
};

export default TicketValidation; 