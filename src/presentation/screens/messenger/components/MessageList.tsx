import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { ThemeMode } from '../types';
import { themeColors } from '../utils/themeColors';
import { useMessenger } from '../context/MessengerContext';
import { FaLock } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const MessengerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  position: relative;
  background: ${props => props.theme === 'light' ? '#f5f5f5' : '#121212'};

  @media (max-width: 768px) {
    height: 100vh;
    /* iOS viewport fix */
    height: -webkit-fill-available;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

const Header = styled.div<{ $theme: ThemeMode }>`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${props => themeColors[props.$theme].background};
  border-bottom: 1px solid ${props => themeColors[props.$theme].border};
  position: sticky;
  top: 0;
  z-index: 2;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h1<{ $theme: ThemeMode }>`
  font-size: 1.25rem;
  margin: 0;
  color: ${props => themeColors[props.$theme].text};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Subtitle = styled.span<{ $theme: ThemeMode }>`
  font-size: 0.875rem;
  color: ${props => themeColors[props.$theme].textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  background: ${props => props.theme === 'light' ? '#f5f5f5' : '#121212'};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const MessageBubble = styled.div<{ $isOwn: boolean; $theme: ThemeMode }>`
  max-width: 80%;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 20px;
  position: relative;
  animation: ${slideIn} 0.3s ease-out;
  word-wrap: break-word;
  
  ${props => props.$isOwn ? css`
    background: ${themeColors[props.$theme].messageBubbleOwn};
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  ` : css`
    background: ${themeColors[props.$theme].messageBubble};
    color: ${themeColors[props.$theme].text};
    margin-right: auto;
    border-bottom-left-radius: 4px;
  `}

  @media (max-width: 768px) {
    max-width: 85%;
    padding: 10px 14px;
  }
`;

const MessageTime = styled.span<{ $isOwn: boolean }>`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
  text-align: ${props => props.$isOwn ? 'right' : 'left'};
`;

const MessageStatus = styled.span<{ $status: string }>`
  font-size: 0.75rem;
  margin-left: 4px;
  opacity: 0.7;
  
  ${props => props.$status === 'read' && css`
    color: #4CAF50;
  `}
`;

const InputContainer = styled.div<{ $theme: ThemeMode }>`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${props => themeColors[props.$theme].background};
  border-top: 1px solid ${props => themeColors[props.$theme].border};
  position: sticky;
  bottom: 0;
  z-index: 1;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
`;

const MessageInput = styled.input<{ $theme: ThemeMode }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1px solid ${props => themeColors[props.$theme].inputBorder};
  background: ${props => themeColors[props.$theme].inputBackground};
  color: ${props => themeColors[props.$theme].inputText};
  font-size: 1rem;
  margin-right: 12px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => themeColors[props.$theme].placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${props => themeColors[props.$theme].primary};
    box-shadow: 0 0 0 2px ${props => `${themeColors[props.$theme].primary}20`};
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.95rem;
  }
`;

const SendButton = styled.button<{ $theme: ThemeMode; $disabled?: boolean }>`
  background: ${props => props.$disabled ? '#ccc' : themeColors[props.$theme].primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.$disabled ? 0.5 : 1};

  &:hover {
    transform: ${props => props.$disabled ? 'none' : 'scale(1.05)'};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'scale(0.95)'};
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const LoadingIndicator = styled.div<{ $theme: ThemeMode }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: ${props => themeColors[props.$theme].textSecondary};
  font-size: 0.875rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  isLoading
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useMessenger();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && !isLoading) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MessengerWrapper>
      <Header $theme={theme}>
        <HeaderTitle>
          <Title $theme={theme}>
            Secure Private Conversations
          </Title>
          <Subtitle $theme={theme}>
            <FaLock size={12} /> End-to-End Encrypted
          </Subtitle>
        </HeaderTitle>
      </Header>

      <MessageContainer>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            $isOwn={message.senderId === currentUserId}
            $theme={theme}
          >
            {message.text}
            <MessageTime $isOwn={message.senderId === currentUserId}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {message.senderId === currentUserId && message.status && (
                <MessageStatus $status={message.status}>
                  {message.status === 'read' ? '✓✓' : '✓'}
                </MessageStatus>
              )}
            </MessageTime>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <LoadingIndicator $theme={theme}>
            Loading messages...
          </LoadingIndicator>
        )}
      </MessageContainer>

      <InputContainer $theme={theme}>
        <MessageInput
          $theme={theme}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <SendButton
          $theme={theme}
          $disabled={!newMessage.trim() || isLoading}
          onClick={handleSend}
        >
          ➤
        </SendButton>
      </InputContainer>
    </MessengerWrapper>
  );
};

export default MessageList; 