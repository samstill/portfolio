import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledButton onClick={() => navigate(-1)} aria-label="Go back">
      <FiArrowLeft size={24} />
    </StyledButton>
  );
};

export default BackButton;
