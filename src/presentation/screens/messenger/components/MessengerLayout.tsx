import React, { ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { MessengerLayoutProps, ThemeMode } from '../types';
import MessengerHeader from './MessengerHeader';
import MessengerSidebar from './MessengerSidebar';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MessengerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: var(--color-background);
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    height: 100vh;
    height: -webkit-fill-available;
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

const GlassPanel = styled.div<{ $theme: ThemeMode }>`
  background: var(--color-background);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 6px var(--color-shadow);
  margin: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  ${props => css`animation: ${fadeIn} 0.5s ease-out;`}
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    min-height: 100%;
  }
`;

const HeaderContainer = styled.div<{ $theme: ThemeMode }>`
  position: relative;
  z-index: 10;
  height: 60px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: calc(60px + env(safe-area-inset-top, 0));
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  background: var(--color-background);
  transition: background-color 0.3s ease;
`;

const MainContent = styled.div<{ $sidebarVisible: boolean; $theme: ThemeMode }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-background);
  position: relative;
  margin-left: ${props => props.$sidebarVisible ? '0' : '-320px'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ThemeToggle = styled.button<{ $theme: ThemeMode }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-background-active);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-primary);
  }
`;

const MessengerLayout: React.FC<MessengerLayoutProps> = ({
  theme,
  toggleTheme,
  showSidebar,
  setShowSidebar,
  activeTab,
  setActiveTab,
  otherUserData,
  isMobile,
  conversationId,
  handleBackToList,
  navigateToEvents,
  handleSelectConversation,
  handleSelectUser,
  children
}) => {
  const { theme: contextTheme, setTheme, isLoading } = useTheme();

  const handleThemeToggle = async () => {
    try {
      const newTheme = contextTheme === 'light' ? 'dark' : 'light';
      await setTheme(newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const isConversationMode = !!conversationId && !showSidebar;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MessengerContainer className="theme-transition">
      <GlassPanel $theme={theme} className="theme-transition">
        <HeaderContainer $theme={theme} className="theme-transition">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
            <h1>Messages</h1>
            <ThemeToggle 
              $theme={theme} 
              onClick={handleThemeToggle} 
              className="theme-transition"
              title={`Switch to ${contextTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {contextTheme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </ThemeToggle>
          </div>
        </HeaderContainer>
        
        <ContentContainer className="theme-transition">
          <MessengerSidebar 
            theme={theme}
            isVisible={showSidebar}
            isMobile={isMobile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSelectConversation={handleSelectConversation}
            onSelectUser={handleSelectUser}
          />
          
          <MainContent 
            $sidebarVisible={showSidebar} 
            $theme={theme}
            className="theme-transition"
          >
            {children}
          </MainContent>
        </ContentContainer>
      </GlassPanel>
    </MessengerContainer>
  );
};

export default MessengerLayout; 