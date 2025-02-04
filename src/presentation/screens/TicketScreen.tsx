import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';
import BackButton from '../components/BackButton';
import { FiClock, FiCheck, FiX, FiUser, FiShare2 } from 'react-icons/fi';
import createTicketPDF from '../../shared/utils/pdfGenerator';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
`;

const TicketCard = styled(motion.div)`
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const QRCodeContainer = styled.div`
  width: 250px;
  height: 250px;
  margin: 20px auto;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }
`;

const TicketInfo = styled.div`
  margin-top: 20px;
  color: ${props => props.theme.text};

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  p {
    margin: 10px 0;
    font-size: 1rem;
  }
`;

const ProgressSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 25px 0;
  align-items: center;
`;

const ProgressContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
  position: relative;
`;

const ProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  .value {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${props => props.theme.text};
  }

  .label {
    font-size: 0.8rem;
    color: ${props => props.theme.textSecondary};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 25px 0;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 12px;
  text-align: center;

  .label {
    color: ${props => props.theme.textSecondary};
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.theme.text};
    background: linear-gradient(135deg, #6e8efb, #4a6cf7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ValidationHistory = styled.div`
  margin-top: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;

  h3 {
    padding: 15px;
    font-size: 1.1rem;
    color: ${props => props.theme.text};
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ValidationItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .validation-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .count {
      background: rgba(74, 108, 247, 0.2);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.9rem;
    }
  }

  .validation-time {
    font-size: 0.9rem;
    color: ${props => props.theme.textSecondary};
  }
`;

const ShareButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  margin-top: 25px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  background: ${props => {
    switch (props.$status) {
      case 'valid': return 'rgba(46, 213, 115, 0.15)';
      case 'partially_used': return 'rgba(255, 165, 0, 0.15)';
      case 'used': return 'rgba(255, 71, 87, 0.15)';
      default: return 'rgba(255, 71, 87, 0.15)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'valid': return '#2ed573';
      case 'partially_used': return '#ffa502';
      case 'used': return '#ff4757';
      default: return '#ff4757';
    }
  }};
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #4a6cf7;
  margin: 50px auto;
`;

const ValidationSummary = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;

  h3 {
    margin-bottom: 15px;
    font-size: 1.1rem;
    color: ${props => props.theme.text};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const SummaryItem = styled.div<{ $type?: 'used' | 'remaining' | 'total' }>`
  padding: 12px;
  background: ${props => {
    switch (props.$type) {
      case 'used': return 'rgba(255, 71, 87, 0.1)';
      case 'remaining': return 'rgba(46, 213, 115, 0.1)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  }};
  border-radius: 8px;
  text-align: center;

  .value {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${props => {
      switch (props.$type) {
        case 'used': return '#ff4757';
        case 'remaining': return '#2ed573';
        default: return props.theme.text;
      }
    }};
  }

  .label {
    font-size: 0.9rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 5px;
  }
`;

const LastUpdated = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  text-align: right;
  margin-top: 10px;
`;

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'valid': return <FiCheck size={16} />;
    case 'partially_used': return <FiClock size={16} />;
    case 'used': return <FiX size={16} />;
    default: return <FiX size={16} />;
  }
};

const getStatusColor = (status: string, percentage: number) => {
  switch (status) {
    case 'used':
      return '#ff4757';
    case 'partially_used':
      return `rgba(255, 165, 0, ${1 - percentage / 100})`;
    case 'valid':
      return `rgba(46, 213, 115, ${1 - percentage / 100})`;
    default:
      return '#ff4757';
  }
};

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg,
    ${props => props.theme.background},
    rgba(255, 255, 255, 0.1),
    ${props => props.theme.background}
  );
  background-size: 200% 100%;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0% {
      background-position: 100% 0%;
    }
    100% {
      background-position: -100% 0%;
    }
  }
`;

const SkeletonCard = styled(motion.div)`
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const SkeletonQRCode = styled.div`
  width: 250px;
  height: 250px;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
`;

const SkeletonTitle = styled.div`
  height: 32px;
  width: 70%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
`;

const SkeletonBadge = styled.div`
  height: 28px;
  width: 120px;
  border-radius: 20px;
  margin-bottom: 25px;
  overflow: hidden;
`;

const SkeletonSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  overflow: hidden;
`;

const SkeletonSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const SkeletonSummaryItem = styled.div`
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
`;

const SkeletonProgress = styled.div`
  width: 150px;
  height: 150px;
  margin: 30px auto;
  border-radius: 50%;
  overflow: hidden;
`;

const SkeletonText = styled.div<{ width?: string }>`
  height: 16px;
  width: ${props => props.width || '100%'};
  margin: 12px 0;
  border-radius: 4px;
  overflow: hidden;
`;

const LoadingSkeleton: React.FC = () => (
  <Container>
    <BackButton onClick={() => navigate(-1)} />
    <SkeletonCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SkeletonQRCode>
        <SkeletonPulse />
      </SkeletonQRCode>

      <SkeletonTitle>
        <SkeletonPulse />
      </SkeletonTitle>

      <SkeletonBadge>
        <SkeletonPulse />
      </SkeletonBadge>

      <SkeletonSummary>
        <SkeletonText width="30%">
          <SkeletonPulse />
        </SkeletonText>
        <SkeletonSummaryGrid>
          {[1, 2, 3].map((i) => (
            <SkeletonSummaryItem key={i}>
              <SkeletonPulse />
            </SkeletonSummaryItem>
          ))}
        </SkeletonSummaryGrid>
      </SkeletonSummary>

      <SkeletonProgress>
        <SkeletonPulse />
      </SkeletonProgress>

      {[1, 2, 3, 4].map((i) => (
        <SkeletonText key={i} width={`${Math.random() * 30 + 60}%`}>
          <SkeletonPulse />
        </SkeletonText>
      ))}
    </SkeletonCard>
  </Container>
);

const TicketScreen: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = ticketService.subscribeToTicketUpdates(ticketId, (updatedTicket) => {
      setTicket(updatedTicket);
    });

    return () => {
      unsubscribe();
    };
  }, [ticketId]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketData = await ticketService.getTicket(ticketId);
        setTicket(ticketData);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load ticket details');
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleShare = async () => {
    if (!ticket) return;
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Generating ticket PDF...');
      
      // Generate PDF
      const pdfBlob = await createTicketPDF(ticket);
      
      // Create a file from the blob
      const file = new File([pdfBlob], `${ticket.eventDetails.title}-Ticket.pdf`, {
        type: 'application/pdf'
      });

      // Check if native sharing is supported
      if (navigator.share && navigator.canShare({ files: [file] })) {
        // Use native sharing
        await navigator.share({
          title: `Ticket for ${ticket.eventDetails.title}`,
          text: `My ticket for ${ticket.eventDetails.title}`,
          files: [file]
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${ticket.eventDetails.title}-Ticket.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Ticket PDF downloaded successfully!');
      }
      
      // Clear loading toast
      toast.dismiss(loadingToast);
    } catch (error) {
      console.error('Error sharing ticket:', error);
      toast.error('Unable to share ticket');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Container>
        <TicketCard>
          <div style={{ textAlign: 'center', color: '#ff4757' }}>
            <FiX size={48} />
            <h2>Error Loading Ticket</h2>
            <p>{error}</p>
            <ShareButton onClick={() => navigate('/tickets')}>
              Go Back to Tickets
            </ShareButton>
          </div>
        </TicketCard>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container>
        <TicketCard>
          <div style={{ textAlign: 'center' }}>
            <h2>No Ticket Found</h2>
            <ShareButton onClick={() => navigate('/tickets')}>
              Go Back to Tickets
            </ShareButton>
          </div>
        </TicketCard>
      </Container>
    );
  }

  const usedCount = ticket.usedCount;
  const usagePercentage = Math.min((usedCount / ticket.quantity) * 100, 100);
  const status = ticket.status;

  console.log('Ticket Screen Status:', {
    validationsRemaining: ticket.validationsRemaining,
    quantity: ticket.quantity,
    usedCount,
    firebaseStatus: ticket.status,
    status,
    usagePercentage
  });

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)} />
      <TicketCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {ticket.qrCode ? (
          <QRCodeContainer>
            <img 
              src={ticket.qrCode} 
              alt="Ticket QR Code"
              onError={(e) => {
                console.error('Error loading QR code');
                e.currentTarget.style.display = 'none';
              }}
            />
          </QRCodeContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>QR Code not available</p>
          </div>
        )}

        <TicketInfo>
          <h2>{ticket.eventDetails.title}</h2>
          <StatusBadge $status={status}>
            {getStatusIcon(status)} {status.replace('_', ' ')}
          </StatusBadge>

          <ValidationSummary>
            <h3>Ticket Summary</h3>
            <SummaryGrid>
              <SummaryItem $type="total">
                <div className="value">{ticket.quantity}</div>
                <div className="label">Total</div>
              </SummaryItem>
              <SummaryItem $type="used">
                <div className="value">{usedCount}</div>
                <div className="label">Used</div>
              </SummaryItem>
              <SummaryItem $type="remaining">
                <div className="value">{ticket.validationsRemaining}</div>
                <div className="label">Remaining</div>
              </SummaryItem>
            </SummaryGrid>
            {ticket.validationSummary && (
              <LastUpdated>
                Last updated: {new Date(ticket.validationSummary.lastUpdated).toLocaleString()}
              </LastUpdated>
            )}
          </ValidationSummary>

          <ProgressSection>
            <ProgressContainer>
              <CircularProgressbar
                value={usagePercentage}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: getStatusColor(status, usagePercentage),
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  pathTransitionDuration: 0.5,
                })}
              />
              <ProgressLabel>
                <div className="value">{usedCount}</div>
                <div className="label">Used</div>
              </ProgressLabel>
            </ProgressContainer>
          </ProgressSection>

          <p>Event Date: {new Date(ticket.eventDetails.date).toLocaleDateString()}</p>
          <p>Location: {ticket.eventDetails.location}</p>
          <p>Ticket #: {ticket.ticketNumber}</p>
          <p>Purchased: {new Date(ticket.purchasedAt).toLocaleString()}</p>
          {ticket.lastValidatedAt && (
            <p>Last Used: {new Date(ticket.lastValidatedAt).toLocaleString()}</p>
          )}

          {ticket.validations?.length > 0 && (
            <ValidationHistory>
              <h3>Validation History ({ticket.validations.length})</h3>
              <AnimatePresence>
                {ticket.validations.map((validation, index) => (
                  <ValidationItem
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="validation-info">
                      <FiUser size={16} />
                      <span className="count">{validation.count} ticket(s)</span>
                    </div>
                    <span className="validation-time">
                      {new Date(validation.timestamp).toLocaleString()}
                    </span>
                  </ValidationItem>
                ))}
              </AnimatePresence>
            </ValidationHistory>
          )}
        </TicketInfo>

        {ticket.validationsRemaining > 0 && (
          <ShareButton
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiShare2 size={18} />
            Share Ticket
          </ShareButton>
        )}
      </TicketCard>
    </Container>
  );
};

export default TicketScreen;