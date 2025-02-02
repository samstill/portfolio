import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, updateDoc, doc, getFirestore } from 'firebase/firestore';
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

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const AdminCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    padding: 20px;
    margin: 0 10px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    justify-content: center;
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  margin-bottom: 15px;
  
  h3 {
    color: ${props => props.theme.text};
    font-size: 1.2rem;
    margin-bottom: 5px;
  }
  
  p {
    color: ${props => props.theme.text}CC;
    font-size: 0.9rem;
  }
`;

const RoleToggle = styled.button<{ $isAdmin: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.$isAdmin ? 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)' : 
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.text};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 5px;

  @media (max-width: 768px) {
    justify-content: stretch;
    gap: 8px;
    
    > button {
      flex: 1;
      min-width: 120px;
    }
  }
`;

const Tab = styled(motion.button)<{ $active: boolean }>`
  padding: 12px 24px;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)' : 
    'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 12px;
  color: ${props => props.$active ? 'white' : props.theme.text};
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => !props.$active && 'rgba(255, 255, 255, 0.2)'};
  }
`;

const TicketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TicketCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const TicketTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin: 0;
  flex: 1;
  margin-right: 10px;
`;

const TicketDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
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
  gap: 10px;
  margin-top: 15px;
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
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: 10px;
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
`;

const QRScannerSection = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
`;

const QRScannerButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  padding: 12px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #4a6cf7, #6e8efb);
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
  max-width: 600px;
  margin: 0 auto 20px;

  @media (max-width: 768px) {
    margin: 0 0 20px;
  }
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 12px 20px;
  padding-right: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px 16px;
    padding-right: 36px;
  }

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }

  &::placeholder {
    color: ${props => props.theme.text}80;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text}80;
`;

const ClearButton = styled(motion.button)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.text}80;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const TicketStats = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
  z-index: 2;
`;

const StatBadge = styled.div`
  background: rgba(74, 108, 247, 0.15);
  padding: 6px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(74, 108, 247, 0.3);

  .count {
    font-weight: 600;
    color: #4a6cf7;
    font-size: 1.1rem;
  }

  .label {
    color: ${props => props.theme.textSecondary};
    font-size: 0.9rem;
  }
`;

const TicketCard = styled(motion.div)<{ $isSelected?: boolean }>`
  background: ${props => props.$isSelected ? 
    'rgba(74, 108, 247, 0.15)' : 
    'rgba(255, 255, 255, 0.05)'};
  padding: 20px;
  border-radius: 15px;
  border: 1px solid ${props => props.$isSelected ? 
    'rgba(74, 108, 247, 0.5)' : 
    'rgba(255, 255, 255, 0.1)'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 280px;
  
  &:hover {
    background: ${props => props.$isSelected ? 
      'rgba(74, 108, 247, 0.2)' : 
      'rgba(255, 255, 255, 0.08)'};
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
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
  
  /* Custom scrollbar for the main overlay */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  /* Padding for content */
  > div {
    padding: 30px;
    padding-bottom: env(safe-area-inset-bottom, 30px); /* For iOS devices */
  }

  @media (max-width: 768px) {
    max-height: 85vh;
    
    > div {
      padding: 20px;
      padding-bottom: env(safe-area-inset-bottom, 20px);
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

const UserActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 15px;
`;

const UserActionButton = styled(motion.button)<{ $variant: 'danger' | 'primary' | 'secondary' }>`
  padding: 8px;
  background: ${props => {
    switch (props.$variant) {
      case 'danger': return 'rgba(244, 67, 54, 0.1)';
      case 'primary': return 'rgba(74, 108, 247, 0.1)';
      case 'secondary': return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'danger': return '#F44336';
      case 'primary': return '#4a6cf7';
      case 'secondary': return props.theme.text;
    }
  }};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'danger': return '#F44336';
      case 'primary': return '#4a6cf7';
      case 'secondary': return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${props => {
      switch (props.$variant) {
        case 'danger': return 'rgba(244, 67, 54, 0.2)';
        case 'primary': return 'rgba(74, 108, 247, 0.2)';
        case 'secondary': return 'rgba(255, 255, 255, 0.15)';
      }
    }};
  }
`;

type TabType = 'users' | 'tickets';

const UserCardSkeleton = () => (
  <UserCard>
    <Skeleton height="24px" width="60%" marginBottom="10px" />
    <Skeleton height="18px" width="80%" marginBottom="20px" />
    <Skeleton height="36px" width="120px" borderRadius="8px" />
  </UserCard>
);

const TicketCardSkeleton = () => (
  <TicketCard as="div">
    <TicketCardHeader>
      <Skeleton height="24px" width="70%" />
    </TicketCardHeader>
    <Skeleton height="6px" marginTop="15px" />
    <TicketDetails>
      <DetailItem>
        <Skeleton height="16px" width="60%" marginBottom="8px" />
        <Skeleton height="20px" width="80%" />
      </DetailItem>
      <DetailItem>
        <Skeleton height="16px" width="60%" marginBottom="8px" />
        <Skeleton height="20px" width="80%" />
      </DetailItem>
    </TicketDetails>
  </TicketCard>
);

const AdminScreen: React.FC = () => {
  const { selectedModel } = useAI();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (activeTab === 'tickets') {
      const fetchTickets = async () => {
        try {
          const allTickets = await ticketService.getAllTickets();
          setTickets(allTickets.sort((a, b) => 
            new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
          ));
        } catch (err) {
          console.error('Failed to fetch tickets:', err);
          toast.error('Failed to load tickets');
        }
      };
      fetchTickets();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      const filtered = tickets.filter(ticket => 
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.eventDetails.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTickets(filtered);
    }
  }, [searchQuery, tickets]);

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

  const handleScan = async (data: string | null) => {
    if (!data) return;

    try {
      // Parse the QR code data
      const qrData = JSON.parse(data);
      
      if (!qrData.ticketId) {
        toast.error('Invalid QR code format');
        return;
      }

      // Fetch the ticket details
      const ticket = await ticketService.getTicket(qrData.ticketId);
      
      if (!ticket) {
        toast.error('Ticket not found');
        return;
      }

      // Check ticket status
      if (ticket.status === 'used') {
        toast.error('Ticket has already been used');
        return;
      }

      if (ticket.status === 'cancelled') {
        toast.error('Ticket has been cancelled');
        return;
      }

      // Set the selected ticket to show validation overlay
      setSelectedTicket(ticket);
      setIsScannerOpen(false);

    } catch (error) {
      console.error('Error scanning ticket:', error);
      toast.error('Invalid QR code');
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

  const renderContent = () => {
    if (activeTab === 'users') {
      if (loading) {
        return (
          <UsersGrid>
            {[...Array(6)].map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </UsersGrid>
        );
      }

      return (
        <UsersGrid>
          {users.map(user => (
            <UserCard
              key={user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UserInfo>
                <h3>{user.email}</h3>
                <p>User ID: {user.uid.substring(0, 8)}...</p>
              </UserInfo>
              <RoleToggle
                $isAdmin={user.role === 'admin'}
                onClick={() => toggleUserRole(user)}
              >
                {user.role === 'admin' ? (
                  <>
                    <FiUserCheck size={18} />
                    Admin
                  </>
                ) : (
                  <>
                    <FiUsers size={18} />
                    User
                  </>
                )}
              </RoleToggle>
              <UserActions>
                <UserActionButton
                  $variant="primary"
                  onClick={() => handleResetPassword(user)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Send password reset email"
                >
                  <FiKey size={16} />
                </UserActionButton>
                <UserActionButton
                  $variant="danger"
                  onClick={() => handleDeleteUser(user)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={user.role === 'admin'} // Prevent deleting admin users
                  title={user.role === 'admin' ? "Can't delete admin users" : "Delete user"}
                >
                  <FiTrash2 size={16} />
                </UserActionButton>
              </UserActions>
            </UserCard>
          ))}
        </UsersGrid>
      );
    }

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SearchContainer>
            <SearchInput
              placeholder="Search tickets by number, event, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <ClearButton
                onClick={() => setSearchQuery('')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX size={18} />
              </ClearButton>
            ) : (
              <SearchIcon size={18} />
            )}
          </SearchContainer>

          <QRScannerButton
            onClick={() => setIsScannerOpen(!isScannerOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiCamera size={20} />
            {isScannerOpen ? 'Close Scanner' : 'Scan Ticket QR'}
          </QRScannerButton>

          <AnimatePresence>
            {isScannerOpen && (
              <QRScannerSection
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <QRScanner
                  onScan={handleScan}
                  onError={(error) => {
                    console.error('Scanner error:', error);
                    toast.error('Failed to initialize camera');
                  }}
                />
              </QRScannerSection>
            )}
          </AnimatePresence>
        </motion.div>

        <TicketsGrid>
          {loading ? (
            [...Array(6)].map((_, index) => (
              <TicketCardSkeleton key={index} />
            ))
          ) : (searchQuery ? filteredTickets : tickets).map(ticket => {
            const usagePercentage = (ticket.usedCount / ticket.quantity) * 100;
            const isSelected = selectedTicket?.id === ticket.id;
            
            return (
              <TicketCard
                key={ticket.id}
                $isSelected={isSelected}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
            );
          })}
        </TicketsGrid>
      </>
    );
  };

  return (
    <Container>
      <BackButton />
      <AdminCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>Admin Dashboard</Title>
          <ModelSelector />
        </Header>
        <TabContainer>
          <Tab
            $active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUsers size={20} />
            Users
          </Tab>
          <Tab
            $active={activeTab === 'tickets'}
            onClick={() => setActiveTab('tickets')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTag size={20} />
            Tickets
          </Tab>
        </TabContainer>

        {renderContent()}
      </AdminCard>
      
      <AnimatePresence>
        {selectedTicket && (
          <ValidationOverlay
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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
              onValidationComplete={() => {
                if (selectedTicket.id) {
                  // Refresh both the selected ticket and the tickets list
                  Promise.all([
                    ticketService.getTicket(selectedTicket.id).then(setSelectedTicket),
                    ticketService.getAllTickets().then(newTickets => 
                      setTickets(newTickets.sort((a, b) => 
                        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
                      ))
                    )
                  ]);
                }
              }}
            />
          </ValidationOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AdminScreen;