import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUserCheck, FiUsers, FiKey, FiMail, FiCalendar, FiActivity, FiArrowLeft, FiTrash2, FiLoader, FiTag, FiCheckCircle, FiXCircle, FiCreditCard, FiDollarSign, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { UserData } from '../../shared/types/user';
import { userService } from '../../firebase/services/userService';
import { ticketService } from '../../firebase/services/ticketService';
import { Ticket } from '../../domain/entities/Ticket';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
  background: linear-gradient(135deg, ${props => props.theme.background}, ${props => props.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`;

const Card = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 25px;
  }
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

const Header = styled.div`
  margin-bottom: 35px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin: 0 0 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const UserEmail = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: break-all;
  overflow-wrap: break-word;
  line-height: 1.4;
  max-width: 100%;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    
    svg {
      margin-bottom: 2px;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 0 10px;
  }
`;

const Section = styled.div`
  margin-bottom: 35px;

  h2 {
    font-size: 1.3rem;
    color: ${props => props.theme.text};
    margin: 0 0 20px;
    font-weight: 600;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  .label {
    font-size: 0.9rem;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .value {
    font-size: 1.1rem;
    color: ${props => props.theme.text};
    font-weight: 500;
    word-break: break-all;
    overflow-wrap: break-word;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    padding: 15px;
    
    .label {
      font-size: 0.85rem;
    }
    
    .value {
      font-size: 1rem;
    }
  }
`;

const ActionButton = styled(motion.button)<{ $variant: 'primary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.$variant === 'primary' ? 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)' : 
    'rgba(244, 67, 54, 0.1)'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#F44336'};
  border: 1px solid ${props => props.$variant === 'primary' ? 'transparent' : '#F44336'};
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'primary' ?
      '0 8px 20px rgba(74, 108, 247, 0.3)' :
      '0 8px 20px rgba(244, 67, 54, 0.2)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;

const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${props => props.$imageUrl ? 
    `url(${props.$imageUrl}) no-repeat center/cover` : 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const DangerZone = styled(Section)`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    color: #dc3545;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid #dc3545;

  &:hover {
    background: rgba(220, 53, 69, 0.2);
    box-shadow: 0 8px 20px rgba(220, 53, 69, 0.2);
  }
`;

const ConfirmationOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ConfirmationDialog = styled(motion.div)`
  background: ${props => props.theme.background};
  padding: 35px;
  border-radius: 24px;
  max-width: 450px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  position: relative;

  h3 {
    color: #dc3545;
    margin: 0 0 20px;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      font-size: 1.6rem;
    }
  }

  p {
    color: ${props => props.theme.textSecondary};
    margin-bottom: 30px;
    line-height: 1.6;
    font-size: 1.05rem;
  }

  @media (max-width: 768px) {
    padding: 25px;
    margin: 0 15px;

    h3 {
      font-size: 1.3rem;
      margin: 0 0 15px;
    }

    p {
      font-size: 1rem;
      margin-bottom: 25px;
    }
  }
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`;

const LoadingSpinner = styled(motion.div)`
  display: inline-block;
  margin-right: 8px;
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonLine = styled.div<{ width?: string; height?: string; margin?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  margin: ${({ margin }) => margin || '10px 0'};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const SkeletonAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 1.5s infinite;
  }

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
  }
`;

const SkeletonButton = styled.div`
  width: 140px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const TransactionSection = styled(Section)`
  margin-top: 20px;
`;

const TransactionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const TransactionTitle = styled.h3`
  font-size: 1.1rem;
  color: ${props => props.theme.text};
  margin: 0;
  font-weight: 500;
`;

const TransactionAmount = styled.div<{ type: 'payment' | 'refund' }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.type === 'payment' ? '#4CAF50' : '#F44336'};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const ViewAllButton = styled(ActionButton)`
  margin-top: 20px;
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);

  h3 {
    font-size: 1.4rem;
    color: ${props => props.theme.text};
    margin: 20px 0 10px;
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.textSecondary};
  }
`;

const UserDetailSkeleton: React.FC = () => {
  return (
    <Container>
      <Card {...pageTransition}>
        <BackButton
          as="div"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SkeletonLine width="120px" height="24px" margin="0" />
        </BackButton>

        <Header>
          <HeaderContent>
            <AvatarContainer>
              <SkeletonAvatar />
            </AvatarContainer>
            <UserInfo>
              <SkeletonLine width="200px" height="32px" margin="0 0 15px 0" />
              <SkeletonLine width="250px" height="20px" margin="0" />
            </UserInfo>
          </HeaderContent>
        </Header>

        <Section>
          <SkeletonLine width="180px" height="24px" margin="0 0 20px 0" />
          <Grid>
            {[1, 2, 3, 4].map((i) => (
              <InfoCard key={i} as="div">
                <SkeletonLine width="100px" height="16px" margin="0 0 8px 0" />
                <SkeletonLine width="140px" height="20px" margin="0" />
              </InfoCard>
            ))}
          </Grid>
        </Section>

        <Section>
          <SkeletonLine width="120px" height="24px" margin="0 0 20px 0" />
          <ActionsGrid>
            <SkeletonButton />
            <SkeletonButton />
          </ActionsGrid>
        </Section>
      </Card>
    </Container>
  );
};

const UserDetailScreen: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        const userData = await userService.getUserById(userId);
        setUser(userData);
        
        // Fetch user's tickets
        const userTickets = await ticketService.getTicketsByUserId(userId);
        setTickets(userTickets);

        // Get recent transactions from tickets
        const transactions = userTickets
          .map(ticket => ({
            id: ticket.id,
            eventTitle: ticket.eventDetails.title,
            amount: ticket.amountPaid,
            type: 'payment',
            date: ticket.purchasedAt,
            paymentMode: ticket.paymentMode,
            ticketNumber: ticket.ticketNumber,
            transactionId: ticket.transactionId
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);

        setRecentTransactions(transactions);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Calculate ticket statistics
  const ticketStats = {
    total: tickets.length,
    valid: tickets.filter(t => t.status === 'valid').length,
    used: tickets.filter(t => t.status === 'used' || t.status === 'partially_used').length,
    cancelled: tickets.filter(t => t.status === 'cancelled').length
  };

  const handleToggleRole = async () => {
    if (!user) return;
    
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await userService.updateUserRole(user.uid, newRole);
      setUser(prev => prev ? { ...prev, role: newRole } : null);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    
    try {
      await userService.sendPasswordResetEmail(user.email);
      toast.success('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send password reset email');
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // First check if user is admin
      if (user.role === 'admin') {
        toast.error('Cannot delete admin users');
        setShowDeleteConfirmation(false);
        return;
      }

      const result = await userService.deleteUser(user.uid);
      
      if (result.success) {
        setShowDeleteConfirmation(false);
        
        if (result.partialDeletion) {
          // Show warning toast with longer duration
          toast((t) => (
            <div>
              <b>⚠️ Partial Deletion</b>
              <br />
              {result.message}
              <br />
              <small>Please contact support for assistance.</small>
            </div>
          ), {
            duration: 8000,
            style: {
              background: '#FFF3CD',
              color: '#856404',
              border: '1px solid #FFEEBA',
              padding: '16px',
            }
          });
        } else {
          toast.success(result.message);
        }
        
        // Redirect with a slight delay to ensure toast is visible
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Show error toast with more details
      toast.error(
        <div>
          <b>Error Deleting User</b>
          <br />
          {error instanceof Error ? error.message : 'Failed to delete user'}
          <br />
          <small>Please try again or contact support.</small>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <UserDetailSkeleton />;
  }

  if (!user) {
    return <Container>User not found</Container>;
  }

  return (
    <Container>
      <Card {...pageTransition}>
        <BackButton
          onClick={() => navigate('/admin')}
          whileHover={{ x: -4 }}
        >
          <FiArrowLeft /> Back to Users
        </BackButton>

        <Header>
          <HeaderContent>
            <AvatarContainer>
              <Avatar $imageUrl={user?.profilePhoto}>
                {!user?.profilePhoto && user?.email && getInitials(user.email)}
              </Avatar>
            </AvatarContainer>
            <UserInfo>
              <Title>User Details</Title>
              <UserEmail>
                <FiMail />
                {user?.email}
              </UserEmail>
            </UserInfo>
          </HeaderContent>
        </Header>

        <Section>
          <h2>User Information</h2>
          <Grid>
            <InfoCard>
              <div className="label">
                <FiUsers /> User ID
              </div>
              <div className="value">{user?.uid}</div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiUserCheck /> Role
              </div>
              <div className="value" style={{ textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiCalendar /> Created At
              </div>
              <div className="value">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiActivity /> Total Tickets
              </div>
              <div className="value">{ticketStats.total}</div>
            </InfoCard>
          </Grid>
        </Section>

        <Section>
          <h2>Ticket Statistics</h2>
          <Grid>
            <InfoCard>
              <div className="label">
                <FiTag /> Available Tickets
              </div>
              <div className="value" style={{ color: '#4CAF50' }}>{ticketStats.valid}</div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiCheckCircle /> Used Tickets
              </div>
              <div className="value" style={{ color: '#FFC107' }}>{ticketStats.used}</div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiXCircle /> Cancelled Tickets
              </div>
              <div className="value" style={{ color: '#F44336' }}>{ticketStats.cancelled}</div>
            </InfoCard>
          </Grid>
          <ActionButton
            $variant="primary"
            onClick={() => navigate(`/admin/users/${userId}/tickets`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: '20px', width: 'fit-content' }}
          >
            <FiTag />
            View All Tickets
          </ActionButton>
        </Section>

        <Section>
          <h2>Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <>
              {recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <TransactionHeader>
                    <TransactionTitle>{transaction.eventTitle}</TransactionTitle>
                    <TransactionAmount type={transaction.type}>
                      <span style={{ fontFamily: 'Arial' }}>₹</span>
                      {transaction.amount.toFixed(2)}
                    </TransactionAmount>
                  </TransactionHeader>
                  <TransactionDetails>
                    <TransactionInfo>
                      <FiClock />
                      {new Date(transaction.date).toLocaleDateString()}
                    </TransactionInfo>
                    <TransactionInfo>
                      <FiCreditCard />
                      {transaction.paymentMode}
                    </TransactionInfo>
                    <TransactionInfo>
                      <FiTag />
                      {transaction.ticketNumber}
                    </TransactionInfo>
                  </TransactionDetails>
                </TransactionCard>
              ))}
              <ViewAllButton
                $variant="primary"
                onClick={() => navigate(`/admin/users/${userId}/transactions`)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiCreditCard />
                View All Transactions
              </ViewAllButton>
            </>
          ) : (
            <EmptyState
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FiCreditCard size={32} />
              <h3>No Transactions</h3>
              <p>This user hasn't made any transactions yet.</p>
            </EmptyState>
          )}
        </Section>

        <Section>
          <h2>Actions</h2>
          <ActionsGrid>
            <ActionButton
              $variant="primary"
              onClick={handleToggleRole}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUserCheck />
              {user?.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </ActionButton>
            <ActionButton
              $variant="primary"
              onClick={handleResetPassword}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiKey />
              Reset Password
            </ActionButton>
          </ActionsGrid>
        </Section>

        {user?.role !== 'admin' && (
          <DangerZone>
            <h2>
              <FiTrash2 /> Danger Zone
            </h2>
            <ActionsGrid>
              <DeleteButton
                $variant="danger"
                onClick={() => setShowDeleteConfirmation(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiTrash2 />
                Delete User Account
              </DeleteButton>
            </ActionsGrid>
          </DangerZone>
        )}
      </Card>

      <AnimatePresence>
        {showDeleteConfirmation && (
          <ConfirmationOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && setShowDeleteConfirmation(false)}
          >
            <ConfirmationDialog
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>
                <FiTrash2 /> Delete User Account
              </h3>
              <p>
                Are you sure you want to delete this user account? This action is permanent and will:
                <br />• Remove all user data
                <br />• Delete associated authentication
                <br />• Remove access to all services
              </p>
              <DialogButtons>
                <ActionButton
                  $variant="primary"
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </ActionButton>
                <DeleteButton
                  $variant="danger"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <FiLoader size={16} />
                      </LoadingSpinner>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={16} />
                      Delete Account
                    </>
                  )}
                </DeleteButton>
              </DialogButtons>
            </ConfirmationDialog>
          </ConfirmationOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default UserDetailScreen; 