import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiPlusCircle, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../../../shared/context/AuthContext';
import NotificationBadge from '../../NotificationBadge';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${props => props.theme.background};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
`;

const NavbarTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const NavbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }
`;

const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

interface EventsNavbarProps {
  unreadMessages: number;
  onMenuClick?: () => void;
}

export const EventsNavbar: React.FC<EventsNavbarProps> = ({
  unreadMessages,
  onMenuClick
}) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <NavbarContainer>
      <NavbarTitle>Events</NavbarTitle>
      
      <NavbarActions>
        {isAdmin && (
          <>
            <IconButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/events/create')}
            >
              <FiPlusCircle size={20} />
            </IconButton>
            
            <IconButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/messages')}
            >
              <IconWrapper>
                <FiMessageSquare size={20} />
                {unreadMessages > 0 && (
                  <NotificationBadge
                    count={unreadMessages}
                    size="small"
                    variant="primary"
                  />
                )}
              </IconWrapper>
            </IconButton>
          </>
        )}
        
        <IconButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
        >
          <FiMenu size={20} />
        </IconButton>
      </NavbarActions>
    </NavbarContainer>
  );
}; 