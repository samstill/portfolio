import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};
`;

const FailureCard = styled(motion.div)`
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
  font-size: 48px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 1.8rem;
  margin-bottom: 10px;
`;

const Message = styled.p`
  color: ${props => props.theme.text}CC;
  margin-bottom: 20px;
`;

const Details = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: left;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
`;

const PaymentFailedScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, paymentId, eventId } = location.state || {};

  return (
    <Container>
      <FailureCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorIcon />
        <Title>Payment Failed</Title>
        <Message>
          {error?.message || 'There was an issue processing your payment.'}
        </Message>

        <Details>
          {paymentId && (
            <p>Payment ID: {paymentId}</p>
          )}
          <p>Status: Failed</p>
          {error?.code && (
            <p>Error Code: {error.code}</p>
          )}
        </Details>

        <Button
          onClick={() => navigate(`/events/${eventId}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft />
          Return to Event
        </Button>
      </FailureCard>
    </Container>
  );
};

export default PaymentFailedScreen; 