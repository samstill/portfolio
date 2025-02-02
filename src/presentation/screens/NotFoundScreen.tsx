import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.text};
`;

const Title = styled.h1`
  font-size: 8rem;
  margin: 0;
  color: #4a6cf7;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin: 20px 0;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 500px;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;

const NotFoundScreen: React.FC = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <Description>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Description>
      <HomeButton to="/">
        <FiHome size={20} />
        Back to Home
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundScreen;
