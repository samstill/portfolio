import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Ticket } from '../../../domain/entities/Ticket';
import { ticketService } from '../../../firebase/services/ticketService';
import BackButton from '../../components/BackButton';
import TicketValidation from '../TicketValidation';
import { pageTransition } from '../../../shared/animations';
import { Skeleton } from '../../components/Skeleton';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
  background: linear-gradient(135deg, ${props => props.theme.background}, ${props => props.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`;

const ValidationCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4a6cf7;
`;

const SkeletonContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SkeletonHeader = styled.div`
  margin-bottom: 30px;
`;

const SkeletonQRCode = styled.div`
  width: 200px;
  height: 200px;
  margin: 20px auto;
`;

const SkeletonInfo = styled.div`
  display: grid;
  gap: 20px;
  margin-top: 30px;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const LoadingSkeleton: React.FC = () => (
  <Container>
    <BackButton onClick={() => navigate(-1)} />
    <SkeletonContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SkeletonHeader>
        <Skeleton height={32} width="60%" />
      </SkeletonHeader>
      
      <SkeletonQRCode>
        <Skeleton height="100%" />
      </SkeletonQRCode>
      
      <SkeletonInfo>
        <SkeletonRow>
          <Skeleton height={24} />
          <Skeleton height={24} />
        </SkeletonRow>
        <SkeletonRow>
          <Skeleton height={24} />
          <Skeleton height={24} />
        </SkeletonRow>
        <SkeletonRow>
          <Skeleton height={24} />
          <Skeleton height={24} />
        </SkeletonRow>
      </SkeletonInfo>

      <Skeleton height={50} width="100%" style={{ marginTop: '30px' }} />
    </SkeletonContainer>
  </Container>
);

const TicketValidationScreen: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!ticketId) return;
        const ticketData = await ticketService.getTicket(ticketId);
        setTicket(ticketData);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast.error('Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!ticket) {
    return (
      <Container>
        <ValidationCard>
          <div style={{ textAlign: 'center' }}>
            <h2>Ticket Not Found</h2>
            <p>The requested ticket could not be found.</p>
          </div>
        </ValidationCard>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/admin/tickets')} />
      <ValidationCard
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <TicketValidation
          ticket={ticket}
          onValidationComplete={() => {
            if (ticket.id) {
              Promise.all([
                ticketService.getTicket(ticket.id).then(setTicket),
                ticketService.getAllTickets()
              ]);
            }
          }}
        />
      </ValidationCard>
    </Container>
  );
};

export default TicketValidationScreen; 