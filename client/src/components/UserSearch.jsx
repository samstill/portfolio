import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserSearch.css';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(`/api/users/search?query=${searchTerm}`, {
          headers: { Authorization: `Bearer ${loggedInUser.token}` }
        });
        
        // Filter out the current user
        const filteredResults = response.data.filter(user => user._id !== loggedInUser.id);
        setSearchResults(filteredResults);
        setLoading(false);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Failed to search users');
        setLoading(false);
      }
    };
    
    // Use debounce to avoid too many requests
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, loggedInUser.id, loggedInUser.token]);
  
  const handleUserClick = async (user) => {
    try {
      // Check if conversation already exists
      const response = await axios.get(`/api/conversations/find/${loggedInUser.id}/${user._id}`, {
        headers: { Authorization: `Bearer ${loggedInUser.token}` }
      });
      
      if (response.data) {
        // Conversation exists, navigate to it
        navigate(`/chat/${response.data._id}`);
      } else {
        // Create new conversation
        const newConversation = await axios.post('/api/conversations', {
          receiverId: user._id
        }, {
          headers: { Authorization: `Bearer ${loggedInUser.token}` }
        });
        
        // Initialize encryption for this conversation
        const { initializeConversation } = await import('../utils/encryption');
        const { aesKey, encryptedKey } = await initializeConversation(user.publicKey);
        
        // Store AES key locally
        localStorage.setItem(`aesKey_${newConversation.data._id}`, JSON.stringify(aesKey));
        
        // Send encrypted key to recipient
        await axios.post('/api/messages/key', {
          conversationId: newConversation.data._id,
          recipientId: user._id,
          encryptedKey
        }, {
          headers: { Authorization: `Bearer ${loggedInUser.token}` }
        });
        
        // Navigate to new conversation
        navigate(`/chat/${newConversation.data._id}`);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation');
    }
  };
  
  return (
    <div className="user-search">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {loading && <div className="search-loading">Searching...</div>}
      
      {error && <div className="search-error">{error}</div>}
      
      {searchResults.length > 0 ? (
        <ul className="search-results">
          {searchResults.map(user => (
            <li 
              key={user._id} 
              className="search-result-item"
              onClick={() => handleUserClick(user)}
            >
              <div className="user-avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <div className="username">{user.username}</div>
                <div className="email">{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : searchTerm.trim() !== '' && !loading ? (
        <div className="no-results">No users found</div>
      ) : null}
    </div>
  );
};

export default UserSearch; 