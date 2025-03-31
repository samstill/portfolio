import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../../shared/context/AuthContext';
import { useParams } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc as firestoreDoc,
  getDoc,
  Timestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../firebase';
import { FaLock, FaExclamationTriangle, FaCircle, FaDatabase, FaSpinner } from 'react-icons/fa';

// Fix: Define all animations properly with css helper
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Theme definitions
const themeColors = {
  light: {
    background: 'rgba(255, 255, 255, 0.6)',
    backgroundSecondary: 'rgba(255, 255, 255, 0.3)',
    text: '#1a1b25',
    textSecondary: '#666',
    primary: '#4a6cf7',
    border: 'rgba(225, 228, 232, 0.4)',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    cardShadow: '0 5px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(255, 255, 255, 0.8)',
    backgroundActive: 'rgba(255, 255, 255, 0.9)'
  },
  dark: {
    background: 'rgba(25, 28, 39, 0.8)',
    backgroundSecondary: 'rgba(32, 36, 48, 0.7)',
    text: '#e1e5ee',
    textSecondary: '#a8b0c5',
    primary: '#6e8efb',
    border: 'rgba(65, 70, 90, 0.6)',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    cardShadow: '0 5px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(41, 45, 62, 0.9)',
    backgroundActive: 'rgba(42, 46, 60, 0.9)'
  }
};

const ConversationsWrapper = styled.div<{ $theme: 'light' | 'dark' }>`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => `${themeColors[props.$theme].primary}40`};
    border-radius: 6px;
  }
`;

const ConversationItem = styled.div<{ $isActive: boolean; $theme: 'light' | 'dark' }>`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid ${props => themeColors[props.$theme].border};
  cursor: pointer;
  background-color: ${props => props.$isActive 
    ? themeColors[props.$theme].backgroundActive 
    : 'transparent'};
  transition: all 0.2s ease;
  position: relative;
  ${props => css`animation: ${fadeIn} 0.4s ease-out;`}
  backdrop-filter: ${props => props.$isActive ? 'blur(10px)' : 'blur(0px)'};
  
  &:hover {
    background-color: ${props => props.$isActive 
      ? themeColors[props.$theme].backgroundActive 
      : props.$theme === 'light' 
        ? 'rgba(255, 255, 255, 0.5)' 
        : 'rgba(42, 46, 60, 0.5)'};
    backdrop-filter: blur(5px);
  }
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: ${props => themeColors[props.$theme].primary};
    opacity: ${props => props.$isActive ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`;

const Avatar = styled.div<{ $imageUrl?: string; $theme: 'light' | 'dark'; $isOnline?: boolean }>`
  width: 48px;
  height: 48px;
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
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid ${props => props.$theme === 'light' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(42, 46, 60, 0.9)'};
  position: relative;
  
  ${props => props.$isOnline && css`
    &:after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 0px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #10b981;
      border: 2px solid ${props.$theme === 'light' 
        ? 'rgba(255, 255, 255, 0.9)' 
        : 'rgba(42, 46, 60, 0.9)'};
    }
  `}
`;

const ConversationDetails = styled.div<{ $theme: 'light' | 'dark' }>`
  flex: 1;
  min-width: 0;
  position: relative;
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  align-items: center;
`;

const Username = styled.div<{ $theme: 'light' | 'dark' }>`
  font-weight: 600;
  font-size: 15px;
  color: ${props => themeColors[props.$theme].text};
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  svg {
    font-size: 12px;
    opacity: 0.7;
  }
`;

const Time = styled.div<{ $theme: 'light' | 'dark' }>`
  font-size: 0.8rem;
  color: ${props => themeColors[props.$theme].textSecondary};
  white-space: nowrap;
`;

const MessagePreview = styled.div<{ $theme: 'light' | 'dark'; $unread: boolean }>`
  color: ${props => props.$unread 
    ? themeColors[props.$theme].text 
    : themeColors[props.$theme].textSecondary};
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: ${props => props.$unread ? '600' : '400'};
  
  svg {
    flex-shrink: 0;
  }
`;

const UnreadBadge = styled.div<{ $theme: 'light' | 'dark' }>`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: ${props => themeColors[props.$theme].primary};
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const IndexErrorContainer = styled.div<{ $theme: 'light' | 'dark' }>`
  padding: 20px;
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(255, 245, 245, 0.8)' 
    : 'rgba(61, 44, 44, 0.8)'};
  border-radius: 8px;
  margin: 16px;
  border: 1px solid ${props => props.$theme === 'light' 
    ? 'rgba(254, 202, 202, 0.8)' 
    : 'rgba(127, 29, 29, 0.5)'};
  backdrop-filter: blur(10px);
  
  h3 {
    color: ${props => props.$theme === 'light' ? '#e53e3e' : '#fc8181'};
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 0;
  }
`;

const IndexErrorLink = styled.a<{ $theme: 'light' | 'dark' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.$theme === 'light' ? '#e53e3e' : '#fc8181'};
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  margin: 16px 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const EmptyState = styled.div<{ $theme: 'light' | 'dark' }>`
  text-align: center;
  padding: 32px 16px;
  color: ${props => themeColors[props.$theme].textSecondary};
  
  h3 {
    color: ${props => themeColors[props.$theme].primary};
  }
`;

// Skeleton loading components
const SkeletonItem = styled.div<{ $theme: 'light' | 'dark' }>`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid ${props => themeColors[props.$theme].border};
  ${props => css`animation: ${fadeIn} 0.4s ease-out;`}
`;

const SkeletonAvatar = styled.div<{ $theme: 'light' | 'dark' }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  background: linear-gradient(
    90deg,
    ${props => props.$theme === 'light' 
      ? 'rgba(240, 240, 240, 0.8)' 
      : 'rgba(42, 46, 60, 0.8)'},
    ${props => props.$theme === 'light' 
      ? 'rgba(248, 248, 248, 0.8)' 
      : 'rgba(54, 60, 78, 0.8)'},
    ${props => props.$theme === 'light' 
      ? 'rgba(240, 240, 240, 0.8)' 
      : 'rgba(42, 46, 60, 0.8)'}
  );
  background-size: 200% 100%;
  ${props => css`animation: ${shimmer} 1.5s infinite;`}
`;

const SkeletonDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonLine = styled.div<{ 
  $theme: 'light' | 'dark';
  $width?: string;
  $height?: string;
}>`
  height: ${props => props.$height || '10px'};
  width: ${props => props.$width || '100%'};
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    ${props => props.$theme === 'light' 
      ? 'rgba(240, 240, 240, 0.8)' 
      : 'rgba(42, 46, 60, 0.8)'},
    ${props => props.$theme === 'light' 
      ? 'rgba(248, 248, 248, 0.8)' 
      : 'rgba(54, 60, 78, 0.8)'},
    ${props => props.$theme === 'light' 
      ? 'rgba(240, 240, 240, 0.8)' 
      : 'rgba(42, 46, 60, 0.8)'}
  );
  background-size: 200% 100%;
  ${props => css`animation: ${shimmer} 1.5s infinite;`}
`;

const SpinnerIcon = styled(FaSpinner)`
  ${props => css`animation: ${spin} 1s linear infinite;`}
  font-size: 24px;
  color: ${props => props.color || '#4a6cf7'};
`;

const LoadingContainer = styled.div<{ $theme: 'light' | 'dark' }>`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: ${props => themeColors[props.$theme].textSecondary};
`;

// Types
type Conversation = {
  id: string;
  participants: Record<string, boolean>;
  participantIds: string[];
  updatedAt: Timestamp;
  lastMessage?: string;
  unreadCount?: number;
  otherUser?: {
    id: string;
    username?: string;
    email?: string;
    photoURL?: string;
    profilePicture?: string;
    isOnline?: boolean;
  };
};

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  theme: 'light' | 'dark';
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation, theme }) => {
  const { currentUser } = useAuth();
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (!currentUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef,
        where('participantIds', 'array-contains', currentUser.uid),
        orderBy('updatedAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const rawConversationsData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              
              // Find the other participant's ID
              const otherParticipantId = data.participantIds.find(
                (id: string) => id !== currentUser.uid
              );
              
              let otherUser = null;
              if (otherParticipantId) {
                try {
                  const userDoc = await getDoc(firestoreDoc(db, 'users', otherParticipantId));
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    otherUser = {
                      id: otherParticipantId,
                      username: userData.username || userData.displayName,
                      email: userData.email,
                      photoURL: userData.photoURL,
                      profilePicture: userData.profilePicture,
                      isOnline: userData.isOnline
                    };
                  }
                } catch (err) {
                  console.error('Error fetching other user:', err);
                }
              }
              
              return {
                id: doc.id,
                ...data,
                otherUser
              };
            })
          );
          
          // Deduplicate conversations by otherParticipantId
          const userIdMap = new Map();
          
          rawConversationsData.forEach(conversation => {
            if (!conversation.otherUser?.id) return;
            
            const currentUpdatedAt = conversation.updatedAt?.toMillis() || 0;
            
            if (!userIdMap.has(conversation.otherUser.id) || 
                currentUpdatedAt > (userIdMap.get(conversation.otherUser.id).updatedAt?.toMillis() || 0)) {
              userIdMap.set(conversation.otherUser.id, conversation);
            }
          });
          
          const deduplicatedConversations = Array.from(userIdMap.values());
          setConversations(deduplicatedConversations);
          setLoading(false);
        },
        (err: FirestoreError) => {
          console.error('Error fetching conversations:', err);
          setError(err.message);
          
          if (err.message.includes('index')) {
            const urlMatch = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
            if (urlMatch) {
              setIndexUrl(urlMatch[0]);
            }
          }
          
          setLoading(false);
        }
      );
      
      return unsubscribe;
    } catch (err) {
      console.error('Error setting up conversations listener:', err);
      setError('Failed to set up conversations listener');
      setLoading(false);
    }
  }, [currentUser]);
  
  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    
    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this week, show day of week
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  const getInitials = (email: string) => {
    if (!email) return 'U';
    return email.split('@')[0].charAt(0).toUpperCase();
  };
  
  // Add a function to format email as username
  const formatEmailAsUsername = (email: string) => {
    if (!email) return 'User';
    return email.split('@')[0]; // Strip the @email.com part
  };
  
  if (loading) {
    return (
      <ConversationsWrapper $theme={theme}>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonItem key={i} $theme={theme}>
            <SkeletonAvatar $theme={theme} />
            <div style={{ flex: 1 }}>
              <div 
                style={{ 
                  height: 14, 
                  width: '60%', 
                  background: theme === 'light' ? 'rgba(240, 240, 240, 0.8)' : 'rgba(42, 46, 60, 0.8)', 
                  borderRadius: 4,
                  marginBottom: 8
                }} 
              />
              <div 
                style={{ 
                  height: 10, 
                  width: '85%', 
                  background: theme === 'light' ? 'rgba(240, 240, 240, 0.8)' : 'rgba(42, 46, 60, 0.8)', 
                  borderRadius: 4
                }} 
              />
            </div>
          </SkeletonItem>
        ))}
      </ConversationsWrapper>
    );
  }
  
  if (error) {
    return (
      <IndexErrorContainer $theme={theme}>
        <h3><FaExclamationTriangle /> Firestore Index Required</h3>
        <p>This query requires a special database index to work efficiently.</p>
        {indexUrl ? (
          <>
            <p>Click below to create the index in Firebase (you'll need to be logged in to Firebase):</p>
            <IndexErrorLink href={indexUrl} target="_blank" rel="noopener noreferrer" $theme={theme}>
              <FaDatabase /> Create Firestore Index
            </IndexErrorLink>
            <p style={{ fontSize: '0.9rem', marginTop: 20 }}>
              After creating the index, return here and refresh the page. 
              The index may take a minute to activate.
            </p>
          </>
        ) : (
          <p>Please check the console for the exact error details.</p>
        )}
      </IndexErrorContainer>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <EmptyState $theme={theme}>
        <h3>No conversations yet</h3>
        <p>Start chatting by searching for users using the Search tab</p>
      </EmptyState>
    );
  }
  
  return (
    <ConversationsWrapper $theme={theme}>
      {conversations.map(conversation => {
        const hasUnread = conversation.unreadCount > 0;
        const isOnline = conversation.otherUser?.isOnline === true;
        
        return (
          <ConversationItem 
            key={conversation.id}
            $isActive={conversation.id === conversationId}
            $theme={theme}
            onClick={() => onSelectConversation(conversation)}
          >
            <Avatar 
              $imageUrl={conversation.otherUser?.photoURL || conversation.otherUser?.profilePicture}
              $theme={theme}
              $isOnline={isOnline}
            >
              {!conversation.otherUser?.photoURL && !conversation.otherUser?.profilePicture && 
                getInitials(conversation.otherUser?.username || conversation.otherUser?.email || '')}
            </Avatar>
            <ConversationDetails $theme={theme}>
              <ConversationHeader>
                <Username $theme={theme}>
                  {conversation.otherUser?.username || 
                   (conversation.otherUser?.email && formatEmailAsUsername(conversation.otherUser.email)) ||
                   'User'}
                  <FaLock title="End-to-end encrypted" />
                </Username>
                <Time $theme={theme}>{conversation.updatedAt && formatTimestamp(conversation.updatedAt)}</Time>
              </ConversationHeader>
              <MessagePreview $theme={theme} $unread={hasUnread}>
                {hasUnread && <FaCircle size={8} color={themeColors[theme].primary} />}
                {conversation.lastMessage || 'No messages yet'}
              </MessagePreview>
              
              {hasUnread && conversation.unreadCount > 0 && (
                <UnreadBadge $theme={theme}>
                  {conversation.unreadCount}
                </UnreadBadge>
              )}
            </ConversationDetails>
          </ConversationItem>
        );
      })}
    </ConversationsWrapper>
  );
};

export default ConversationList; 