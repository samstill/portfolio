import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const gradientPulse = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.2),
    0 4px 8px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 200px;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 2s infinite linear;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    background-size: 200% 200%;
    animation: ${gradientPulse} 3s ease infinite;
  }
`;

const Line = styled.div<{ width: string; height?: string; delay: number }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height || '15px'};
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin: 12px 0;
  position: relative;
  overflow: hidden;
  transform-origin: left;
  animation: ${shimmer} 2s infinite linear;
  animation-delay: ${({ delay }) => delay}ms;

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
    animation-delay: ${({ delay }) => delay}ms;
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

const cardVariants = {
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

const textVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.2
    }
  }
};

interface LoadingCardProps {
  text?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ text = "Loading..." }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={cardVariants}
    >
      <Card>
        <Line width="80%" height="24px" delay={0} />
        <Line width="60%" delay={200} />
        <Line width="70%" delay={400} />
        <Line width="40%" delay={600} />
      </Card>
      <LoadingText variants={textVariants}>
        {text}
      </LoadingText>
    </motion.div>
  );
};

export default LoadingCard; 