import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, updateDoc, doc, getFirestore } from 'firebase/firestore';
import { FiUsers, FiUserCheck, FiUserX, FiTag, FiCheck, FiX, FiCamera, FiSearch } from 'react-icons/fi'; // Add this import
import { toast } from 'react-hot-toast'; // Add this import
import { UserData } from '../../shared/types/user';
import { userService } from '../../firebase/services/userService';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';
import BackButton from '../components/BackButton';
import QRScanner from '../components/QRScanner'; // Add this import

const GlobalStyles = createGlobalStyle`
  // ...existing styles...

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
`;

const AdminCard = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
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
`;

const TicketCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const QRScannerButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  &:hover {
    opacity: 0.9;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  backdrop-filter: blur(10px);

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

const ScannerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ScannerContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

type TabType = 'users' | 'tickets';

const AdminScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

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

  const handleScan = async (ticketId: string) => {
    try {
      await handleValidateTicket(ticketId);
    } catch (error) {
      toast.error('Failed to scan ticket');
    }
  };

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

        {activeTab === 'tickets' && (
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                {isScannerOpen ? 'Close Scanner' : 'Scan QR Code'}
              </QRScannerButton>
            </motion.div>

            <AnimatePresence>
              {isScannerOpen && (
                <ScannerOverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ScannerContainer
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <CloseButton
                      onClick={() => setIsScannerOpen(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX size={20} />
                    </CloseButton>
                    <QRScanner
                      onScan={handleScan}
                      onError={(error) => toast.error(error)}
                    />
                  </ScannerContainer>
                </ScannerOverlay>
              )}
            </AnimatePresence>
          </>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'users' ? (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <UsersGrid>
                {users.map(user => (
                  <UserCard
                    key={user.uid}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <UserInfo>
                      <h3>{user.email}</h3>
                      <p>Role: {user.role}</p>
                      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </UserInfo>
                    
                    <RoleToggle
                      $isAdmin={user.role === 'admin'}
                      onClick={() => toggleUserRole(user)}
                    >
                      {user.role === 'admin' ? (
                        <>
                          <FiUserX size={16} />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <FiUserCheck size={16} />
                          Make Admin
                        </>
                      )}
                    </RoleToggle>
                  </UserCard>
                ))}
              </UsersGrid>
            </motion.div>
          ) : (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TicketsGrid>
                {(searchQuery ? filteredTickets : tickets).map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                  >
                    <h3>{ticket.eventDetails.title}</h3>
                    <StatusBadge status={ticket.status}>
                      {ticket.status.toUpperCase()}
                    </StatusBadge>
                    <p>Ticket #: {ticket.ticketNumber}</p>
                    <p>User: {ticket.userId}</p>
                    <p>Date: {new Date(ticket.eventDetails.date).toLocaleDateString()}</p>
                    <p>Purchased: {new Date(ticket.purchasedAt).toLocaleDateString()}</p>
                    
                    {ticket.status === 'valid' && (
                      <TicketActions>
                        <ActionButton
                          $variant="verify"
                          onClick={() => handleValidateTicket(ticket.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiCheck size={16} />
                          Validate
                        </ActionButton>
                        <ActionButton
                          $variant="cancel"
                          onClick={() => handleCancelTicket(ticket.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiX size={16} />
                          Cancel
                        </ActionButton>
                      </TicketActions>
                    )}
                  </TicketCard>
                ))}
              </TicketsGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminCard>
    </Container>
  );
};

export default AdminScreen;