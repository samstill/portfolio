import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import BackButton from '../components/BackButton';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled(motion.div)`
  max-width: 500px;
  width: 100%;
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  color: ${props => props.theme.text};
`;

const IconWrapper = styled(motion.div)`
  font-size: 64px;
  color: #f44336;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;

  svg {
    filter: drop-shadow(0 0 10px rgba(244, 67, 54, 0.5));
  }
`;

const Title = styled(motion.h1)`
  font-size: 2rem;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Message = styled(motion.p)`
  margin-bottom: 32px;
  opacity: 0.8;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Button = styled(motion.button)`
  padding: 12px 32px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

const UnauthorizedScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <BackButton />
      <Card
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <IconWrapper variants={itemVariants}>
          <FiAlertTriangle />
        </IconWrapper>
        
        <Title variants={itemVariants}>
          Unauthorized Access
        </Title>
        
        <Message variants={itemVariants}>
          You don't have permission to access this resource. 
          Please make sure you have the necessary permissions.
        </Message>
        
        <Button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          <FiArrowLeft />
          Return to Home
        </Button>
      </Card>
    </Container>
  );
};

export default UnauthorizedScreen;