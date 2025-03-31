import React from 'react';
import styled from 'styled-components';
import { FaComments, FaSearch } from 'react-icons/fa';
import { ThemeMode } from '../types';
import { themeColors } from '../utils/themeColors';
import ConversationList from '../../../components/ConversationList';
import UserSearch from '../../../components/UserSearch';

const Sidebar = styled.div<{ $isVisible: boolean; $theme: ThemeMode }>`
  width: 350px;
  border-right: 1px solid ${props => themeColors[props.$theme].border};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${props => themeColors[props.$theme].backgroundSecondary};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    position: absolute;
    left: ${props => props.$isVisible ? '0' : '-100%'};
    width: 100%;
    top: calc(60px + env(safe-area-inset-top, 0px));
    height: calc(100vh - 60px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
    height: calc(-webkit-fill-available - 60px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
    z-index: 20;
    border-right: none;
  }
`;

const TabsContainer = styled.div<{ $theme: ThemeMode }>`
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid ${props => themeColors[props.$theme].border};
  background: ${props => themeColors[props.$theme].backgroundSecondary};
  position: sticky;
  top: 0;
  z-index: 5;
`;

const Tab = styled.div<{ $active: boolean; $theme: ThemeMode }>`
  flex: 1;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: ${props => props.$active 
    ? themeColors[props.$theme].primary 
    : themeColors[props.$theme].textSecondary};
  font-weight: ${props => props.$active ? '600' : '500'};
  border-bottom: 2px solid ${props => props.$active 
    ? themeColors[props.$theme].primary 
    : 'transparent'};
  transition: all 0.3s ease;
  background-color: ${props => props.$active 
    ? props.$theme === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(42, 46, 60, 0.6)' 
    : 'transparent'};
  backdrop-filter: ${props => props.$active ? 'blur(8px)' : 'none'};
  
  &:hover {
    background-color: ${props => !props.$active && (props.$theme === 'light' 
      ? 'rgba(255, 255, 255, 0.4)' 
      : 'rgba(42, 46, 60, 0.4)')};
    color: ${props => !props.$active && (props.$theme === 'light' 
      ? '#4a4a4a' 
      : '#d1d5db')};
  }
`;

const SearchContainer = styled.div<{ $theme: ThemeMode }>`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ConversationsContainer = styled.div<{ $theme: ThemeMode }>`
  flex: 1;
  overflow-y: auto;
  /* Add momentum-based scrolling for iOS */
  -webkit-overflow-scrolling: touch;
  
  /* Make sure it fills the available space */
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface MessengerSidebarProps {
  theme: ThemeMode;
  isVisible: boolean;
  isMobile: boolean;
  activeTab: 'conversations' | 'search';
  setActiveTab: (tab: 'conversations' | 'search') => void;
  onSelectConversation: (conversation: any) => void;
  onSelectUser: (user: any) => void;
}

const MessengerSidebar: React.FC<MessengerSidebarProps> = ({
  theme,
  isVisible,
  isMobile,
  activeTab,
  setActiveTab,
  onSelectConversation,
  onSelectUser
}) => {
  return (
    <Sidebar $isVisible={isVisible} $theme={theme}>
      <TabsContainer $theme={theme}>
        <Tab 
          $active={activeTab === 'conversations'}
          $theme={theme}
          onClick={() => setActiveTab('conversations')}
        >
          <FaComments /> Conversations
        </Tab>
        <Tab 
          $active={activeTab === 'search'}
          $theme={theme}
          onClick={() => setActiveTab('search')}
        >
          <FaSearch /> Search
        </Tab>
      </TabsContainer>
      
      {activeTab === 'search' ? (
        <SearchContainer $theme={theme}>
          <UserSearch 
            onSelectUser={onSelectUser}
            theme={theme}
          />
        </SearchContainer>
      ) : (
        <ConversationsContainer $theme={theme}>
          <ConversationList 
            onSelectConversation={onSelectConversation}
            theme={theme}
          />
        </ConversationsContainer>
      )}
    </Sidebar>
  );
};

export default MessengerSidebar; 