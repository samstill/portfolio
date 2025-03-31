import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  
  // Redirect to the other routing system's chat page
  useEffect(() => {
    // Redirect to the corresponding route in the other routing system
    window.location.href = `/messenger/chat/${conversationId}`;
    // Alternative: navigate(`/messenger/chat/${conversationId}`);
  }, [conversationId]);
  
  // Return an empty div (this won't be seen due to the redirect)
  return null;
};

export default Chat; 