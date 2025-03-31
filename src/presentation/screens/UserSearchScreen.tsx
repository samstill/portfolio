import React from 'react';
import styled from 'styled-components';
import UserSearch from '../components/UserSearch';

const SearchContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
`;

const SearchTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const SearchInstructions = styled.p`
  margin-bottom: 30px;
  color: #666;
  text-align: center;
  max-width: 600px;
`;

const UserSearchScreen: React.FC = () => {
  return (
    <SearchContainer>
      <SearchTitle>Find People to Chat With</SearchTitle>
      <SearchInstructions>
        Search for users by username or email to start a secure, end-to-end encrypted conversation.
      </SearchInstructions>
      <UserSearch />
    </SearchContainer>
  );
};

export default UserSearchScreen;