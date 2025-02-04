import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUsers, FiTag } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import UserAdminScreen from './admin/UserAdminScreen';
import TicketAdminScreen from './admin/TicketAdminScreen';
import { pageTransition, tabVariants, iconVariants } from '../../shared/animations';

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

type TabType = 'users' | 'tickets';

const AdminScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Set initial tab based on route
    if (location.pathname.includes('/admin/tickets')) {
      return 'tickets';
    }
    return 'users';
  });

  useEffect(() => {
    // Update URL when tab changes
    if (activeTab === 'users') {
      navigate('/admin/users');
    } else if (activeTab === 'tickets') {
      navigate('/admin/tickets');
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    // Update tab when URL changes
    if (location.pathname.includes('/admin/tickets')) {
      setActiveTab('tickets');
    } else if (location.pathname.includes('/admin/users')) {
      setActiveTab('users');
    }
  }, [location]);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
  };

  const handleBackClick = () => {
    navigate('/events');
  };

  return (
    <Container>
      <BackButton onClick={handleBackClick} />
      <AdminCard
        as={motion.div}
        {...pageTransition}
      >
        <TabContainer
          as={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 1
          }}
        >
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
          {activeTab === 'users' ? <UserAdminScreen /> : <TicketAdminScreen />}
        </ContentWrapper>
      </AdminCard>
    </Container>
  );
};

export default AdminScreen;