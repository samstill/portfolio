import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import MeshGradientBackground from '../../components/MeshGradientBackground';
import MessengerLayout from './components/MessengerLayout';
import { useMessenger } from './context/MessengerContext';
import { useMobileDetection } from './hooks/useMobileDetection';
import { UserData, Conversation } from './types';

const MessengerScreen: React.FC = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useMessenger();
  const { isMobile } = useMobileDetection();
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'conversations' | 'search'>('conversations');
  const [otherUserData, setOtherUserData] = useState<UserData>({
    name: null,
    photoURL: null,
    initial: '',
    isOnline: false
  });
  
  useEffect(() => {
    if (conversationId && isMobile) {
      setShowSidebar(false);
    }
  }, [conversationId, isMobile]);
  
  const handleBackToList = () => {
    setShowSidebar(true);
    setOtherUserData({
      ...otherUserData,
      name: null
    });
  };
  
  const navigateToEvents = () => {
    navigate('/events');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    navigate(`/messenger/chat/${conversation.id}`);
    if (isMobile) setShowSidebar(false);
    
    const initial = conversation.otherUser?.email 
      ? conversation.otherUser.email.split('@')[0].charAt(0).toUpperCase() 
      : 'Chat';
    
    setOtherUserData({
      name: conversation.otherUser?.email 
        ? conversation.otherUser.email.split('@')[0] 
        : 'Chat',
      photoURL: conversation.otherUser?.photoURL || conversation.otherUser?.profilePicture || null,
      initial,
      isOnline: conversation.otherUser?.isOnline || false
    });
  };

  const handleSelectUser = (user: any) => {
    navigate(`/messenger/chat/${user._id}`);
    setActiveTab('conversations');
    if (isMobile) setShowSidebar(false);
  };

  return (
    <MessengerLayout
      theme={theme}
      toggleTheme={toggleTheme}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      otherUserData={otherUserData}
      isMobile={isMobile}
      conversationId={conversationId}
      handleBackToList={handleBackToList}
      navigateToEvents={navigateToEvents}
      handleSelectConversation={handleSelectConversation}
      handleSelectUser={handleSelectUser}
    >
      <MeshGradientBackground />
      <Outlet context={{ updateOtherUserName: setOtherUserData, theme }} />
    </MessengerLayout>
  );
};

export default MessengerScreen; 