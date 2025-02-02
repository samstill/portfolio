import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiCheck, FiClock, FiTrash2 } from 'react-icons/fi';
import { messageService, Message } from '../../firebase/services/messageService';
import BackButton from '../components/BackButton';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
`;

const MessagesWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MessageCard = styled(motion.div)<{ $isRead: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${props => props.$isRead ? 0.7 : 1};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const MessageContent = styled.p`
  color: ${props => props.theme.text};
  font-size: 1rem;
  margin-bottom: 10px;
  line-height: 1.5;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.text}80;
  font-size: 0.85rem;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DeleteButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.text}80;
`;

const MessagesScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await messageService.getAllMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message: Message) => {
    if (!message.isRead) {
      try {
        await messageService.markAsRead(message.id);
        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, isRead: true } : m
        ));
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await messageService.deleteMessage(messageId);
        setMessages(messages.filter(m => m.id !== messageId));
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <Container>
      <BackButton />
      <MessagesWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <FiMessageSquare size={24} />
          Anonymous Messages
        </Title>

        <AnimatePresence>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message.id}
                $isRead={message.isRead}
                onClick={() => handleMessageClick(message)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MessageContent>{message.content}</MessageContent>
                <MessageMeta>
                  <span>
                    {message.timestamp?.toLocaleString()}
                  </span>
                  <MessageActions>
                    <StatusIcon>
                      {message.isRead ? (
                        <>
                          <FiCheck size={16} color="#4a6cf7" />
                          Read
                        </>
                      ) : (
                        <>
                          <FiClock size={16} />
                          Unread
                        </>
                      )}
                    </StatusIcon>
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(message.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiTrash2 size={16} />
                    </DeleteButton>
                  </MessageActions>
                </MessageMeta>
              </MessageCard>
            ))
          ) : (
            <EmptyState>
              {loading ? 'Loading messages...' : 'No messages yet'}
            </EmptyState>
          )}
        </AnimatePresence>
      </MessagesWrapper>
    </Container>
  );
};

export default MessagesScreen;
