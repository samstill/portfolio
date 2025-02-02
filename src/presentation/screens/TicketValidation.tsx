import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
`;

const ValidationEntry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ValidationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .timestamp {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
  }
`;

const IndividualValidateButton = styled(motion.button)`
  padding: 6px 12px;
  background: rgba(74, 108, 247, 0.2);
  border: none;
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LastValidation = styled.div`
  margin-top: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  text-align: center;
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
      setValidationCount(1); // Reset count after successful validation
    } catch (error) {
      toast.error(error.message || 'Failed to validate tickets');
    } finally {
      setIsValidating(false);
    }
  };

  const handleIndividualValidation = async () => {
    try {
      setIsValidating(true);
      await ticketService.validateTicket(ticket.id, 1);
      toast.success('Successfully validated 1 ticket');
      onValidationComplete();
    } catch (error) {
      toast.error(error.message || 'Failed to validate ticket');
    } finally {
      setIsValidating(false);
    }
  };

  // Add a function to check if validation is allowed
  const isValidationDisabled = () => {
    return (
      isValidating || 
      ticket.validationsRemaining === 0 || 
      ticket.status === 'used' || 
      ticket.status === 'cancelled'
    );
  };

  // Add a function to get the disable reason
  const getDisableReason = () => {
    if (ticket.status === 'used') return 'Ticket is already used';
    if (ticket.status === 'cancelled') return 'Ticket is cancelled';
    if (ticket.validationsRemaining === 0) return 'No validations remaining';
    return '';
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
          disabled={validationCount <= 1 || isValidating || isValidationDisabled()}
        >
          <FiMinus />
        </QuantityButton>
        
        <QuantityDisplay>{validationCount}</QuantityDisplay>
        
        <QuantityButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={validationCount >= ticket.validationsRemaining || isValidating || isValidationDisabled()}
        >
          <FiPlus />
        </QuantityButton>
      </QuantitySelector>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <ValidateButton
          whileHover={!isValidationDisabled() && { scale: 1.02 }}
          whileTap={!isValidationDisabled() && { scale: 0.98 }}
          onClick={handleValidate}
          disabled={isValidationDisabled()}
          title={getDisableReason()}
          style={{ flex: 2 }}
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

        <IndividualValidateButton
          whileHover={!isValidationDisabled() && { scale: 1.02 }}
          whileTap={!isValidationDisabled() && { scale: 0.98 }}
          onClick={handleIndividualValidation}
          disabled={isValidationDisabled()}
          title={getDisableReason()}
          style={{ flex: 1 }}
        >
          <FiCheck size={16} />
          Single
        </IndividualValidateButton>
      </div>

      {isValidationDisabled() && (
        <div style={{ 
          textAlign: 'center', 
          color: '#ff4757', 
          fontSize: '0.9rem',
          marginTop: '-10px',
          marginBottom: '20px' 
        }}>
          {getDisableReason()}
        </div>
      )}

      <ValidationHistory>
        <h4 style={{ padding: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          Validation History
        </h4>
        {ticket.validations?.map((validation, index) => (
          <ValidationEntry key={index}>
            <ValidationInfo>
              <div>{validation.count} ticket{validation.count > 1 ? 's' : ''} validated</div>
              <div className="timestamp">
                {new Date(validation.timestamp).toLocaleString()}
              </div>
            </ValidationInfo>
            {validation.validatedBy && (
              <div className="validator">By: {validation.validatedBy}</div>
            )}
          </ValidationEntry>
        ))}
        {(!ticket.validations || ticket.validations.length === 0) && (
          <div style={{ padding: '15px', textAlign: 'center', color: props => props.theme.textSecondary }}>
            No validations yet
          </div>
        )}
      </ValidationHistory>

      {ticket.validationSummary?.lastBatchValidation && (
        <LastValidation>
          Last batch: {ticket.validationSummary.lastBatchValidation.count} tickets at{' '}
          {new Date(ticket.validationSummary.lastBatchValidation.timestamp).toLocaleString()}
        </LastValidation>
      )}
    </ValidationContainer>
  );
};

export default TicketValidation; 