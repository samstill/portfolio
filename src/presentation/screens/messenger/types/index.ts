export type ThemeMode = 'light' | 'dark';

export interface UserData {
  name: string | null;
  photoURL: string | null;
  initial: string;
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  otherUser?: {
    email?: string;
    photoURL?: string;
    profilePicture?: string;
    isOnline?: boolean;
  };
}

export interface MessengerContextType {
  updateOtherUserName: (name: string, photoURL?: string, isOnline?: boolean, email?: string) => void;
  theme: ThemeMode;
}

export interface MessengerLayoutProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  activeTab: 'conversations' | 'search';
  setActiveTab: (tab: 'conversations' | 'search') => void;
  otherUserData: UserData;
  isMobile: boolean;
  conversationId?: string;
  handleBackToList: () => void;
  navigateToEvents: () => void;
  handleSelectConversation: (conversation: Conversation) => void;
  handleSelectUser: (user: any) => void;
  children: React.ReactNode;
} 