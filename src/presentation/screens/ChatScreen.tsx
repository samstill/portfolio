import React, { useState, useEffect, useRef } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { useAuth } from '../../shared/context/AuthContext';
import { 
  FaLock, FaPaperPlane, FaExclamationTriangle, 
  FaSpinner, FaCheck, FaCheckDouble, 
  FaPlus, FaCamera, FaImage, FaFile, FaVideo, FaTimes,
  FaArrowLeft, FaMoon, FaSun
} from 'react-icons/fa';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL
} from 'firebase/storage';
import { getFileType, formatFileSize } from '../../shared/utils/fileUtils';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
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
    shadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(255, 255, 255, 0.8)'
  },
  dark: {
    background: 'rgba(25, 28, 39, 0.8)',
    backgroundSecondary: 'rgba(32, 36, 48, 0.7)',
    text: '#e1e5ee',
    textSecondary: '#a8b0c5',
    primary: '#6e8efb',
    border: 'rgba(65, 70, 90, 0.6)',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(42, 46, 60, 0.8)'
  }
};

// Context type
interface ChatOutletContext {
  updateOtherUserName: (name: string, image?: string, isOnline?: boolean, email?: string) => void;
  theme: 'light' | 'dark';
}

// Basic message type
interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
  read?: boolean;
  file?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    contentType: string;
  };
}

// New chat header component
const ChatHeader = styled.div<{ $theme: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: ${props => themeColors[props.$theme].background};
  border-bottom: 1px solid ${props => themeColors[props.$theme].border};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  width: 100%;
  box-sizing: border-box;
  height: 60px;
  backdrop-filter: blur(8px);
  box-shadow: ${props => themeColors[props.$theme].shadow};

  @media (max-width: 768px) {
    display: none; /* Hide the header on mobile devices */
  }
`;

const BackButton = styled.button<{ $theme: 'light' | 'dark' }>`
  background: none;
  border: none;
  color: ${props => themeColors[props.$theme].text};
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.div<{ $theme: 'light' | 'dark' }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #6e8efb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div<{ $theme: 'light' | 'dark' }>`
  font-weight: 600;
  color: ${props => themeColors[props.$theme].text};
  font-size: 16px;
`;

const EncryptionIndicator = styled.div<{ $theme: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${props => themeColors[props.$theme].textSecondary};
  
  svg {
    margin-right: 5px;
    color: ${props => themeColors[props.$theme].primary};
  }
`;

// Styled components
const ChatContainer = styled.div<{ $theme?: 'light' | 'dark' }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  flex: 1;
  overflow: hidden; /* Prevent any overflow issues */
  max-width: 100%; /* Ensure content doesn't extend beyond container */
  width: 100%; /* Take full width */
  box-sizing: border-box; /* Include padding in width calculation */
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: ${props => props.$theme === 'light' 
      ? 'rgba(248, 250, 252, 0.9)' 
      : 'rgba(28, 31, 42, 0.9)'};
  }
`;

const MessagesContainer = styled.div<{ $theme: 'light' | 'dark' }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  padding: 20px;
  padding-top: 80px; /* Add extra padding at top to account for fixed header */
  padding-bottom: 90px; /* Add extra padding at bottom to account for fixed input container */
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(248, 250, 252, 0.5)' 
    : 'rgba(28, 31, 42, 0.5)'};
  height: 100%; /* Take full height, padding will account for fixed elements */
  width: 100%; /* Take full width */
  scroll-behavior: smooth; /* Add smooth scrolling for all scroll actions */
  max-width: 100%; /* Ensure content doesn't overflow horizontally */
  box-sizing: border-box; /* Include padding in width calculation */
  margin: 0;
  
  /* Custom Scrollbar Styling */
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: ${props => props.$theme === 'light' 
    ? 'rgba(180, 190, 210, 0.7) rgba(240, 242, 245, 0.6)' 
    : 'rgba(80, 90, 110, 0.7) rgba(40, 44, 52, 0.6)'}; /* For Firefox */
  
  /* Only show scrollbar on hover for a cleaner look */
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
    opacity: 0.2;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.$theme === 'light' 
      ? 'rgba(240, 242, 245, 0.6)' 
      : 'rgba(40, 44, 52, 0.6)'};
    border-radius: 10px;
    margin: 4px 0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$theme === 'light' 
      ? 'rgba(180, 190, 210, 0.7)' 
      : 'rgba(80, 90, 110, 0.7)'};
    border-radius: 10px;
    transition: background 0.3s ease;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.$theme === 'light' 
      ? 'rgba(150, 160, 180, 0.9)' 
      : 'rgba(100, 110, 130, 0.9)'};
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  /* Hide scrollbar when not needed (but keep functionality) */
  &::-webkit-scrollbar-thumb:vertical {
    min-height: 30px;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: 15px; /* Reset padding on mobile since header is hidden */
    padding-bottom: 80px; /* Add extra padding at bottom for mobile */
    height: 100%; /* Take full height */
  }
`;

const MessageWrapper = styled.div<{ $isMine: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isMine ? 'flex-end' : 'flex-start'};
  margin-bottom: 12px;
  max-width: 100%;
  box-sizing: border-box;
`;

const MessageBubble = styled.div<{ $isMine: boolean; $theme: 'light' | 'dark' }>`
  max-width: 70%;
  padding: 10px 16px;
  border-radius: 18px;
  background-color: ${props => props.$isMine 
    ? themeColors[props.$theme].bubbleMine 
    : themeColors[props.$theme].bubbleOther};
  color: ${props => props.$isMine 
    ? 'white' 
    : props.$theme === 'light' ? '#1a1b25' : '#e1e5ee'};
  box-shadow: ${props => themeColors[props.$theme].shadow};
  word-break: break-word; /* Break long words */
  white-space: pre-wrap; /* Preserve line breaks but wrap text */
  overflow-wrap: break-word; /* Ensure long words don't overflow */
  hyphens: auto; /* Allow hyphenation */
  box-sizing: border-box;
  margin: 0;
  
  @media (max-width: 480px) {
    max-width: 85%;
  }
`;

const MessageTime = styled.div<{ $isMine: boolean; $theme: 'light' | 'dark' }>`
  font-size: 0.7rem;
  margin-top: 4px;
  color: ${props => props.$theme === 'light' ? '#999' : '#a8b0c5'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LoadingContainer = styled.div<{ $theme: 'light' | 'dark' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  color: ${props => themeColors[props.$theme].textSecondary};
  
  svg {
    margin-bottom: 16px;
    color: ${props => themeColors[props.$theme].primary};
    animation: ${pulseAnimation} 1.5s ease infinite;
  }
`;

const InputContainer = styled.div<{ $theme: 'light' | 'dark' }>`
  padding: 16px;
  background-color: ${props => themeColors[props.$theme].background};
  border-top: 1px solid ${props => themeColors[props.$theme].border};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 20;
  backdrop-filter: blur(8px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  margin: 0;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const InputWrapper = styled.div<{ $theme: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  background-color: ${props => themeColors[props.$theme].backgroundSecondary};
  border-radius: 24px;
  padding: 0 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const MessageInput = styled.input<{ $theme: 'light' | 'dark' }>`
  flex: 1;
  border: none;
  padding: 12px;
  background: transparent;
  color: ${props => themeColors[props.$theme].text};
  font-size: 0.95rem;
  outline: none;
  
  &::placeholder {
    color: ${props => props.$theme === 'light' ? '#aaa' : '#777'};
  }
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const UploadButton = styled.button<{ $theme: 'light' | 'dark' }>`
  background: none;
  border: none;
  color: ${props => themeColors[props.$theme].primary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.$theme === 'light' 
      ? 'rgba(74, 108, 247, 0.1)' 
      : 'rgba(110, 142, 251, 0.1)'};
  }
`;

const SendButton = styled.button<{ $theme: 'light' | 'dark' }>`
  background: none;
  border: none;
  color: ${props => themeColors[props.$theme].primary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.$theme === 'light' 
      ? 'rgba(74, 108, 247, 0.1)' 
      : 'rgba(110, 142, 251, 0.1)'};
  }
  
  &:disabled {
    color: ${props => props.$theme === 'light' ? '#ccc' : '#555'};
    cursor: default;
    
    &:hover {
      background-color: transparent;
    }
  }
`;

const FileWarning = styled.div<{ $theme: 'light' | 'dark' }>`
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(255, 250, 230, 0.9)' 
    : 'rgba(66, 60, 40, 0.9)'};
  color: ${props => props.$theme === 'light' ? '#856404' : '#ffd350'};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${fadeInOut} 5s ease forwards;
  max-width: 90%;
  text-align: center;
  
  svg {
    flex-shrink: 0;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// Define a basic upload menu
const UploadOptionsMenu = styled.div<{ $theme: 'light' | 'dark', $show: boolean }>`
  position: absolute;
  bottom: 70px;
  left: 16px;
  background-color: ${props => themeColors[props.$theme].background};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: ${props => (props.$show ? 'block' : 'none')};
  z-index: 100;
  width: 180px;
`;

const UploadOption = styled.button<{ $theme: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  color: ${props => themeColors[props.$theme].text};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.$theme === 'light' 
      ? 'rgba(0, 0, 0, 0.05)' 
      : 'rgba(255, 255, 255, 0.05)'};
  }
  
  svg {
    color: ${props => themeColors[props.$theme].primary};
  }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const FilePreviewContainer = styled.div<{ $theme: 'light' | 'dark' }>`
  margin-bottom: 16px;
  padding: 12px;
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(248, 250, 252, 0.8)' 
    : 'rgba(32, 36, 48, 0.8)'};
  border-radius: 12px;
  border: 1px solid ${props => themeColors[props.$theme].border};
  position: relative;
`;

const FilePreviewContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
`;

const FilePreviewInfo = styled.div<{ $theme: 'light' | 'dark' }>`
  flex: 1;
  min-width: 0;
  
  h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: ${props => themeColors[props.$theme].text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  span {
    font-size: 12px;
    color: ${props => themeColors[props.$theme].textSecondary};
  }
`;

const FilePreviewThumbnail = styled.div<{ $theme: 'light' | 'dark' }>`
  width: 60px;
  height: 60px;
  background: ${props => props.$theme === 'light' ? '#f0f2f5' : '#2d3748'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    font-size: 24px;
    color: ${props => themeColors[props.$theme].primary};
  }
`;

const RemoveFileButton = styled.button<{ $theme: 'light' | 'dark' }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${props => props.$theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
  color: ${props => props.$theme === 'light' ? '#333' : '#eee'};
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: ${props => props.$theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'};
  }
`;

const UploadProgressOverlay = styled.div<{ $theme: 'light' | 'dark' }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(28, 31, 42, 0.8)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
`;

const ProgressBarContainer = styled.div`
  width: 80%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 12px 0;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $progress: number; $theme: 'light' | 'dark' }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: ${props => themeColors[props.$theme].primary};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div<{ $theme: 'light' | 'dark' }>`
  color: ${props => themeColors[props.$theme].text};
  font-size: 14px;
  margin-top: 8px;
`;

// Add these styled components for document icons
const FileIcon = styled(FaFile)<{ $theme: 'light' | 'dark' }>`
  color: ${props => themeColors[props.$theme].primary};
  font-size: 24px;
`;

const VideoIcon = styled(FaVideo)<{ $theme: 'light' | 'dark' }>`
  color: ${props => themeColors[props.$theme].primary};
  font-size: 24px;
`;

const AudioIcon = styled(FaFile)<{ $theme: 'light' | 'dark' }>`
  color: ${props => themeColors[props.$theme].primary};
  font-size: 24px;
`;

// Update the file attachment styling
const FileAttachment = styled.div<{ $theme: 'light' | 'dark' }>`
  margin-top: 12px;
  padding: 8px 12px;
  background-color: ${props => props.$theme === 'light' 
    ? 'rgba(255, 255, 255, 0.7)' 
    : 'rgba(42, 46, 60, 0.7)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const FileAttachmentInfo = styled.div<{ $theme: 'light' | 'dark' }>`
  margin-left: 12px;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  
  .file-name {
    color: ${props => themeColors[props.$theme].text};
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  
  .file-size {
    color: ${props => themeColors[props.$theme].textSecondary};
    font-size: 12px;
  }
`;

const ChatScreen: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showFileWarning, setShowFileWarning] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | 'document' | 'other' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [otherUserName, setOtherUserName] = useState<string>('User');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { updateOtherUserName, theme } = useOutletContext<ChatOutletContext>();
  const navigate = useNavigate();
  
  // Device detection
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobileDevice(mobileRegex.test(userAgent));
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Fetch conversation and messages
  useEffect(() => {
    if (!currentUser || !conversationId) return;
    
    // Get conversation details
    const fetchConversationDetails = async () => {
      try {
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationSnap = await getDoc(conversationRef);
        
        if (!conversationSnap.exists()) {
          setError('Conversation not found');
          setLoading(false);
          return;
        }
        
        const conversationData = conversationSnap.data();
        
        // Get the other user's ID
        const otherUserId = Object.keys(conversationData.participants).find(
          (id: string) => id !== currentUser.uid
        );
        
        if (otherUserId) {
          const userRef = doc(db, 'users', otherUserId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const userName = userData.displayName || userData.email?.split('@')[0] || 'User';
            
            // Set for local use
            setOtherUserName(userName);
            
            // Pass username up to parent component
            updateOtherUserName(
              userName,
              userData.photoURL, 
              userData.isOnline,
              userData.email
            );
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation');
        setLoading(false);
      }
    };
    
    fetchConversationDetails();
    
    // Listen for messages in this conversation
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(fetchedMessages);
      
      // Scroll to bottom on new messages with smooth scrolling
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    
    return () => unsubscribe();
  }, [conversationId, currentUser, updateOtherUserName]);
  
  // Basic file upload handlers
  const openFilePicker = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowUploadOptions(false);
  };
  
  const openCamera = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
    setShowUploadOptions(false);
  };
  
  const openGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
    setShowUploadOptions(false);
  };
  
  const openWebcam = (e: React.MouseEvent) => {
    e.preventDefault();
    // This is a placeholder for webcam functionality
    alert('Webcam functionality would be implemented here');
    setShowUploadOptions(false);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size (5GB max)
    const MAX_SIZE = 5 * 1024 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`File is too large. Maximum size is 5GB.`);
      return;
    }
    
    // Set the selected file
    setSelectedFile(file);
    
    // Determine file type
    const type = getFileType(file);
    setFileType(type);
    
    // Generate preview URL for images, videos, and audio
    if (type === 'image' || type === 'video' || type === 'audio') {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
    
    // Show file warning
    setShowFileWarning(true);
    setTimeout(() => setShowFileWarning(false), 5000);
    
    // Hide upload options
    setShowUploadOptions(false);
  };
  
  const removeSelectedFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setFileType(null);
  };
  
  const sendTextMessage = async (text: string) => {
    if (!currentUser || !conversationId) return;
    
    try {
      // Add message to Firestore
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: currentUser.uid,
        text,
        createdAt: serverTimestamp(),
        read: false
      });
      
      // Update conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: text || "Sent a message",
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error sending text message:', error);
      return false;
    }
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newMessage.trim() && !selectedFile) {
      return;
    }
    
    if (!currentUser || !conversationId) {
      console.error('User not authenticated or conversation ID missing');
      return;
    }
    
    try {
      let fileAttachment = null;
      
      // Upload file if one is selected
      if (selectedFile) {
        try {
          setIsUploading(true);
          setUploadProgress(0);
          
          // Calculate expiration time (24 hours from now)
          const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
          
          // Create a unique ID for this message to link storage and firestore
          const messageId = Date.now().toString();
          
          // Create storage reference
          const storageRef = ref(storage, `chat_files/${conversationId}/${messageId}_${selectedFile.name}`);
          
          // Set metadata including expiration
          const metadata = {
            customMetadata: {
              expiresAt: expiresAt.toString(),
              conversationId,
              messageId,
              uploadedBy: currentUser.uid
            }
          };
          
          // Upload file with metadata
          const uploadTask = uploadBytesResumable(storageRef, selectedFile, metadata);
          
          // Wait for upload to complete
          await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                console.log(`Upload progress: ${progress}%`);
              },
              (error) => {
                console.error('Upload error:', error);
                setIsUploading(false);
                resolve(); // Resolve anyway to continue sending the message
              },
              async () => {
                try {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  
                  fileAttachment = {
                    url: downloadURL,
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                    fileSize: selectedFile.size,
                    contentType: fileType || 'other',
                    expiresAt: expiresAt // Add expiration time to file data
                  };
                  
                  setIsUploading(false);
                  resolve();
                } catch (error) {
                  console.error('Error getting download URL:', error);
                  setIsUploading(false);
                  resolve(); // Resolve anyway to continue sending the message
                }
              }
            );
          });
        } catch (error) {
          console.error('Error uploading file:', error);
          setIsUploading(false);
          
          // If there's text, send it anyway
          if (newMessage.trim()) {
            const sent = await sendTextMessage(newMessage);
            if (sent) {
              setNewMessage('');
              removeSelectedFile();
              return; // Exit function after successful text message
            }
          }
          
          // Show error to user
          alert("Failed to upload file. Please try again or send text only.");
        }
      }
      
      // Send message regardless of whether file upload succeeded
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: currentUser.uid,
        text: newMessage,
        createdAt: serverTimestamp(),
        read: false,
        ...(fileAttachment && { file: fileAttachment })
      });
      
      // Update conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: fileAttachment 
          ? `Sent a ${fileAttachment.contentType}: ${fileAttachment.fileName}` 
          : newMessage || "Sent a message",
        updatedAt: serverTimestamp()
      });
      
      // Reset state
      setNewMessage('');
      removeSelectedFile();
      
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert("Failed to send message. Please try again.");
    }
  };
  
  // Format message time
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <LoadingContainer $theme={theme}>
        <SpinnerIcon />
        <div>Loading conversation...</div>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <LoadingContainer $theme={theme}>
        <FaExclamationTriangle size={24} />
        <div>{error}</div>
      </LoadingContainer>
    );
  }
  
  const handleBackClick = () => {
    navigate('/messenger');
  };
  
  return (
    <ChatContainer $theme={theme}>
      <ChatHeader $theme={theme}>
        <BackButton $theme={theme} onClick={handleBackClick}>
          <FaArrowLeft />
        </BackButton>
        <UserAvatar $theme={theme}>
          {otherUserName.charAt(0).toUpperCase()}
        </UserAvatar>
        <UserInfo>
          <UserName $theme={theme}>{otherUserName}</UserName>
          <EncryptionIndicator $theme={theme}>
            <FaLock /> End-to-End Encrypted
          </EncryptionIndicator>
        </UserInfo>
      </ChatHeader>
      
      <MessagesContainer $theme={theme}>
        {messages.map(message => (
          <MessageWrapper 
            key={message.id} 
            $isMine={message.senderId === currentUser?.uid}
          >
            <MessageBubble 
              $isMine={message.senderId === currentUser?.uid} 
              $theme={theme}
            >
              {message.text}
              
              {/* Display file attachments if any */}
              {message.file && (
                <FileAttachment $theme={theme}>
                  {message.file.contentType === 'image' ? (
                    <a href={message.file.url} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                      <img 
                        src={message.file.url} 
                        alt={message.file.fileName} 
                        style={{ width: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                      />
                    </a>
                  ) : message.file.contentType === 'video' ? (
                    <a 
                      href={message.file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ width: '100%', display: 'flex', alignItems: 'center' }}
                    >
                      <VideoIcon $theme={theme} />
                      <FileAttachmentInfo $theme={theme}>
                        <div className="file-name">{message.file.fileName}</div>
                        <div className="file-size">{formatFileSize(message.file.fileSize)}</div>
                      </FileAttachmentInfo>
                    </a>
                  ) : (
                    <a 
                      href={message.file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                    >
                      <FileIcon $theme={theme} />
                      <FileAttachmentInfo $theme={theme}>
                        <div className="file-name">{message.file.fileName}</div>
                        <div className="file-size">{formatFileSize(message.file.fileSize)}</div>
                      </FileAttachmentInfo>
                    </a>
                  )}
                </FileAttachment>
              )}
            </MessageBubble>
            
            <MessageTime 
              $isMine={message.senderId === currentUser?.uid}
              $theme={theme}
            >
              {message.createdAt && formatTime(message.createdAt)}
            </MessageTime>
          </MessageWrapper>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      {selectedFile && (
        <FilePreviewContainer $theme={theme}>
          <FilePreviewContent>
            <FilePreviewThumbnail $theme={theme}>
              {fileType === 'image' && filePreviewUrl ? (
                <img src={filePreviewUrl} alt="Preview" />
              ) : fileType === 'video' ? (
                <VideoIcon $theme={theme} />
              ) : fileType === 'audio' ? (
                <AudioIcon $theme={theme} />
              ) : fileType === 'document' ? (
                <FileIcon $theme={theme} />
              ) : (
                <FileIcon $theme={theme} />
              )}
            </FilePreviewThumbnail>
            
            <FilePreviewInfo $theme={theme}>
              <h4>{selectedFile.name}</h4>
              <span>{formatFileSize(selectedFile.size)}</span>
            </FilePreviewInfo>
          </FilePreviewContent>
          
          {!isUploading && (
            <RemoveFileButton $theme={theme} onClick={removeSelectedFile}>
              <FaTimes />
            </RemoveFileButton>
          )}
          
          {isUploading && (
            <UploadProgressOverlay $theme={theme}>
              <SpinnerIcon />
              <ProgressBarContainer>
                <ProgressBar $progress={uploadProgress} $theme={theme} />
              </ProgressBarContainer>
              <ProgressText $theme={theme}>
                Uploading: {Math.round(uploadProgress)}%
              </ProgressText>
            </UploadProgressOverlay>
          )}
        </FilePreviewContainer>
      )}
      
      <form onSubmit={handleSendMessage}>
        <InputContainer $theme={theme}>
          {showFileWarning && (
            <FileWarning $theme={theme}>
              <FaExclamationTriangle />
              Uploaded files will be deleted from the server after 24 hours
            </FileWarning>
          )}
          
          <InputWrapper $theme={theme}>
            <UploadButton 
              $theme={theme} 
              onClick={(e) => {
                e.preventDefault();
                setShowUploadOptions(!showUploadOptions);
              }}
              type="button"
            >
              <FaPlus />
            </UploadButton>
            
            <MessageInput
              $theme={theme}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            
            <SendButton 
              $theme={theme} 
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }} 
              disabled={!newMessage.trim() && !selectedFile}
              type="button"
            >
              <FaPaperPlane />
            </SendButton>
          </InputWrapper>
          
          <UploadOptionsMenu $theme={theme} $show={showUploadOptions}>
            {isMobileDevice ? (
              <>
                <UploadOption $theme={theme} onClick={openCamera}>
                  <FaCamera /> Take Photo
                </UploadOption>
                <UploadOption $theme={theme} onClick={openGallery}>
                  <FaImage /> Photo Library
                </UploadOption>
                <UploadOption $theme={theme} onClick={openFilePicker}>
                  <FaFile /> Browse Files
                </UploadOption>
              </>
            ) : (
              <>
                <UploadOption $theme={theme} onClick={openFilePicker}>
                  <FaFile /> Upload Files
                </UploadOption>
                <UploadOption $theme={theme} onClick={openGallery}>
                  <FaImage /> Upload Images
                </UploadOption>
                <UploadOption $theme={theme} onClick={openWebcam}>
                  <FaCamera /> Use Webcam
                </UploadOption>
              </>
            )}
          </UploadOptionsMenu>
          
          <HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="*/*"
          />
          <HiddenFileInput
            type="file"
            ref={cameraInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment"
          />
          <HiddenFileInput
            type="file"
            ref={galleryInputRef}
            onChange={handleFileSelect}
            accept="image/*"
          />
        </InputContainer>
      </form>
    </ChatContainer>
  );
};

export default ChatScreen; 