import React from 'react';
import OriginalMessagesScreen from '../../screens/MessagesScreen';

const MessagesScreen: React.FC = () => {
  // We're just passing through to the original implementation to avoid duplicating code
  return <OriginalMessagesScreen />;
};

export default MessagesScreen; 