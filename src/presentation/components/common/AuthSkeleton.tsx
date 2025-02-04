import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`;

const Card = styled(motion.div)`
  max-width: 400px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 25px;
  }
`;

const SkeletonLine = styled.div<{ width?: string; height?: string; margin?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  margin: ${({ margin }) => margin || '10px 0'};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: ${shimmer} 2s infinite linear;
  }
`;

const SkeletonButton = styled.div`
  width: 100%;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin-top: 25px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: ${shimmer} 2s infinite linear;
  }
`;

const LoadingText = styled(motion.div)`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

interface AuthSkeletonProps {
  text?: string;
}

const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const AuthSkeleton: React.FC<AuthSkeletonProps> = ({ text = "Loading..." }) => {
  return (
    <Container>
      <Card {...pageTransition}>
        <SkeletonLine width="70%" height="32px" margin="0 0 30px 0" />
        <SkeletonLine width="100%" height="20px" margin="0 0 8px 0" />
        <SkeletonLine width="90%" height="45px" margin="0 0 20px 0" />
        <SkeletonLine width="100%" height="20px" margin="0 0 8px 0" />
        <SkeletonLine width="90%" height="45px" margin="0 0 20px 0" />
        <SkeletonButton />
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </LoadingText>
      </Card>
    </Container>
  );
};

export default AuthSkeleton; 