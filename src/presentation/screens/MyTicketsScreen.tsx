import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTag, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';
import BackButton from '../components/BackButton';
import { toast } from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  color: ${props => props.theme.text};
  margin: 20px 0;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TicketsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TicketCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  }
`;

const EventTitle = styled.h3`
  font-size: 1.4rem;
  color: ${props => props.theme.text};
  margin-bottom: 15px;
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

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.text}CC;
  font-size: 0.9rem;
  margin-bottom: 10px;

  svg {
    color: #6e8efb;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.text}CC;

  svg {
    font-size: 48px;
    margin-bottom: 20px;
    color: #6e8efb;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    opacity: 0.7;
  }
`;

const MyTicketsScreen: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!currentUser?.uid) return;
      try {
        const userTickets = await ticketService.getUserTickets(currentUser.uid);
        setTickets(userTickets.sort((a, b) => 
          new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
        ));
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentUser]);

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <Container>
      <Header>
        <BackButton />
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Tickets
        </Title>
      </Header>

      <AnimatePresence>
        {!loading && tickets.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiTag size={48} />
            <h3>No Tickets Found</h3>
            <p>You haven't purchased any tickets yet.</p>
          </EmptyState>
        ) : (
          <TicketsGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {tickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StatusBadge status={ticket.status}>
                  {ticket.status.toUpperCase()}
                </StatusBadge>
                <EventTitle>{ticket.eventDetails.title}</EventTitle>
                
                <InfoRow>
                  <FiCalendar size={16} />
                  {new Date(ticket.eventDetails.date).toLocaleDateString()}
                </InfoRow>
                
                <InfoRow>
                  <FiMapPin size={16} />
                  {ticket.eventDetails.location}
                </InfoRow>
                
                <InfoRow>
                  <FiClock size={16} />
                  Purchased: {new Date(ticket.purchasedAt).toLocaleString()}
                </InfoRow>
              </TicketCard>
            ))}
          </TicketsGrid>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default MyTicketsScreen;
