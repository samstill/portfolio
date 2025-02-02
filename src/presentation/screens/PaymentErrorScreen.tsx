import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft, FiRefreshCcw } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};
`;

const ErrorCard = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const ErrorIcon = styled(FiAlertTriangle)`
  color: #ef4444;
  font-size: 64px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2rem;
  margin-bottom: 15px;
`;

const Message = styled.p`
  color: ${props => props.theme.text}CC;
  margin-bottom: 25px;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const ErrorDetails = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  text-align: left;
  color: ${props => props.theme.text}CC;

  p {
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  background: ${props => props.$variant === 'primary' 
    ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
    : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
`;

const PaymentErrorScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, paymentId, eventId } = location.state || {};

  const handleRetry = () => {
    navigate(`/events/${eventId}/book`);
  };

  return (
    <Container>
      <ErrorCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorIcon />
        <Title>Payment Failed</Title>
        <Message>
          {error?.message || 'We encountered an issue while processing your payment. Your money is safe and will be refunded if deducted.'}
        </Message>

        <ErrorDetails>
          {paymentId && (
            <p>Payment Reference: {paymentId}</p>
          )}
          <p>Status: Failed</p>
          {error?.code && (
            <p>Error Code: {error.code}</p>
          )}
          <p>
            If any amount was deducted, it will be automatically refunded within 5-7 business days.
          </p>
        </ErrorDetails>

        <ButtonGroup>
          <Button
            $variant="primary"
            onClick={handleRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCcw />
            Try Again
          </Button>
          <Button
            onClick={() => navigate(`/events/${eventId}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft />
            Back to Event
          </Button>
        </ButtonGroup>
      </ErrorCard>
    </Container>
  );
};

export default PaymentErrorScreen; 