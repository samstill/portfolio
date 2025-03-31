import React from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import OriginalChatScreen from '../../screens/ChatScreen';
import { ThemeMode } from '../hooks/useMessengerTheme';

// Define the ChatOutletContext interface to match the original
interface ChatOutletContext {
  updateOtherUserName: (name: string, image?: string, isOnline?: boolean, email?: string) => void;
  theme: ThemeMode;
}

const ChatScreen: React.FC = () => {
  // We're just passing through to the original implementation to avoid duplicating code
  // while keeping the existing functionality identical
  return <OriginalChatScreen />;
};

export default ChatScreen; 