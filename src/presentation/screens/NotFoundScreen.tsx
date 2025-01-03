import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { darkTheme } from '../../shared/styles/themes';
import { useTheme } from '../../shared/context/ThemeContext';
import { device } from '../../shared/styles/breakpoints';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  color: ${({ theme }) => theme.text.primary};
`;

const Title = styled.h1`
  font-size: 5rem;
  
  ${device.tablet} {
    font-size: 8rem;
  }
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
`;

const Message = styled.p`
  font-size: 1.2rem;
  
  ${device.tablet} {
    font-size: 1.5rem;
  }
  color: ${({ theme }) => theme.text.secondary};
  margin: 1rem 0;
`;

const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  border: 2px solid ${({ theme }) => theme.text.primary};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.text.primary};
    color: ${props => props.theme === darkTheme ? '#000000' : '#ffffff'};
  }
`;

const NotFoundScreen: React.FC = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>Oops! Page not found</Message>
      <HomeLink to="/">Return Home</HomeLink>
    </NotFoundContainer>
  );
};

export default NotFoundScreen;
