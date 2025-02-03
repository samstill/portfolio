import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUserCheck, FiUsers, FiKey, FiMail, FiCalendar, FiActivity, FiArrowLeft } from 'react-icons/fi';
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

const UserDetailScreen: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        const userData = await userService.getUserById(userId);
        setUser(userData);
        
        // Fetch user's tickets count
        const tickets = await ticketService.getTicketsByUserId(userId);
        setTicketCount(tickets.length);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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

  if (loading) {
    return <Container>Loading...</Container>;
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
          <Title>User Details</Title>
          <UserEmail>
            <FiMail />
            {user.email}
          </UserEmail>
        </Header>

        <Section>
          <h2>User Information</h2>
          <Grid>
            <InfoCard>
              <div className="label">
                <FiUsers /> User ID
              </div>
              <div className="value">{user.uid}</div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiUserCheck /> Role
              </div>
              <div className="value" style={{ textTransform: 'capitalize' }}>
                {user.role}
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiCalendar /> Created At
              </div>
              <div className="value">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">
                <FiActivity /> Total Tickets
              </div>
              <div className="value">{ticketCount}</div>
            </InfoCard>
          </Grid>
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
              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
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
      </Card>
    </Container>
  );
};

export default UserDetailScreen; 