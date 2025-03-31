import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams, Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { 
  FaLock, FaSearch, FaComments, FaArrowLeft, 
  FaMoon, FaSun, FaEllipsisV, FaHome, FaCircle 
} from 'react-icons/fa';
import ConversationList from '../components/ConversationList';
import UserSearch from '../components/UserSearch';
import MeshGradientBackground from '../components/MeshGradientBackground';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInRight = keyframes`
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Theme types
type ThemeMode = 'light' | 'dark';

// Theme definitions
const themeColors = {
  light: {
    background: 'rgba(255, 255, 255, 0.6)',
    backgroundSecondary: 'rgba(255, 255, 255, 0.3)',
    text: '#1a1b25',
    textSecondary: '#666',
    primary: '#4a6cf7',
    border: 'rgba(225, 228, 232, 0.4)',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    cardShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(255, 255, 255, 0.8)',
    backgroundActive: 'rgba(74, 108, 247, 0.1)'
  },
  dark: {
    background: 'rgba(25, 28, 39, 0.8)',
    backgroundSecondary: 'rgba(32, 36, 48, 0.7)',
    text: '#e1e5ee',
    textSecondary: '#a8b0c5',
    primary: '#6e8efb',
    border: 'rgba(65, 70, 90, 0.6)',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    cardShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(41, 45, 62, 0.9)',
    backgroundActive: 'rgba(74, 108, 247, 0.2)'
  }
};

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

  @media (max-width: 768px) {
    height: 100%;
    /* Add safe area insets for iOS devices */
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

const GlassPanel = styled.div<{ $theme: ThemeMode }>`
  background: ${props => themeColors[props.$theme].background};
  backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid ${props => props.$theme === 'light' 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${props => themeColors[props.$theme].cardShadow};
  margin: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  ${props => css`animation: ${fadeIn} 0.5s ease-out;`}
  
  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
    height: 100%;
  }
`;

const MessengerHeader = styled.div<{ $theme: ThemeMode }>`
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

const BackToEventsButton = styled(CircleButton)`
  color: ${props => themeColors[props.$theme].primary};
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

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
    height: calc(100% - 56px - env(safe-area-inset-top, 0px));
    top: 56px;
    top: calc(56px + env(safe-area-inset-top, 0px));
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

const MainContent = styled.div<{ $sidebarVisible: boolean; $theme: ThemeMode }>`
  flex: 1;
  position: relative;
  background-color: ${props => themeColors[props.$theme].backgroundSecondary};
  backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    display: ${props => props.$sidebarVisible ? 'none' : 'block'};
  }
`;

const MessengerScreen: React.FC = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'conversations' | 'search'>('conversations');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  const [otherUserPhotoURL, setOtherUserPhotoURL] = useState<string | null>(null);
  const [otherUserInitial, setOtherUserInitial] = useState<string>('');
  const [isOtherUserOnline, setIsOtherUserOnline] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (conversationId && isMobile) {
      setShowSidebar(false);
    }
  }, [conversationId, isMobile]);
  
  // Listen for username updates from ChatScreen
  const updateOtherUserData = (name: string, photoURL?: string, isOnline?: boolean, email?: string) => {
    setOtherUserName(name);
    setOtherUserPhotoURL(photoURL || null);
    setIsOtherUserOnline(isOnline || false);
    
    if (email) {
      const initial = email.split('@')[0].charAt(0).toUpperCase();
      setOtherUserInitial(initial);
    } else if (name) {
      setOtherUserInitial(name.charAt(0).toUpperCase());
    }
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    setOtherUserName(null);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const navigateToEvents = () => {
    navigate('/events');
  };

  const isConversationMode = !!conversationId && !showSidebar;

  return (
    <MessengerContainer>
      <MeshGradientBackground />
      
      <GlassPanel $theme={theme}>
        <MessengerHeader $theme={theme}>
          <HeaderLeft>
            {isConversationMode && isMobile ? (
              <>
                <CircleButton $theme={theme} onClick={handleBackToList}>
                  <FaArrowLeft />
                </CircleButton>
                
                <HeaderAvatar 
                  $imageUrl={otherUserPhotoURL || undefined}
                  $theme={theme}
                >
                  {!otherUserPhotoURL && otherUserInitial}
                </HeaderAvatar>
                
                <HeaderContent>
                  <HeaderTitle $theme={theme}>{otherUserName || 'Chat'}</HeaderTitle>
                  <HeaderSubtitle $theme={theme} $online={isOtherUserOnline}>
                    {isOtherUserOnline ? (
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
                <BackToEventsButton $theme={theme} onClick={navigateToEvents}>
                  <FaHome />
                </BackToEventsButton>
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
        </MessengerHeader>
        
        <ContentContainer>
          <Sidebar $isVisible={showSidebar} $theme={theme}>
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
                  onSelectUser={(conversation) => {
                    navigate(`/messenger/chat/${conversation._id}`);
                    setActiveTab('conversations');
                    if (isMobile) setShowSidebar(false);
                  }}
                  theme={theme}
                />
              </SearchContainer>
            ) : (
              <ConversationsContainer $theme={theme}>
                <ConversationList 
                  onSelectConversation={(conversation) => {
                    navigate(`/messenger/chat/${conversation.id}`);
                    if (isMobile) setShowSidebar(false);
                    
                    // Pass more user data
                    updateOtherUserData(
                      conversation.otherUser?.email 
                        ? conversation.otherUser.email.split('@')[0] 
                        : 'Chat',
                      conversation.otherUser?.photoURL || conversation.otherUser?.profilePicture,
                      conversation.otherUser?.isOnline,
                      conversation.otherUser?.email
                    );
                  }}
                  theme={theme}
                />
              </ConversationsContainer>
            )}
          </Sidebar>
          
          <MainContent $sidebarVisible={showSidebar} $theme={theme}>
            <Outlet context={{ updateOtherUserName: updateOtherUserData, theme }} />
          </MainContent>
        </ContentContainer>
      </GlassPanel>
    </MessengerContainer>
  );
};

export default MessengerScreen;