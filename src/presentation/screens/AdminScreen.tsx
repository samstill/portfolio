import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, updateDoc, doc, getFirestore, query, where, or, getDoc } from 'firebase/firestore';
import { FiUsers, FiUserCheck, FiUserX, FiTag, FiCheck, FiX, FiCamera, FiSearch, FiTrash2, FiKey } from 'react-icons/fi'; // Add this import
import { toast } from 'react-hot-toast'; // Add this import
import { UserData } from '../../shared/types/user';
import { userService } from '../../firebase/services/userService';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';
import BackButton from '../components/BackButton';
import QRScanner from '../components/QRScanner'; // Add this import
import { ModelSelector } from '../components/ModelSelector';
import { useAI } from '../../shared/contexts/AIContext';
import TicketValidation from './TicketValidation';
import { Skeleton } from '../components/Skeleton';
import { SearchBar } from '../components/SearchBar';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { logger } from '../../utils/logger';
import { css } from 'styled-components';

interface StyledProps {
  $isScanning?: boolean;
  $isActive?: boolean;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
  background: linear-gradient(135deg, ${props => props.theme.background}, ${props => props.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 0 15px;
    margin: 0;
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 35px;
  gap: 25px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 25px;
    gap: 20px;
    padding: 0 15px;
  }
`;

const AdminCard = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 35px 0;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px 0;
    border-radius: 0;
    background: transparent;
    backdrop-filter: none;
    box-shadow: none;
    border: none;
    margin: 0;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 35px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-weight: 700;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    justify-content: center;
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
  padding: 10px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 0 15px;
    box-sizing: border-box;

    > * {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    padding: 0 10px;
    gap: 20px;
  }
`;

const UserCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  padding: 25px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.18);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 768px) {
    padding: 20px;
    gap: 15px;
  }
`;

const UserInfo = styled.div`
  overflow: hidden;
  flex: 1;
  
  h3 {
    color: ${props => props.theme.text};
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    font-size: 0.9rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const UserControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-left: 35px;
  margin-top: 15px;

  @media (max-width: 768px) {
    margin-left: 15px;
    margin-top: 12px;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const RoleToggle = styled.button<{ $isAdmin: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: ${props => props.$isAdmin ? 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)' : 
    'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.$isAdmin ? 
    'transparent' : 
    'rgba(255, 255, 255, 0.15)'};
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
  letter-spacing: 0.2px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isAdmin ?
      '0 8px 20px rgba(74, 108, 247, 0.35)' :
      '0 8px 20px rgba(255, 255, 255, 0.1)'};
    background: ${props => props.$isAdmin ? 
      'linear-gradient(135deg, #4a6cf7, #6e8efb)' : 
      'rgba(255, 255, 255, 0.08)'};
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 10px 18px;
  }
`;

const UserActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const UserActionButton = styled(motion.button)<{ $variant: 'danger' | 'primary' | 'secondary' }>`
  padding: 12px;
  background: ${props => {
    switch (props.$variant) {
      case 'danger': return 'rgba(244, 67, 54, 0.08)';
      case 'primary': return 'rgba(74, 108, 247, 0.08)';
      case 'secondary': return 'rgba(255, 255, 255, 0.05)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'danger': return '#ff4d4d';
      case 'primary': return '#4a6cf7';
      case 'secondary': return props.theme.text;
    }
  }};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'danger': return '#ff4d4d';
      case 'primary': return '#4a6cf7';
      case 'secondary': return 'rgba(255, 255, 255, 0.15)';
    }
  }};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => {
      switch (props.$variant) {
        case 'danger': return '0 8px 20px rgba(244, 67, 54, 0.25)';
        case 'primary': return '0 8px 20px rgba(74, 108, 247, 0.25)';
        case 'secondary': return '0 8px 20px rgba(255, 255, 255, 0.1)';
      }
    }};
    background: ${props => {
      switch (props.$variant) {
        case 'danger': return 'rgba(244, 67, 54, 0.15)';
        case 'primary': return 'rgba(74, 108, 247, 0.15)';
        case 'secondary': return 'rgba(255, 255, 255, 0.08)';
      }
    }};
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 0 35px 35px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: fit-content;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.1);
  transform-origin: left center;

  @media (max-width: 768px) {
    width: calc(100% - 30px);
    margin: 0 auto 25px;
    justify-content: center;
  }
`;

const Tab = styled(motion.button)<{ $active: boolean }>`
  padding: 10px 24px;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, rgba(110, 142, 251, 0.9), rgba(74, 108, 247, 0.9))' : 
    'transparent'};
  border: none;
  border-radius: 12px;
  color: ${props => props.$active ? 'white' : props.theme.textSecondary};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  min-width: fit-content;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;
  backdrop-filter: ${props => props.$active ? 'blur(8px)' : 'none'};
  box-shadow: ${props => props.$active ? 
    '0 4px 15px rgba(74, 108, 247, 0.2)' : 
    'none'};
  transform-origin: center center;

  svg {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    color: ${props => props.$active ? 'white' : props.theme.text};
    background: ${props => props.$active ? 
      'linear-gradient(135deg, rgba(110, 142, 251, 0.95), rgba(74, 108, 247, 0.95))' : 
      'rgba(255, 255, 255, 0.08)'};
    
    svg {
      transform: scale(1.15) rotate(5deg);
    }
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
    flex: 1;
    justify-content: center;
  }
`;

const TicketsGrid = styled.div`
  display: grid;
  gap: 25px;
  margin-top: 20px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));

  @media (min-width: 1800px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1400px) and (max-width: 1799px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) and (max-width: 1399px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 15px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;

    > * {
      width: 100% !important;
      margin: 0 !important;
    }
  }

  @media (max-width: 480px) {
    padding: 0 10px;
    gap: 12px;
    margin-top: 12px;
  }
`;

const TicketCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 10px;
`;

const TicketTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin: 0;
  flex: 1;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TicketDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 15px 0;
  flex: 1;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 45px;
  }
`;

const DetailItem = styled.div`
  .label {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 0.95rem;
    color: ${props => props.theme.text};
    font-weight: 500;
    word-break: break-word;
  }

  @media (max-width: 768px) {
    .label {
      font-size: 0.8rem;
    }
    .value {
      font-size: 0.9rem;
    }
  }
`;

const ProgressBar = styled.div<{ $percentage: number }>`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$percentage}%;
    background: linear-gradient(135deg, #6e8efb, #4a6cf7);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const TicketFooter = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const TicketActions = styled.div`
  display: flex;
  gap: 12px;
  margin-left: 35px;
  margin-top: 15px;

  @media (max-width: 768px) {
    margin-left: 15px;
    margin-top: 12px;
  }
`;

const ActionButton = styled(motion.button)<{ $variant: 'verify' | 'cancel' }>`
  padding: 8px 16px;
  background: ${props => props.$variant === 'verify' ? 
    'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.$variant === 'verify' ? '#4CAF50' : '#F44336'};
  border: 1px solid ${props => props.$variant === 'verify' ? '#4CAF50' : '#F44336'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.$variant === 'verify' ? 
      'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
  }
`;

const StatusBadge = styled.span<{ status: Ticket['status'] }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${props => {
    switch (props.status) {
      case 'valid': return 'rgba(76, 175, 80, 0.2)';
      case 'used': return 'rgba(255, 193, 7, 0.2)';
      case 'cancelled': return 'rgba(244, 67, 54, 0.2)';
      default: return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'valid': return '#4CAF50';
      case 'used': return '#FFC107';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
`;

const QRScannerWrapper = styled.div<StyledProps>`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  max-height: ${props => props.$isScanning ? '300px' : '0px'};
  opacity: ${props => props.$isScanning ? 1 : 0};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    max-width: 250px;
    max-height: ${props => props.$isScanning ? '250px' : '0px'};
    border-radius: 12px;
  }
`;

const QRScannerSection = motion(QRScannerWrapper);

const QRScannerContent = styled.div`
  padding: 0;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
`;

const SearchWrapper = styled.div`
  width: 100%;
  padding: 0 15px;
  margin-bottom: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
    margin-bottom: 15px;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;

    form {
      max-width: 100%;
      width: 100%;
      box-sizing: border-box;
    }
  }
`;

const QRScannerButton = styled(motion.button)<StyledProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.$isScanning ? 
    'rgba(255, 71, 87, 0.1)' : 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  color: ${props => props.$isScanning ? '#ff4757' : 'white'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: ${props => props.$isScanning ? 
    'none' : 
    '0 4px 12px rgba(74, 108, 247, 0.2)'};
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isScanning ? 
      'none' : 
      '0 6px 16px rgba(74, 108, 247, 0.3)'};
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
`;

const TicketStats = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
  }
`;

const StatBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(74, 108, 247, 0.15);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4a6cf7;

  .count {
    font-weight: 600;
  }

  .label {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 0.85rem;
  }
`;

const TicketCard = styled(motion.div)<{ $isSelected?: boolean }>`
  background: ${props => props.$isSelected ? 
    'rgba(74, 108, 247, 0.15)' : 
    'rgba(255, 255, 255, 0.05)'};
  padding: 25px;
  border-radius: 15px;
  border: 1px solid ${props => props.$isSelected ? 
    'rgba(74, 108, 247, 0.5)' : 
    'rgba(255, 255, 255, 0.1)'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  transform: translateZ(0);
  will-change: transform;
  box-sizing: border-box;
  width: 100%;
  
  &:hover {
    background: ${props => props.$isSelected ? 
      'rgba(74, 108, 247, 0.2)' : 
      'rgba(255, 255, 255, 0.08)'};
    transform: translateY(-5px) translateZ(0);
    box-shadow: 0 5px 20px -5px rgba(31, 38, 135, 0.15);
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 12px;
    
    ${TicketTitle} {
      font-size: 1rem;
      margin-bottom: 8px;
    }
    
    ${TicketDetails} {
      gap: 8px;
      margin: 10px 0 40px;
      
      .label {
        font-size: 0.75rem;
        margin-bottom: 2px;
      }
      
      .value {
        font-size: 0.85rem;
      }
    }
    
    ${TicketStats} {
      bottom: 12px;
      right: 12px;
    }
    
    ${StatBadge} {
      padding: 3px 8px;
      font-size: 0.8rem;
    }
  }
`;

const ValidationOverlay = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 32px rgba(31, 38, 135, 0.37);
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
  padding: env(safe-area-inset-bottom);
  
  > div {
    padding: 30px;
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    max-height: 85vh;
    border-radius: 15px 15px 0 0;
    
    > div {
      padding: 20px 15px;
    }
  }
`;

const ValidationCloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NoResults = styled(motion.div)`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  width: 100%;
  max-width: calc(100vw - 40px);
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  svg {
    margin-bottom: 15px;
    opacity: 0.7;
    font-size: 48px;
  }

  p {
    margin: 0;
    max-width: 80%;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 30px 15px;
    font-size: 1rem;
    margin: 15px auto;
    min-height: 180px;
    max-width: calc(100vw - 30px);

    svg {
      font-size: 40px;
      margin-bottom: 12px;
    }

    p {
      max-width: 90%;
    }
  }

  @media (max-width: 480px) {
    padding: 25px 15px;
    min-height: 160px;
    
    svg {
      font-size: 36px;
      margin-bottom: 10px;
    }
  }
`;

type TabType = 'users' | 'tickets';

// Add these styled components for skeletons
const SkeletonTitle = styled.div`
  height: 24px;
  width: 60%;
  margin-bottom: 10px;
`;

const SkeletonText = styled.div`
  height: 18px;
  width: 80%;
  margin-bottom: 20px;
`;

const SkeletonButton = styled.div`
  height: 36px;
  width: 120px;
  border-radius: 8px;
`;

const SkeletonHeader = styled.div`
  height: 24px;
  width: 70%;
`;

const SkeletonBar = styled.div`
  height: 6px;
  width: 100%;
  margin-top: 15px;
`;

const SkeletonDetailLabel = styled.div`
  height: 16px;
  width: 60%;
  margin-bottom: 8px;
`;

const SkeletonDetailValue = styled.div`
  height: 20px;
  width: 80%;
`;

// Update the UserCardSkeleton component
const UserCardSkeleton = () => (
  <UserCard>
    <SkeletonTitle>
      <Skeleton />
    </SkeletonTitle>
    <SkeletonText>
      <Skeleton />
    </SkeletonText>
    <SkeletonButton>
      <Skeleton />
    </SkeletonButton>
  </UserCard>
);

// Update the TicketCardSkeleton component
const TicketCardSkeleton = () => (
  <TicketCard as="div">
    <TicketCardHeader>
      <SkeletonHeader>
        <Skeleton />
      </SkeletonHeader>
    </TicketCardHeader>
    <SkeletonBar>
      <Skeleton />
    </SkeletonBar>
    <TicketDetails>
      <DetailItem>
        <SkeletonDetailLabel>
          <Skeleton />
        </SkeletonDetailLabel>
        <SkeletonDetailValue>
          <Skeleton />
        </SkeletonDetailValue>
      </DetailItem>
      <DetailItem>
        <SkeletonDetailLabel>
          <Skeleton />
        </SkeletonDetailLabel>
        <SkeletonDetailValue>
          <Skeleton />
        </SkeletonDetailValue>
      </DetailItem>
    </TicketDetails>
  </TicketCard>
);

// Add these animation variants
const pageTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      scale: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const cardTransition = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      scale: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const overlayTransition = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
  transition: { 
    type: 'spring',
    damping: 25,
    stiffness: 200,
    mass: 1
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Add these new animation variants after the existing ones
const loadMoreTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Add the missing tabVariants configuration
const tabVariants = {
  active: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 1
    }
  },
  inactive: {
    scale: 0.95,
    opacity: 0.7,
    y: 2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 1
    }
  }
};

// Add this new animation variant for the icon
const iconVariants = {
  active: {
    scale: 1,
    rotate: [0, 15, -15, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.1
      },
      scale: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  },
  inactive: {
    scale: 0.9,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

// Add this new styled component for the loading indicator
const LoadMoreIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  gap: 12px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;

  .loading-dots {
    display: flex;
    gap: 4px;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: ${props => props.theme.primary};
    border-radius: 50%;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 15px;
    font-size: 0.85rem;
  }
`;

const LoadingDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: currentColor;
  border-radius: 50%;
`;

// Add this new styled component for the load more container
const LoadMoreContainer = styled(motion.div)`
  min-height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

// Update the LoadingAnimation component
const LoadingAnimation = () => (
  <LoadMoreContainer
    initial="initial"
    animate="animate"
    exit="exit"
    variants={loadMoreTransition}
  >
    <LoadMoreIndicator>
      <span>Loading more</span>
      <div className="loading-dots">
        {[0, 1, 2].map((i) => (
          <LoadingDot
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
              y: [0, -3, 0]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </LoadMoreIndicator>
  </LoadMoreContainer>
);

const UserAvatar = styled.div<{ $imageUrl?: string }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => props.$imageUrl ? 
    `url(${props.$imageUrl}) no-repeat center/cover` : 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
`;

const getInitials = (email: string) => {
  return email
    .split('@')[0]
    .split('.')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ScanButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 108, 247, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
`;

const ScannerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ScannerContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme.background};
  border-radius: 20px;
  padding: 30px;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  cursor: pointer;
  z-index: 10;
`;

const AdminScreen: React.FC = () => {
  const { selectedModel } = useAI();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<{
    users: UserData[];
    tickets: Ticket[];
  }>({
    users: [],
    tickets: []
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  // Update the intersection observer configuration
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
    triggerOnce: false,
    delay: 100
  });

  // Memoized data fetching functions
  const fetchUsers = useCallback(async (searchText = '', isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setIsSearching(true);
        setLoading(true);
        setPage(1);
        setUsers([]);
      } else {
        setLoadingMore(true);
      }

      const db = getFirestore();
      const usersRef = collection(db, 'users');
      
      let queryRef = usersRef;
      if (searchText) {
        queryRef = query(usersRef, 
          where('email', '>=', searchText),
          where('email', '<=', searchText + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(queryRef);
      const uniqueUsers = new Map();
      querySnapshot.docs.forEach(doc => {
        if (!uniqueUsers.has(doc.id)) {
          uniqueUsers.set(doc.id, { 
            uid: doc.id, 
            ...doc.data() 
          } as UserData);
        }
      });
      
      const allUsers = Array.from(uniqueUsers.values());
      setFilteredData(prev => ({ ...prev, users: allUsers }));

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedUsers = allUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      const hasMoreItems = allUsers.length > (page * ITEMS_PER_PAGE);
      setHasMore(hasMoreItems);

      if (isNewSearch) {
        setUsers(paginatedUsers);
      } else {
        setUsers(prev => {
          const newUsers = [...prev];
          paginatedUsers.forEach(user => {
            if (!newUsers.some(u => u.uid === user.uid)) {
              newUsers.push(user);
            }
          });
          return newUsers;
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsSearching(false);
      setLoading(false);
      setLoadingMore(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  const fetchTickets = useCallback(async (searchText = '', isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setIsSearching(true);
        setLoading(true);
        setPage(1);
        setTickets([]);
      } else {
        setLoadingMore(true);
      }

      const allTickets = await ticketService.getAllTickets();
      
      let filteredTickets = allTickets;
      if (searchText) {
        const query = searchText.toLowerCase().trim();
        filteredTickets = allTickets.filter(ticket => {
          if (!ticket) return false;
          
          const ticketNumber = ticket?.ticketNumber?.toLowerCase() || '';
          const eventTitle = ticket?.eventDetails?.title?.toLowerCase() || '';
          const userEmail = ticket?.userEmail?.toLowerCase() || '';
          const status = ticket?.status?.toLowerCase() || '';

          return (
            ticketNumber.includes(query) ||
            eventTitle.includes(query) ||
            userEmail.includes(query) ||
            status.includes(query)
          );
        });
      }

      setFilteredData(prev => ({ ...prev, tickets: filteredTickets }));

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedTickets = filteredTickets
        .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
        .slice(startIndex, startIndex + ITEMS_PER_PAGE);

      const hasMoreItems = filteredTickets.length > (page * ITEMS_PER_PAGE);
      setHasMore(hasMoreItems);

      if (isNewSearch) {
        setTickets(paginatedTickets);
      } else {
        setTickets(prev => {
          const newTickets = [...prev];
          paginatedTickets.forEach(ticket => {
            if (!newTickets.some(t => t.id === ticket.id)) {
              newTickets.push(ticket);
            }
          });
          return newTickets;
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setIsSearching(false);
      setLoading(false);
      setLoadingMore(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  // Debounced search handlers
  const debouncedUserSearch = useMemo(
    () => debounce(async (searchText: string) => {
      try {
        setLoading(true);
        await fetchUsers(searchText, true);
        setLoading(false);
      } catch (error) {
        logger.error('Error searching users:', error);
        setLoading(false);
      }
    }, 300),
    [fetchUsers]
  );

  const debouncedTicketSearch = useMemo(
    () => debounce(async (searchText: string) => {
      try {
        setLoading(true);
        await fetchTickets(searchText, true);
        setLoading(false);
      } catch (error) {
        logger.error('Error searching tickets:', error);
        setLoading(false);
      }
    }, 300),
    [fetchTickets]
  );

  // Effect for initial data loading
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchTickets();
    }
  }, [activeTab, fetchUsers, fetchTickets]);

  // Update the infinite scroll effect
  useEffect(() => {
    const shouldLoadMore = 
      !isInitialLoad && 
      inView && 
      !isSearching && 
      !loadingMore && 
      hasMore &&
      (activeTab === 'users' ? filteredData.users.length > users.length : filteredData.tickets.length > tickets.length);

    if (shouldLoadMore) {
      const timer = setTimeout(() => {
        setPage(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [
    inView, 
    isSearching, 
    loadingMore, 
    hasMore, 
    isInitialLoad, 
    activeTab, 
    filteredData.users.length, 
    filteredData.tickets.length, 
    users.length, 
    tickets.length
  ]);

  // Update tab change handler
  const handleTabChange = useCallback((newTab: TabType) => {
    setActiveTab(newTab);
    setPage(1);
    setUsers([]);
    setTickets([]);
    setSearchQuery('');
    setHasMore(true);
    setIsInitialLoad(true);
    
    if (newTab === 'users') {
      fetchUsers('', true);
    } else {
      fetchTickets('', true);
    }
  }, [fetchUsers, fetchTickets]);

  const handleUserSearch = useCallback((searchText: string) => {
    setSearchQuery(searchText);
    setIsInitialLoad(true);
    fetchUsers(searchText, true);
  }, [fetchUsers]);

  const handleTicketSearch = useCallback((searchText: string) => {
    setSearchQuery(searchText);
    setIsInitialLoad(true);
    fetchTickets(searchText, true);
  }, [fetchTickets]);

  const toggleUserRole = async (user: UserData) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await userService.updateUserRole(user.uid, newRole);
      
      setUsers(users.map(u => 
        u.uid === user.uid ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    }
  };

  const handleValidateTicket = async (ticketId: string) => {
    try {
      const ticket = await ticketService.getTicket(ticketId);
      if (!ticket) {
        toast.error('Invalid ticket');
        return;
      }
      if (ticket.status !== 'valid') {
        toast.error('Ticket is already used or cancelled');
        return;
      }
      await ticketService.validateTicket(ticketId);
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: 'used' as const } : ticket
      ));
      toast.success('Ticket validated successfully');
    } catch (err) {
      toast.error('Failed to validate ticket');
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    try {
      await ticketService.cancelTicket(ticketId);
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: 'cancelled' as const } : ticket
      ));
      toast.success('Ticket cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel ticket');
    }
  };

  const handleSearch = useCallback((query: string) => {
    if (activeTab === 'users') {
      void debouncedUserSearch(query);
    } else {
      void debouncedTicketSearch(query);
    }
  }, [activeTab, debouncedUserSearch, debouncedTicketSearch]);

  const handleScan = async (data: string | null) => {
    if (!data) return;

    try {
      // Parse the QR code data
      const qrData = JSON.parse(data);
      
      if (!qrData.ticketId) {
        toast.error('Invalid QR code format');
        return;
      }

      // Get the ticket from the service
      const ticket = await ticketService.getTicketById(qrData.ticketId);
      
      if (!ticket) {
        toast.error('Ticket not found');
        return;
      }

      // Check ticket status
      if (ticket.status === 'used') {
        toast.error('Ticket has already been used', {
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }

      if (ticket.status === 'cancelled') {
        toast.error('Ticket has been cancelled', {
          duration: 3000,
          icon: '❌'
        });
        return;
      }

      // Set the selected ticket to show validation overlay
      setSelectedTicket(ticket);
      setIsScannerOpen(false);

      // Show success toast
      toast.success('Ticket found! Please validate below.', {
        duration: 3000,
        icon: '✅'
      });

    } catch (error) {
      logger.error('Error scanning ticket:', error);
      toast.error('Invalid QR code', {
        duration: 3000,
        icon: '❌'
      });
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (!user?.uid) {
      toast.error('Invalid user data');
      return;
    }

    if (user.role === 'admin') {
      toast.error('Cannot delete admin users');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user ${user.email}?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.uid);
      setUsers(users.filter(u => u.uid !== user.uid));
      toast.success('User deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async (user: UserData) => {
    try {
      await userService.sendPasswordResetEmail(user.email);
      toast.success('Password reset email sent successfully');
    } catch (err) {
      console.error('Failed to send password reset email:', err);
      toast.error('Failed to send password reset email');
    }
  };

  const handleValidationComplete = () => {
    setSelectedTicket(null);
    // Refresh ticket list if needed
  };

  const renderContent = () => {
    if (activeTab === 'users') {
      return (
        <motion.div {...pageTransition}>
          <SearchWrapper>
            <SearchBar
              placeholder="Search users by email..."
              onSearch={debouncedUserSearch}
              isLoading={isSearching}
            />
            <QRScannerButton
              onClick={() => setIsScannerOpen(!isScannerOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              $isScanning={isScannerOpen}
            >
              <FiCamera size={18} />
              {isScannerOpen ? 'Stop Scanning' : 'Scan Ticket'}
            </QRScannerButton>
          </SearchWrapper>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <UsersGrid
                as={motion.div}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {[...Array(6)].map((_, index) => (
                  <motion.div key={index} variants={cardTransition}>
                    <UserCardSkeleton />
                  </motion.div>
                ))}
              </UsersGrid>
            ) : users.length === 0 ? (
              <NoResults {...pageTransition}>
                <FiUsers size={40} />
                <p>No users found</p>
              </NoResults>
            ) : (
              <>
                <UsersGrid
                  as={motion.div}
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {users.map((user, index) => {
                    const uniqueKey = `${user.uid}_${index}`;
                    return (
                      <motion.div
                        key={uniqueKey}
                        variants={cardTransition}
                        custom={index}
                      >
                        <UserCard
                          onClick={() => navigate(`/admin/users/${user.uid}`)}
                        >
                          <UserInfo>
                            <h3>{user.email}</h3>
                            <p>
                              <FiUsers size={14} />
                              ID: {user.uid.substring(0, 8)}...
                            </p>
                          </UserInfo>
                          <UserAvatar $imageUrl={user.profilePhoto}>
                            {!user.profilePhoto && getInitials(user.email)}
                          </UserAvatar>
                        </UserCard>
                      </motion.div>
                    );
                  })}
                </UsersGrid>
                {(hasMore || loadingMore) && (
                  <LoadMoreContainer ref={loadMoreRef}>
                    {loadingMore && <LoadingAnimation />}
                  </LoadMoreContainer>
                )}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    return (
      <motion.div {...pageTransition}>
        <SearchWrapper>
          <SearchBar
            placeholder="Search tickets by number, event, or user..."
            onSearch={handleSearch}
            isLoading={isSearching}
          />
          <QRScannerButton
            onClick={() => setIsScannerOpen(!isScannerOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            $isScanning={isScannerOpen}
          >
            <FiCamera size={18} />
            {isScannerOpen ? 'Stop Scanning' : 'Scan Ticket'}
          </QRScannerButton>
        </SearchWrapper>

        <AnimatePresence>
          {isScannerOpen && (
            <QRScannerSection
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              $isScanning={isScannerOpen}
            >
              <QRScannerContent>
                <QRScanner 
                  onScan={handleScan} 
                  onError={(error) => logger.error('QR Scanner error:', error)} 
                />
              </QRScannerContent>
            </QRScannerSection>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading ? (
            <TicketsGrid
              as={motion.div}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {[...Array(6)].map((_, index) => (
                <motion.div key={index} variants={cardTransition}>
                  <TicketCardSkeleton />
                </motion.div>
              ))}
            </TicketsGrid>
          ) : tickets.length === 0 ? (
            <NoResults {...pageTransition}>
              <FiTag size={40} />
              <p>No tickets found</p>
            </NoResults>
          ) : (
            <>
              <TicketsGrid
                as={motion.div}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {tickets.map((ticket, index) => {
                  const usagePercentage = (ticket.usedCount / ticket.quantity) * 100;
                  const isSelected = selectedTicket?.id === ticket.id;
                  const uniqueKey = `${ticket.id}_${index}`;
                  
                  return (
                    <motion.div
                      key={uniqueKey}
                      variants={cardTransition}
                      custom={index}
                    >
                      <TicketCard
                        $isSelected={isSelected}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <TicketCardHeader>
                          <TicketTitle>{ticket.eventDetails.title}</TicketTitle>
                          <StatusBadge status={ticket.status}>
                            {ticket.status.toUpperCase()}
                          </StatusBadge>
                        </TicketCardHeader>

                        <ProgressBar $percentage={usagePercentage} />
                        
                        <TicketDetails>
                          <DetailItem>
                            <div className="label">Ticket #</div>
                            <div className="value">{ticket.ticketNumber}</div>
                          </DetailItem>
                          <DetailItem>
                            <div className="label">User ID</div>
                            <div className="value" style={{ fontSize: '0.8rem' }}>
                              {ticket.userId.substring(0, 8)}...
                            </div>
                          </DetailItem>
                          <DetailItem>
                            <div className="label">Event Date</div>
                            <div className="value">
                              {new Date(ticket.eventDetails.date).toLocaleDateString()}
                            </div>
                          </DetailItem>
                          <DetailItem>
                            <div className="label">Purchase Date</div>
                            <div className="value">
                              {new Date(ticket.purchasedAt).toLocaleDateString()}
                            </div>
                          </DetailItem>
                          {ticket.lastValidatedAt && (
                            <DetailItem>
                              <div className="label">Last Used</div>
                              <div className="value">
                                {new Date(ticket.lastValidatedAt).toLocaleString()}
                              </div>
                            </DetailItem>
                          )}
                        </TicketDetails>

                        {ticket.status === 'valid' && (
                          <TicketFooter>
                            <TicketActions>
                              <ActionButton
                                $variant="verify"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleValidateTicket(ticket.id);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiCheck size={16} />
                                Quick Validate
                              </ActionButton>
                              <ActionButton
                                $variant="cancel"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelTicket(ticket.id);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiX size={16} />
                                Cancel
                              </ActionButton>
                            </TicketActions>
                          </TicketFooter>
                        )}

                        <TicketStats>
                          <StatBadge>
                            <span className="count">{ticket.usedCount}</span>
                            <span className="label">/ {ticket.quantity}</span>
                          </StatBadge>
                        </TicketStats>
                      </TicketCard>
                    </motion.div>
                  );
                })}
              </TicketsGrid>
              {(hasMore || loadingMore) && (
                <LoadMoreContainer ref={loadMoreRef}>
                  {loadingMore && <LoadingAnimation />}
                </LoadMoreContainer>
              )}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const MotionContainer = styled(motion.div)`
    width: 100%;
    height: 100%;
  `;

  return (
    <Container>
      <BackButton />
      <AdminCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TabContainer>
          <Tab
            as={motion.button}
            variants={tabVariants}
            animate={activeTab === 'users' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            $active={activeTab === 'users'}
            onClick={() => handleTabChange('users')}
          >
            <motion.div
              variants={iconVariants}
              animate={activeTab === 'users' ? 'active' : 'inactive'}
              initial="inactive"
            >
              <FiUsers size={18} />
            </motion.div>
            Users
          </Tab>
          <Tab
            as={motion.button}
            variants={tabVariants}
            animate={activeTab === 'tickets' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            $active={activeTab === 'tickets'}
            onClick={() => handleTabChange('tickets')}
          >
            <motion.div
              variants={iconVariants}
              animate={activeTab === 'tickets' ? 'active' : 'inactive'}
              initial="inactive"
            >
              <FiTag size={18} />
            </motion.div>
            Tickets
          </Tab>
        </TabContainer>

        <ContentWrapper>
          {renderContent()}
        </ContentWrapper>
      </AdminCard>
      
      <AnimatePresence>
        {selectedTicket && (
          <ValidationOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ValidationCloseButton
              onClick={() => setSelectedTicket(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={20} />
            </ValidationCloseButton>
            <TicketValidation
              ticket={selectedTicket}
              onValidationComplete={handleValidationComplete}
            />
          </ValidationOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AdminScreen;