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

const SkeletonContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
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

const BookingCardSkeleton = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const TitleSkeleton = styled.div`
  width: 60%;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 0 auto 30px;
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

const PaymentOptionsSkeleton = styled.div`
  display: flex;
  gap: 20px;
  margin: 30px 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PaymentOptionSkeleton = styled.div`
  flex: 1;
  height: 100px;
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

const PriceInfoSkeleton = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const PriceRowSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  
  .label {
    width: 100px;
    height: 20px;
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
  }

  .value {
    width: 80px;
    height: 20px;
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
  }
`;

const ButtonSkeleton = styled.div`
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 20px;
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

export const BookingSkeleton: React.FC = () => {
  return (
    <SkeletonContainer>
      <BackButtonSkeleton
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      />
      
      <BookingCardSkeleton
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TitleSkeleton />
        
        <PaymentOptionsSkeleton>
          <PaymentOptionSkeleton />
          <PaymentOptionSkeleton />
        </PaymentOptionsSkeleton>

        <PriceInfoSkeleton>
          <PriceRowSkeleton>
            <div className="label" />
            <div className="value" />
          </PriceRowSkeleton>
          <PriceRowSkeleton>
            <div className="label" />
            <div className="value" />
          </PriceRowSkeleton>
          <PriceRowSkeleton>
            <div className="label" />
            <div className="value" />
          </PriceRowSkeleton>
        </PriceInfoSkeleton>

        <ButtonSkeleton />
      </BookingCardSkeleton>
    </SkeletonContainer>
  );
}; 