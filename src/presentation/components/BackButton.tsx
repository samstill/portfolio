import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';

const StyledButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <StyledButton onClick={onClick} aria-label="Go back">
      <FiArrowLeft size={24} />
    </StyledButton>
  );
};

export default BackButton;
