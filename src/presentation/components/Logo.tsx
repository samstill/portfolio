import React from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% {
    text-shadow: 0 0 10px rgba(74, 108, 247, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(74, 108, 247, 0.8), 0 0 30px rgba(74, 108, 247, 0.4);
  }
  100% {
    text-shadow: 0 0 10px rgba(74, 108, 247, 0.5);
  }
`;

const LogoContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${glowAnimation} 3s ease-in-out infinite;

  span.dot {
    color: #4a6cf7;
    -webkit-text-fill-color: initial;
  }

  span.domain {
    font-weight: 500;
    font-size: 1.2rem;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    
    span.domain {
      font-size: 1rem;
    }
  }
`;

const LogoSymbol = styled.div`
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  border-radius: 8px;
  transform: rotate(45deg);
  position: relative;
  box-shadow: 0 2px 10px rgba(74, 108, 247, 0.3);

  &::before {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: white;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
  }
`;

const Logo: React.FC = () => {
  React.useEffect(() => {
    document.title = "Harshit Padha | Portfolio";
  }, []);

  return (
    <LogoContainer>
      <LogoSymbol />
      <LogoText>
        Harshit Padha<span className="dot">.</span><span className="domain">me</span>
      </LogoText>
    </LogoContainer>
  );
};

export default Logo; 