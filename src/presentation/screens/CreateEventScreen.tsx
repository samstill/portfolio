/// <reference types="vite/client" />

import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMap, FiSave, FiX, FiType, FiList, FiZap, FiArrowLeft, FiMinimize2, FiMessageCircle, FiInfo, FiChevronDown, FiAlertCircle, FiUsers, FiAlignLeft, FiEye, FiLoader, FiSend } from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';
import { eventService } from '../../firebase/services/eventService';
import ReactMarkdown from 'react-markdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
// import { SlashCommandMenu } from '../../presentation/components/markdown/SlashCommandMenu';
import { useAI } from '../../shared/contexts/AIContext';

// Add this interface to properly type the AI response
interface DeepseekResponse {
  id: string;
  choices: [{
    text: string;
    event: {
      title: string;
      description: string;
      location: string;
      price: number;
      totalTickets: number;
      suggestedDate?: string;
    };
  }];
}

// Add these interfaces after the existing DeepseekResponse interface
interface AIModel {
  id: string;
  name: string;
  provider: 'deepseek' | 'google';
  model: string;
}

const AI_MODELS: AIModel[] = [
  { id: 'deepseek-chat', name: 'Deepseek Chat', provider: 'deepseek', model: 'deepseek-chat' },
  { id: 'gemini-pro', name: 'Google Gemini Pro', provider: 'google', model: 'gemini-pro' },
];

const Container = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  background: ${props => props.theme.background};
  display: flex;
  justify-content: center;
`;

const CreateEventCard = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  display: flex;
  gap: 32px;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const FormSection = styled(motion.div)`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AISection = styled(motion.div)`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 968px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: ${props => props.theme.text};
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const Label = styled.label`
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 0.85rem;
    opacity: 0.7;
    font-weight: normal;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.text}60;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => {
    switch (props.$variant) {
      case 'primary':
        return 'linear-gradient(135deg, #6e8efb, #4a6cf7)';
      case 'danger':
        return 'linear-gradient(135deg, #ff6b6b, #ff4757)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${props => 
      props.$variant === 'danger' 
        ? 'rgba(255, 71, 87, 0.4)'
        : 'rgba(74, 108, 247, 0.4)'
    };
  }
`;

const PriceInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const RupeeSymbol = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text};
  opacity: 0.8;
  font-size: 1rem;
  pointer-events: none;
`;

const PriceInput = styled(Input)`
  padding-left: 32px; // Make space for the rupee symbol
`;

const PriceTicketsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.2);
  border-radius: 12px;
  color: #ff4757;
  margin-bottom: 20px;
  font-size: 0.95rem;
`;

const SaveButton = styled(Button).attrs({ $variant: 'primary' })`
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
`;

const CancelButton = styled(Button).attrs({ $variant: 'danger' })`
  padding: 12px 24px;
`;

const MarkdownEditor = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:focus-within {
    border-color: #4a6cf7;
    box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
  }
`;

const EditorTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 16px;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.text}60;
  }
`;

const MarkdownPreview = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  color: ${props => props.theme.text};
  min-height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: ${props => props.theme.text};
  }

  p {
    margin-bottom: 1em;
    line-height: 1.6;
  }

  ul, ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
  }

  a {
    color: #4a6cf7;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  blockquote {
    border-left: 4px solid #4a6cf7;
    padding-left: 1em;
    margin-left: 0;
    color: ${props => props.theme.text}CC;
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
  }

  pre {
    background: rgba(255, 255, 255, 0.1);
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    
    code {
      background: none;
      padding: 0;
    }
  }
`;

const PreviewSection = styled(motion.div)`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PreviewTitle = styled.h2`
  font-size: 1.25rem;
  color: ${props => props.theme.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabsContainer = styled(Tabs)`
  .react-tabs__tab-list {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 15px;
  }

  .react-tabs__tab {
    color: ${props => props.theme.text}CC;
    border: none;
    padding: 8px 16px;
    
    &--selected {
      background: rgba(255, 255, 255, 0.1);
      color: ${props => props.theme.text};
      border-radius: 8px 8px 0 0;
    }
  }
`;

const AIContainer = styled(motion.div)`
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;

  @media (max-width: 768px) {
    right: 15px;
    top: 15px;
  }
`;

const AIPromptInputExpanded = styled(motion.input)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 50px 12px 45px; // Adjusted padding for both icons
  color: ${props => props.theme.text};
  font-size: 1rem;
  width: 400px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }

  &::placeholder {
    color: ${props => props.theme.text}80;
  }

  @media (max-width: 768px) {
    width: 240px;
    font-size: 0.9rem;
    padding: 10px 40px 10px 35px;
  }

  @media (max-width: 480px) {
    width: 180px;
    font-size: 0.85rem;
  }
`;

const AIMagicButton = styled(motion.button)<{ $isExpanded?: boolean }>`
  position: ${props => props.$isExpanded ? 'absolute' : 'relative'};
  right: ${props => props.$isExpanded ? '5px' : '0'};
  background: linear-gradient(135deg, #FF69B4, #9370DB);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 15px rgba(147, 112, 219, 0.4);
  z-index: 1;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const CollapseButton = styled(motion.button)`
  position: absolute;
  left: 5px; // Position it to the left of the input
  background: none;
  border: none;
  color: ${props => props.theme.text}80;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${props => props.theme.text};
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const AIPreviewCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
`;

const AIPromptContainer = styled(motion.div)<{ $isVisible: boolean }>`
  position: relative;
  width: 100%;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  align-items: center;
  gap: 20px;
  flex-direction: row;
  margin-top: auto;
`;

const AIPromptInput = styled(motion.input)`
  width: 100%;
  padding: 16px 48px 16px 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }

  &::placeholder {
    color: #6c757d;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 14px 40px 14px 16px;
  }
`;

const GenerateButton = styled(motion.button)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    transform: translateY(-50%);
    box-shadow: 0 4px 15px rgba(74, 108, 247, 0.4);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AIPreviewContent = styled(motion.div)`
  color: ${props => props.theme.text};
  
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin: 1em 0 0.5em;
    &:first-child { margin-top: 0; }
  }

  p { margin-bottom: 1em; }

  .meta-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    opacity: 0.8;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatWrapper = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  order: -1; // This moves it above the AI prompt
`;

const ChatContainer = styled(motion.div)`
  width: 100%;
  max-height: 500px;
  min-height: 100px; // Reduced minimum height
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
`;

const ChatHistory = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
  min-height: 100px; // Add minimum height
  max-height: 400px; // Add maximum height

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

type MessageType = 'ai' | 'user' | 'info';

interface MessageTimeProps {
  $type: Exclude<MessageType, 'info'>;
}

const MessageTime = styled.div<MessageTimeProps>`
  font-size: 0.7rem;
  color: ${props => props.theme.text}80;
  align-self: ${props => props.$type === 'user' ? 'flex-end' : 'flex-start'};
  margin: 0 4px 8px;
`;

const Message = styled.div<{ $type: MessageType }>`
  align-self: ${props => props.$type === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 85%;
  padding: 12px 16px;
  border-radius: ${props => props.$type === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0'};
  background: ${props => {
    switch (props.$type) {
      case 'user':
        return 'linear-gradient(135deg, #6e8efb, #4a6cf7)';
      case 'info':
        return 'rgba(255, 255, 255, 0.05)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => props.$type === 'user' ? 'white' : props.theme.text};
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 4px;

  strong {
    font-weight: 600;
    color: ${props => props.$type === 'user' ? 'white' : '#4a6cf7'};
    display: inline-block;
    margin: 8px 0 4px;
  }

  /* Style bullet points */
  ul {
    margin: 8px 0;
    padding-left: 8px;
    list-style: none;
  }

  li {
    margin: 4px 0;
    padding-left: 16px;
    position: relative;
    
    &:before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${props => props.$type === 'user' ? 'white' : '#4a6cf7'};
    }
  }

  /* Style sections */
  p {
    margin: 8px 0;
  }

  /* Style examples/scenarios */
  div.scenario {
    margin: 12px 0;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  /* Style inline examples */
  .example {
    opacity: 0.8;
    font-size: 0.9em;
    margin-left: 16px;
    display: block;
  }
`;

const MessageWrapper = styled.div<{ $type: MessageType }>`
  display: flex;
  flex-direction: column;
  align-self: ${props => props.$type === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 80%;
`;

const InputContainer = styled.div`
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.text}60;
  }
`;

const ChatSendButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
`;

const ChatBubble = styled.div<{ $type: string }>`
  align-self: ${props => props.$type === 'ai' ? 'flex-start' : 'flex-end'};
  background: ${props => props.$type === 'ai' ? '#eee' : '#6e8efb'};
  color: ${props => props.$type === 'ai' ? '#000' : '#fff'};
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
`;

const formatDate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - (offset*60*1000));
  return date.toISOString().slice(0, 16);
};

const formatMarkdownDescription = (description: string) => {
  // Ensure the description starts with a title
  if (!description.startsWith('#')) {
    description = `# Event Details\n\n${description}`;
  }

  // Add sections if they don't exist
  const sections = [
    '## Description',
    '## Highlights',
    '## Schedule',
    '## Additional Information'
  ];

  sections.forEach(section => {
    if (!description.includes(section)) {
      description += `\n\n${section}\n`;
    }
  });

  return description.trim();
};

const formatAIResponse = (text: string): string => {
  return text
    // Remove markdown bold syntax but keep the text bold using HTML
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Format bullet points
    .replace(/•\s*/g, '• ')
    
    // Clean up multiple line breaks
    .replace(/\n{3,}/g, '\n\n')
    
    // Format numbered lists (1., 2., etc.)
    .replace(/^\d+\.\s+/gm, (match) => `${match.trim()} `)
    
    // Format section headers
    .replace(/^(Scenario \d+:)/gm, '\n$1')
    
    // Remove any remaining markdown syntax
    .replace(/[_*`]/g, '')
    
    // Format parenthetical examples
    .replace(/\((e\.g\.,.*?)\)/g, '\n    $1')
    
    // Clean up any double spaces
    .replace(/\s{2,}/g, ' ')
    
    // Add proper spacing after colons
    .replace(/:\s*/g, ': ')
    
    // Format lists with proper indentation
    .replace(/^[-•]\s/gm, '  • ');
};

// Add at the top of the file, after other imports
interface ImportMetaEnv {
  VITE_GOOGLE_API_KEY: string;
  VITE_DEEPSEEK_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const CreateEventScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedModel } = useAI();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    totalTickets: '', // New field
  });
  const [error, setError] = useState<string>('');
  const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIExpanded, setIsAIExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    type: 'user' | 'ai' | 'info';
    content: string;
    timestamp?: string;
  }>>([
    {
      type: 'info',
      content: 'Welcome! I can help you create detailed events. Try describing your event with specific details like title, date, location, and any special features.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple form validation
    if (!formData.title || !formData.location || !formData.date) {
      setError('Please fill in all required fields.');
      return;
    }
    // Ensure date is in the future
    if (new Date(formData.date) <= new Date()) {
      setError('Please choose a future date for the event.');
      return;
    }
    setError('');

    try {
      // Clean up any trailing slash commands before submitting
      const cleanDescription = formData.description.replace(/\/[^\n]*$/, '').trim();
      
      await eventService.createEvent(formData);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateWithAI = async (prompt: string) => {
    if (selectedModel.provider === 'google') {
      return await generateWithGoogle(prompt);
    }
    return await generateWithDeepseek(prompt);
  };

  // Updated generateWithGoogle function:
  async function generateWithGoogle(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || response.statusText);
      }

      const data = await response.json();
      // Extract the text content from Gemini's response
      return data.candidates[0]?.content?.parts?.[0]?.text || 'No response from AI';
    } catch (error: any) {
      console.error("Google API error details:", error);
      throw error;
    }
  }

  // Update generateWithDeepseek similarly to log error details
  async function generateWithDeepseek(prompt: string): Promise<string> {
    try {
      // Limit the chat history to last 10 messages to prevent context overflow
      const recentMessages = chatMessages.slice(-10);
      
      // Create messages array with filtered conversation history
      const messages = [
        {
          role: 'system',
          content: `You are an event planning assistant. Always respond with a complete JSON object in this exact format, and nothing else before or after the JSON:
          {
            "title": "Event Title",
            "description": "Detailed markdown description with sections",
            "location": "Venue with full address",
            "price": number,
            "totalTickets": number,
            "suggestedDate": "YYYY-MM-DDTHH:mm"
          }
          
          For follow-up questions and modifications:
          1. Maintain context from previous messages
          2. Update only the fields that are relevant to the user's request
          3. Keep other fields unchanged from the previous state
          4. Always return the complete event object with all fields
          5. Keep the response concise and within token limits`
        },
        // Add current form state as context
        {
          role: 'system',
          content: `Current event state: ${JSON.stringify({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            price: parseFloat(formData.price) || 0,
            totalTickets: parseInt(formData.totalTickets) || 0,
            suggestedDate: formData.date
          })}`
        },
        // Add filtered previous messages for context
        ...recentMessages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.type === 'user' ? msg.content : 
            // For assistant messages, try to extract only the relevant parts
            msg.content.includes('Event Updated Successfully') ? 
              msg.content.split('Changes made:')[1]?.split('\n').slice(0, -1).join('\n') || msg.content : 
              msg.content
        })),
        {
          role: 'user',
          content: `${prompt}\nRespond only with the JSON object, no additional text.`
        }
      ];

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || response.statusText);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      // Clean up the response to ensure valid JSON
      const cleanedContent = content.trim()
        .replace(/^```json\s*/, '') // Remove leading JSON code block markers
        .replace(/\s*```$/, '')     // Remove trailing code block markers
        .replace(/^\s*\{/, '{')     // Ensure clean opening brace
        .replace(/\}\s*$/, '}');    // Ensure clean closing brace

      // Validate JSON structure
      try {
        JSON.parse(cleanedContent);
        return cleanedContent;
      } catch (parseError) {
        // If parsing fails, try to extract JSON using regex
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return jsonMatch[0];
        }
        throw new Error('Invalid JSON response from API');
      }
    } catch (error: any) {
      console.error("Deepseek API error details:", error);
      throw error;
    }
  }

  const generateEventWithAI = async () => {
    if (!aiPrompt.trim()) {
      setError('Please provide a description for the event');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateWithAI(aiPrompt);
      
      // Add the user's prompt to chat
      setChatMessages(prev => [...prev, {
        type: 'user',
        content: aiPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const eventData = JSON.parse(jsonMatch[0]);
          
          // Update form fields
          setFormData({
            title: eventData.title || '',
            description: eventData.description || '',
            date: eventData.suggestedDate || '',
            location: eventData.location || '',
            price: String(eventData.price || '0'),
            totalTickets: String(eventData.totalTickets || '100')
          });

          // Format the response message with better structure
          const formattedResponse = formatAIResponse(
            `✨ **Event Created Successfully!**\n\n` +
            `📌 **Title**\n${eventData.title}\n\n` +
            `📍 **Location**\n${eventData.location}\n\n` +
            `📅 **Date & Time**\n${new Date(eventData.suggestedDate).toLocaleString()}\n\n` +
            `💰 **Price**\n₹${eventData.price}\n\n` +
            `🎟️ **Total Tickets**\n${eventData.totalTickets}\n\n` +
            `📝 **Description**\n${eventData.description.substring(0, 150)}...\n\n` +
            `I've filled in all the details in the form. Feel free to review and adjust anything!`
          );

          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: formattedResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }

      setAIPrompt('');
      setIsChatOpen(true);
    } catch (error) {
      console.error('Generation error:', error);
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: error instanceof Error ? error.message : 'Failed to generate event',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setChatMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp 
    }]);

    try {
      setIsGenerating(true);
      const response = await generateWithAI(userMessage);
      
      try {
        const eventData = JSON.parse(response);
        
        // Store current form data for comparison
        const currentFormData = { ...formData };
        
        // Update form fields with new data while preserving existing values
        setFormData(prevData => ({
          title: eventData.title || prevData.title,
          description: eventData.description || prevData.description,
          date: eventData.suggestedDate || prevData.date,
          location: eventData.location || prevData.location,
          price: String(eventData.price || prevData.price),
          totalTickets: String(eventData.totalTickets || prevData.totalTickets)
        }));

        // Build changes array for better formatting
        const changes = [];
        if (eventData.title !== currentFormData.title) changes.push(`📌 **Title**: ${eventData.title}`);
        if (eventData.location !== currentFormData.location) changes.push(`📍 **Location**: ${eventData.location}`);
        if (eventData.suggestedDate !== currentFormData.date) changes.push(`📅 **Date & Time**: ${new Date(eventData.suggestedDate).toLocaleString()}`);
        if (String(eventData.price) !== currentFormData.price) changes.push(`💰 **Price**: ₹${eventData.price}`);
        if (String(eventData.totalTickets) !== currentFormData.totalTickets) changes.push(`🎟️ **Total Tickets**: ${eventData.totalTickets}`);
        if (eventData.description !== currentFormData.description) changes.push(`📝 **Description Update**: ${eventData.description.substring(0, 150)}...`);

        // Format the response message
        const formattedResponse = formatAIResponse(
          changes.length > 0 ?
            `✨ **Event Updated Successfully!**\n\nChanges made:\n${changes.join('\n')}\n\nAll changes have been applied to the form. Feel free to review and make any additional adjustments!` :
            `No changes were needed. The event details already match your request.`
        );

        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: formattedResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: 'I apologize, but I encountered an error processing the update. Please try rephrasing your request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error processing your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update the chat history rendering to use the new renderMessage function
  const renderMessage = (msg: { type: MessageType; content: string; timestamp?: string }, index: number) => (
    <MessageWrapper key={index} $type={msg.type}>
      <Message $type={msg.type} dangerouslySetInnerHTML={{ __html: msg.type === 'user' ? msg.content : formatAIResponse(msg.content) }} />
      {msg.type !== 'info' && msg.timestamp && (
        <MessageTime $type={msg.type}>
          {msg.timestamp}
        </MessageTime>
      )}
    </MessageWrapper>
  );

  return (
    <Container>
      <CreateEventCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Title>
            <FiCalendar size={24} />
            Create New Event
          </Title>

          <Form onSubmit={handleSubmit}>
            {error && (
              <ErrorMessage>
                <FiAlertCircle size={16} />
                {error}
              </ErrorMessage>
            )}
            
            <FormGroup>
              <Label htmlFor="title">
                <FiType size={16} />
                Event Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="date">
                <FiCalendar size={16} />
                Date & Time
              </Label>
              <Input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="location">
                <FiMap size={16} />
                Location
              </Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                required
              />
            </FormGroup>

            <PriceTicketsRow>
              <FormGroup>
                <Label>
                  <BiRupee size={16} />
                  Price
                </Label>
                <PriceInput
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="any"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FiUsers size={16} />
                  Total Tickets
                </Label>
                <Input
                  type="number"
                  name="totalTickets"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                  required
                />
              </FormGroup>
            </PriceTicketsRow>

            <FormGroup>
              <Label htmlFor="description">
                <FiAlignLeft size={16} />
                Description
                <span>(Markdown supported)</span>
              </Label>
              <MarkdownEditor>
                <EditorTextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write your event description here..."
                />
              </MarkdownEditor>
            </FormGroup>

            <ButtonGroup>
              <SaveButton
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSave size={18} />
                Save Event
              </SaveButton>
              <CancelButton
                type="button"
                onClick={() => navigate('/events')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiX size={18} />
                Cancel
              </CancelButton>
            </ButtonGroup>
          </Form>

          <PreviewSection>
            <PreviewTitle>
              <FiEye size={20} />
              Preview
            </PreviewTitle>
            <MarkdownPreview>
              <ReactMarkdown>{formData.description}</ReactMarkdown>
            </MarkdownPreview>
          </PreviewSection>
        </FormSection>

        <AISection>
          <AIPreviewCard>
            <AnimatePresence>
              {isChatOpen && (
                <ChatWrapper
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatContainer>
                    <ChatHistory ref={chatHistoryRef}>
                      {chatMessages.map((msg, index) => renderMessage(msg, index))}
                    </ChatHistory>
                    <InputContainer>
                      <ChatInput
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && chatInput.trim()) {
                            e.preventDefault();
                            handleChatSubmit();
                          }
                        }}
                      />
                      <Button
                        onClick={handleChatSubmit}
                        disabled={!chatInput.trim() || isGenerating}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isGenerating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <FiLoader size={18} />
                          </motion.div>
                        ) : (
                          <FiSend size={18} />
                        )}
                      </Button>
                    </InputContainer>
                  </ChatContainer>
                </ChatWrapper>
              )}
            </AnimatePresence>

            <AIPromptContainer $isVisible={!isChatOpen}>
              <AIPromptInput
                placeholder="Ask AI to help create your event..."
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && aiPrompt.trim()) {
                    e.preventDefault();
                    generateEventWithAI();
                  }
                }}
              />
              <GenerateButton
                onClick={generateEventWithAI}
                disabled={!aiPrompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FiLoader size={18} />
                  </motion.div>
                ) : (
                  <FiZap size={18} />
                )}
              </GenerateButton>
            </AIPromptContainer>
          </AIPreviewCard>
        </AISection>
      </CreateEventCard>
    </Container>
  );
};

export default CreateEventScreen;