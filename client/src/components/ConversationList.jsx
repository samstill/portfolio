import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ConversationList.css';

const ConversationList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/conversations', {
          headers: { Authorization: `Bearer ${loggedInUser.token}` }
        });
        
        // Fetch the latest message and user details for each conversation
        const conversationsWithDetails = await Promise.all(
          response.data.map(async (conversation) => {
            // Get the other user in the conversation
            const otherUserId = conversation.participants.find(
              id => id !== loggedInUser.id
            );
            
            // Get user details
            const userResponse = await axios.get(`/api/users/${otherUserId}`, {
              headers: { Authorization: `Bearer ${loggedInUser.token}` }
            });
            
            // Get latest message
            const messagesResponse = await axios.get(`/api/messages/${conversation._id}/latest`, {
              headers: { Authorization: `Bearer ${loggedInUser.token}` }
            });
            
            // Decrypt message if possible
            let latestMessagePreview = 'No messages yet';
            
            if (messagesResponse.data) {
              try {
                const storedKey = localStorage.getItem(`aesKey_${conversation._id}`);
                if (storedKey) {
                  const { decryptMessage } = await import('../utils/encryption');
                  const decryptedContent = await decryptMessage(
                    messagesResponse.data.encryptedContent,
                    JSON.parse(storedKey)
                  );
                  
                  // Create a preview of the message content
                  latestMessagePreview = decryptedContent.text 
                    ? decryptedContent.text.substring(0, 30) + (decryptedContent.text.length > 30 ? '...' : '')
                    : decryptedContent.fileType ? `[${decryptedContent.fileType.toUpperCase()}]` : 'Message';
                } else {
                  latestMessagePreview = 'Encrypted message';
                }
              } catch (err) {
                console.error('Error decrypting message:', err);
                latestMessagePreview = 'Encrypted message';
              }
            }
            
            return {
              ...conversation,
              otherUser: userResponse.data,
              latestMessagePreview,
              timestamp: messagesResponse.data ? messagesResponse.data.createdAt : conversation.updatedAt
            };
          })
        );
        
        // Sort by latest message
        const sortedConversations = conversationsWithDetails.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setConversations(sortedConversations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up polling to check for new messages every 30 seconds
    const intervalId = setInterval(fetchConversations, 30000);
    
    return () => clearInterval(intervalId);
  }, [loggedInUser.id, loggedInUser.token]);

  if (loading) {
    return <div className="loading">Loading conversations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="no-conversations">
        <p>No conversations yet</p>
        <button 
          onClick={() => navigate('/messenger')}
          className="start-conversation-button"
        >
          Start a new conversation
        </button>
      </div>
    );
  }

  return (
    <div className="conversations-list">
      {conversations.map(conversation => (
        <div 
          key={conversation._id}
          className={`conversation-item ${conversationId === conversation._id ? 'active' : ''}`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="conversation-avatar">
            {conversation.otherUser.profilePicture ? (
              <img 
                src={conversation.otherUser.profilePicture} 
                alt={conversation.otherUser.username} 
              />
            ) : (
              <div className="avatar-placeholder">
                {conversation.otherUser.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="conversation-details">
            <div className="conversation-header">
              <span className="conversation-username">
                {conversation.otherUser.username}
              </span>
              <span className="conversation-time">
                {formatTimestamp(conversation.timestamp)}
              </span>
            </div>
            
            <div className="conversation-preview">
              {conversation.latestMessagePreview}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If today, show time only
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If this year, show month and day
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Otherwise show the full date
  return date.toLocaleDateString();
};

export default ConversationList; 