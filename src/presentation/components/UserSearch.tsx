import React, { useState, useEffect } from 'react';
import { 
  query, 
  collection, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../firebase';
import styled from 'styled-components';
import { useAuth } from '../../shared/context/AuthContext';
import { FaSearch, FaUser } from 'react-icons/fa';
import { FirebaseError } from 'firebase/app';

// Theme definitions
const themeColors = {
  light: {
    background: 'rgba(255, 255, 255, 0.6)',
    backgroundSecondary: 'rgba(255, 255, 255, 0.3)',
    text: '#1a1b25',
    textSecondary: '#666',
    primary: '#4a6cf7',
    border: 'rgba(225, 228, 232, 0.4)',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  dark: {
    background: 'rgba(25, 28, 39, 0.8)',
    backgroundSecondary: 'rgba(32, 36, 48, 0.7)',
    text: '#e1e5ee',
    textSecondary: '#a8b0c5',
    primary: '#6e8efb',
    border: 'rgba(65, 70, 90, 0.6)',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
  }
};

const SearchContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const SearchInputWrapper = styled.div<{ $theme: 'light' | 'dark' }>`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`;

const SearchInput = styled.input<{ $theme: 'light' | 'dark' }>`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: 12px;
  border: 1px solid ${props => themeColors[props.$theme].border};
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(42, 46, 60, 0.8)'};
  color: ${props => themeColors[props.$theme].text};
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${props => themeColors[props.$theme].primary};
    box-shadow: 0 0 0 2px ${props => `${themeColors[props.$theme].primary}30`};
  }
  
  &::placeholder {
    color: ${props => themeColors[props.$theme].textSecondary};
    opacity: 0.7;
  }
  
  @media (max-width: 480px) {
    padding: 10px 14px 10px 36px;
    font-size: 14px;
  }
`;

const SearchIcon = styled.div<{ $theme: 'light' | 'dark' }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => themeColors[props.$theme].textSecondary};
  opacity: 0.8;
  
  @media (max-width: 480px) {
    left: 10px;
  }
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f7fb;
  }
`;

const UserAvatar = styled.div<{ $imageUrl?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$imageUrl 
    ? `url(${props.$imageUrl}) no-repeat center/cover`
    : 'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  font-weight: 600;
  color: #333;
`;

const Email = styled.div`
  font-size: 14px;
  color: #666;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #e53935;
  padding: 12px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(229, 57, 53, 0.1);
  margin-bottom: 20px;
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface Conversation {
  _id: string;
  participants: {
    [key: string]: boolean;
  };
  participantIds: string[];
  createdBy: string;
  createdAt: Date;
  type: 'private';
  otherUser?: User;
  lastMessage?: {
    text: string;
    createdAt: Date;
    senderId: string;
  } | null;
}

interface UserSearchProps {
  onSelectUser?: (conversation: Conversation) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (!searchTerm.trim() || !currentUser) {
      setUsers([]);
      return;
    }
    
    const searchUsers = async () => {
      try {
        setLoading(true);
        
        // Create separate queries for username and email
        const usersRef = collection(db, 'users');
        
        // Query for username
        const usernameQuery = query(
          usersRef,
          where('username', '>=', searchTerm),
          where('username', '<=', searchTerm + '\uf8ff')
        );
        
        // Query for email
        const emailQuery = query(
          usersRef,
          where('email', '>=', searchTerm),
          where('email', '<=', searchTerm + '\uf8ff')
        );
        
        // Run both queries
        const [usernameSnapshot, emailSnapshot] = await Promise.all([
          getDocs(usernameQuery),
          getDocs(emailQuery)
        ]);
        
        // Combine results, removing duplicates by user ID
        const userMap = new Map<string, User>();
        
        // Add username matches
        usernameSnapshot.forEach((doc) => {
          if (doc.id !== currentUser.uid) {
            userMap.set(doc.id, {
              id: doc.id,
              ...doc.data() as Omit<User, 'id'>
            });
          }
        });
        
        // Add email matches
        emailSnapshot.forEach((doc) => {
          if (doc.id !== currentUser.uid && !userMap.has(doc.id)) {
            userMap.set(doc.id, {
              id: doc.id,
              ...doc.data() as Omit<User, 'id'>
            });
          }
        });
        
        // Convert map to array
        const userResults = Array.from(userMap.values());
        
        setUsers(userResults);
        setError('');
      } catch (err) {
        console.error('Error searching users:', err);
        
        // Handle the specific index error
        if (err instanceof FirestoreError && 
            err.code === 'failed-precondition' && 
            err.message.includes('index')) {
          setError('Your search requires a database index. Please create it using the link in the console.');
        } else {
          setError('Failed to search users. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the search to prevent too many requests
    const timer = setTimeout(() => {
      searchUsers();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, currentUser]);
  
  const handleUserClick = async (user: User) => {
    if (!currentUser || !onSelectUser) return;
    
    try {
      setError('');
      
      // Check if conversation already exists
      const q = query(
        collection(db, 'conversations'),
        where(`participants.${currentUser.uid}`, '==', true),
        where(`participants.${user.id}`, '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Conversation exists, navigate to it
        const existingConversation = {
          _id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
          otherUser: user
        } as Conversation;
        
        onSelectUser(existingConversation);
        return;
      }
      
      // Create a new conversation
      const participantIds = [currentUser.uid, user.id];
      const newConversationRef = await addDoc(collection(db, 'conversations'), {
        participants: {
          [currentUser.uid]: true,
          [user.id]: true
        },
        participantIds,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
        type: 'private'
      });
      
      const newConversation: Conversation = {
        _id: newConversationRef.id,
        participants: {
          [currentUser.uid]: true,
          [user.id]: true
        },
        participantIds,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        type: 'private',
        otherUser: user,
        lastMessage: null
      };
      
      onSelectUser(newConversation);
    } catch (err) {
      console.error('Error starting conversation:', err);
      if (err instanceof FirebaseError && err.code === 'permission-denied') {
        setError('Permission denied. Please check your access rights.');
      } else if (err instanceof FirebaseError && err.message.includes('index')) {
        setError('Database index required. Please contact the administrator.');
      } else {
        setError('Failed to start conversation. Please try again.');
      }
    }
  };
  
  const getInitials = (username: string | undefined | null): string => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };
  
  return (
    <SearchContainer>
      <SearchInputWrapper $theme={currentUser ? 'light' : 'dark'}>
        <SearchIcon $theme={currentUser ? 'light' : 'dark'}>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          $theme={currentUser ? 'light' : 'dark'}
        />
      </SearchInputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingSpinner>Searching...</LoadingSpinner>
      ) : users.length > 0 ? (
        <UserList>
          {users.map(user => (
            <UserItem key={user.id} onClick={() => handleUserClick(user)}>
              <UserAvatar $imageUrl={user.profilePicture}>
                {!user.profilePicture && getInitials(user.username)}
              </UserAvatar>
              <UserInfo>
                <Username>{user.username || 'Unknown User'}</Username>
                <Email>{user.email || 'No email'}</Email>
              </UserInfo>
            </UserItem>
          ))}
        </UserList>
      ) : searchTerm.trim() !== '' ? (
        <NoResults>No users found</NoResults>
      ) : null}
    </SearchContainer>
  );
};

export default UserSearch; 