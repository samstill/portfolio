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

const SkeletonCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  overflow: hidden;
`;

const SkeletonLine = styled.div<{ width?: string; height?: string; margin?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  margin: ${({ margin }) => margin || '10px 0'};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
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
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const BackButtonSkeleton = styled(motion.div)`
  width: 120px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
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
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 30px;
`;

const ButtonSkeleton = styled.div<{ width?: string }>`
  width: ${({ width }) => width || '140px'};
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
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
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

export const EventDetailSkeleton: React.FC = () => {
  return (
    <>
      <BackButtonSkeleton
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />
      
      <SkeletonCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SkeletonLine height="40px" margin="0 0 20px 0" width="60%" />
        
        {/* Date, Time, Location info */}
        {[1, 2, 3].map((i) => (
          <SkeletonLine 
            key={i}
            height="24px" 
            width="40%" 
            margin="15px 0"
          />
        ))}
        
        {/* Price tag */}
        <SkeletonLine 
          height="40px" 
          width="120px" 
          margin="25px 0"
        />
        
        {/* Description paragraphs */}
        <SkeletonLine height="16px" width="100%" margin="8px 0" />
        <SkeletonLine height="16px" width="95%" margin="8px 0" />
        <SkeletonLine height="16px" width="90%" margin="8px 0" />
        <SkeletonLine height="16px" width="85%" margin="8px 0" />
        
        {/* Action buttons */}
        <ButtonGroup>
          <ButtonSkeleton width="140px" />
          <ButtonSkeleton width="160px" />
          <ButtonSkeleton width="120px" />
        </ButtonGroup>
      </SkeletonCard>
    </>
  );
}; 