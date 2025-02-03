import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin, FiTag, FiClock, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Ticket } from '../../domain/entities/Ticket';
import { ticketService } from '../../firebase/services/ticketService';
import { userService } from '../../firebase/services/userService';
import { UserData } from '../../shared/types/user';
import { LoadingCard } from '../components/common/LoadingCard';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
  background: linear-gradient(135deg, ${props => props.theme.background}, ${props => props.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 30px;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 25px;
  padding: 0;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin: 0 0 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto 30px;
  padding: 0 15px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 15px;
    margin: 0 auto 20px;
    max-width: 100%;
  }
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 15px 20px;
  padding-right: 45px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 12px 40px 12px 15px;
    font-size: 0.95rem;
  }
`;

const ClearButton = styled(motion.button)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const TicketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TicketCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const EventTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin: 0 0 15px;
  padding-right: 80px;
`;

const StatusBadge = styled.span<{ status: Ticket['status'] }>`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'valid': return 'rgba(76, 175, 80, 0.2)';
      case 'partially_used': return 'rgba(255, 152, 0, 0.2)';
      case 'used': return 'rgba(255, 193, 7, 0.2)';
      case 'cancelled': return 'rgba(244, 67, 54, 0.2)';
      default: return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'valid': return '#4CAF50';
      case 'partially_used': return '#FF9800';
      case 'used': return '#FFC107';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 8px;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};

  svg {
    font-size: 48px;
    margin-bottom: 20px;
    color: ${props => props.theme.primary};
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: ${props => props.theme.text};
  }

  p {
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingHeader = styled.div`
  margin-bottom: 30px;
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const LoadingState: React.FC = () => {
  return (
    <Container>
      <LoadingContainer>
        <LoadingHeader>
          <LoadingCard />
        </LoadingHeader>
        <LoadingGrid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} />
          ))}
        </LoadingGrid>
      </LoadingContainer>
    </Container>
  );
};

const UserTicketsScreen: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        const [userData, userTickets] = await Promise.all([
          userService.getUserById(userId),
          ticketService.getTicketsByUserId(userId)
        ]);
        
        setUser(userData);
        setTickets(userTickets.sort((a, b) => 
          new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
        ));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchQuery.toLowerCase();
    return (
      ticket.eventDetails.title.toLowerCase().includes(searchLower) ||
      ticket.ticketNumber.toLowerCase().includes(searchLower) ||
      ticket.status.toLowerCase().includes(searchLower)
    );
  });

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container>
      <Header>
        <BackButton
          onClick={() => navigate(`/admin/users/${userId}`)}
          whileHover={{ x: -4 }}
        >
          <FiArrowLeft /> Back to User Details
        </BackButton>
        <Title>Tickets for {user?.email}</Title>
      </Header>

      <SearchContainer>
        <SearchInput
          placeholder="Search tickets by event name, ticket number, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        {searchQuery && (
          <ClearButton
            onClick={() => setSearchQuery('')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiX size={18} />
          </ClearButton>
        )}
      </SearchContainer>

      <AnimatePresence>
        {filteredTickets.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FiTag />
            <h3>No Tickets Found</h3>
            <p>{tickets.length === 0 ? 'This user has no tickets yet.' : 'No tickets match your search.'}</p>
          </EmptyState>
        ) : (
          <TicketsGrid>
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StatusBadge status={ticket.status}>
                  {ticket.status === 'partially_used' ? 'Partially Used' : 
                    ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </StatusBadge>
                <EventTitle>{ticket.eventDetails.title}</EventTitle>
                <InfoRow>
                  <FiCalendar />
                  {new Date(ticket.eventDetails.date).toLocaleDateString()}
                </InfoRow>
                <InfoRow>
                  <FiMapPin />
                  {ticket.eventDetails.location}
                </InfoRow>
                <InfoRow>
                  <FiTag />
                  {ticket.ticketNumber}
                </InfoRow>
                <InfoRow>
                  <FiClock />
                  Purchased: {new Date(ticket.purchasedAt).toLocaleDateString()}
                </InfoRow>
              </TicketCard>
            ))}
          </TicketsGrid>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default UserTicketsScreen; 