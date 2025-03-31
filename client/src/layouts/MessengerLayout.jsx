import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import UserSearch from '../components/UserSearch';
import ConversationList from '../components/ConversationList';
import styled from 'styled-components';
import { FaHome, FaLock } from 'react-icons/fa';

const MessengerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f5f7fb;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #e1e4e8;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  h1 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    margin-left: 16px;
    
    @media (max-width: 768px) {
      font-size: 16px;
      margin-left: 12px;
    }
  }
  
  .home-icon {
    color: #4a6cf7;
    margin-right: 12px;
    cursor: pointer;
  }
`;

const EncryptionBadge = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-left: auto;

  svg {
    margin-right: 8px;
    color: #4a6cf7;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    
    svg {
      margin-right: 5px;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 350px;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.hide ? 'none' : 'flex'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: ${props => props.hide ? 'none' : 'flex'};
  }
`;

const SearchContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e1e4e8;
`;

const ConversationsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e4e8;
`;

const Tab = styled.button`
  padding: 16px;
  flex: 1;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#4a6cf7' : '#666'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#4a6cf7' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? 'transparent' : '#f5f7fb'};
  }
`;

const MessengerLayout = () => {
  const [activeTab, setActiveTab] = useState('conversations');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a specific chat page
  const isInChatPage = location.pathname.includes('/chat/');
  
  // Check if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <MessengerContainer>
      {/* Only show the header when NOT in a chat page */}
      {!isInChatPage && (
        <Header>
          <HeaderTitle>
            <FaHome className="home-icon" onClick={() => navigate('/')} />
            <h1>Secure Private Conversations</h1>
          </HeaderTitle>
          <EncryptionBadge>
            <FaLock /> End-to-End Encrypted
          </EncryptionBadge>
        </Header>
      )}
      
      <ContentContainer>
        <Sidebar hide={isMobile && isInChatPage}>
          <TabContainer>
            <Tab 
              active={activeTab === 'conversations'}
              onClick={() => setActiveTab('conversations')}
            >
              Conversations
            </Tab>
            <Tab 
              active={activeTab === 'search'}
              onClick={() => setActiveTab('search')}
            >
              Search Users
            </Tab>
          </TabContainer>
          
          {activeTab === 'search' ? (
            <SearchContainer>
              <UserSearch 
                onSelectUser={(conversation) => {
                  navigate(`/messenger/chat/${conversation._id}`);
                  setActiveTab('conversations');
                }}
              />
            </SearchContainer>
          ) : (
            <ConversationsContainer>
              <ConversationList 
                onSelectConversation={(conversation) => {
                  navigate(`/messenger/chat/${conversation._id}`);
                }}
              />
            </ConversationsContainer>
          )}
        </Sidebar>
        
        <MainContent hide={isMobile && !isInChatPage}>
          <Outlet />
        </MainContent>
      </ContentContainer>
    </MessengerContainer>
  );
};

export default MessengerLayout; 