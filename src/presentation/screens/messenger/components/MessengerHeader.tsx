import React from 'react';
import styled from 'styled-components';
import { FaLock, FaCircle, FaArrowLeft, FaMoon, FaSun, FaHome } from 'react-icons/fa';
import { ThemeMode, themeColors } from '../hooks/useMessengerTheme';

const Header = styled.div<{ $theme: ThemeMode }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => themeColors[props.$theme].border};
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${props => themeColors[props.$theme].background};
  backdrop-filter: blur(20px);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    padding-top: max(12px, env(safe-area-inset-top, 12px));
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.h1<{ $theme: ThemeMode }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => themeColors[props.$theme].text};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const HeaderAvatar = styled.div<{ $imageUrl?: string; $theme: ThemeMode }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$imageUrl 
    ? `url(${props.$imageUrl}) no-repeat center/cover`
    : props.$theme === 'light'
      ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
      : 'linear-gradient(135deg, #845ef7, #5e3bd1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

const HeaderSubtitle = styled.div<{ $theme: ThemeMode; $online?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: ${props => props.$online 
    ? '#10b981' 
    : themeColors[props.$theme].textSecondary};
  margin-top: 2px;
  font-weight: ${props => props.$online ? '500' : '400'};
  
  svg {
    font-size: 0.7rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CircleButton = styled.button<{ $theme: ThemeMode }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(42, 46, 60, 0.8)'};
  color: ${props => themeColors[props.$theme].text};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-right: 12px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: ${props => props.$theme === 'light' 
      ? 'rgba(255, 255, 255, 0.9)' 
      : 'rgba(52, 56, 70, 0.9)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ThemeToggle = styled.button<{ $theme: ThemeMode }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(255, 255, 255, 0.8)' 
    : themeColors.dark.backgroundSecondary};
  color: ${props => props.$theme === 'light' ? '#6e8efb' : '#ffd43b'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface MessengerHeaderProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  isConversationMode: boolean;
  isMobile: boolean;
  otherUserData: {
    name: string | null;
    photoURL: string | null;
    initial: string;
    isOnline: boolean;
  };
  handleBackToList: () => void;
  navigateToEvents: () => void;
}

const MessengerHeader: React.FC<MessengerHeaderProps> = ({
  theme,
  toggleTheme,
  isConversationMode,
  isMobile,
  otherUserData,
  handleBackToList,
  navigateToEvents
}) => {
  return (
    <Header $theme={theme}>
      <HeaderLeft>
        {isConversationMode && isMobile ? (
          <>
            <CircleButton $theme={theme} onClick={handleBackToList}>
              <FaArrowLeft />
            </CircleButton>
            
            <HeaderAvatar 
              $imageUrl={otherUserData.photoURL || undefined}
              $theme={theme}
            >
              {!otherUserData.photoURL && otherUserData.initial}
            </HeaderAvatar>
            
            <HeaderContent>
              <HeaderTitle $theme={theme}>{otherUserData.name || 'Chat'}</HeaderTitle>
              <HeaderSubtitle $theme={theme} $online={otherUserData.isOnline}>
                {otherUserData.isOnline ? (
                  <>
                    <FaCircle size={8} /> Online
                  </>
                ) : (
                  <>
                    <FaLock /> End-to-End Encrypted
                  </>
                )}
              </HeaderSubtitle>
            </HeaderContent>
          </>
        ) : (
          <>
            <CircleButton $theme={theme} onClick={navigateToEvents}>
              <FaHome />
            </CircleButton>
            <HeaderContent>
              <HeaderTitle $theme={theme}>Secure Private Conversations</HeaderTitle>
              <HeaderSubtitle $theme={theme} $online={false}>
                <FaLock /> End-to-End Encrypted
              </HeaderSubtitle>
            </HeaderContent>
          </>
        )}
      </HeaderLeft>
      
      <HeaderRight>
        <ThemeToggle $theme={theme} onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </ThemeToggle>
      </HeaderRight>
    </Header>
  );
};

export default MessengerHeader; 