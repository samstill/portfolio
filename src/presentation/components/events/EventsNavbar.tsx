import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiMessageSquare, 
  FiSettings, 
  FiPlusCircle,
  FiHome,
  FiMoon,
  FiSun,
  FiTag // Changed from FiTicket to FiTag
} from 'react-icons/fi';
import { useAuth } from '../../../shared/context/AuthContext';
import { useProfile } from '../../../shared/context/ProfileContext';
import { useTheme } from '../../../shared/context/ThemeContext';
import NotificationBadge from '../NotificationBadge';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';

const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 20px;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  cursor: pointer;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IconButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  z-index: 999;
  overflow-y: auto;

  /* Add a pseudo-element for additional background blur */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    z-index: -1;
  }
`;

const MobileMenuItem = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
    : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, ${props => props.$active ? '0.2' : '0.1'});
  border-radius: 12px;
  color: ${props => props.$active ? 'white' : props.theme.text};
  cursor: pointer;
  font-size: 1.1rem;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
      : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, ${props => props.$active ? '0.3' : '0.2'});
  }
`;

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const UserMenuItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 12px;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
`;

const AvatarButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const NavAction = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  margin-right: 16px;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

interface EventsNavbarProps {
  unreadMessages?: number;
}

export const EventsNavbar: React.FC<EventsNavbarProps> = ({ unreadMessages = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();
  const { profileImage } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast.error('Failed to log out');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <NavbarContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <NavContent>
        <NavLeft>
          <NavLogo onClick={() => navigate('/')}>
            <FiCalendar size={24} />
            Events
          </NavLogo>
        </NavLeft>

        <NavButtons>
          <NavAction
            onClick={() => navigate('/my-tickets')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTag size={18} /> {/* Changed from FiTicket to FiTag */}
            View Tickets
          </NavAction>

          {isAdmin && (
            <IconButton
              className="hide-mobile"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/events/create')}
            >
              <FiPlusCircle size={16} />
              Create Event
            </IconButton>
          )}
          
          <IconButton
            className="hide-mobile"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <FiHome size={16} />
            Home
          </IconButton>

          <AvatarButton
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar src={profileImage || '/default-avatar.png'} alt="User" />
          </AvatarButton>
        </NavButtons>

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </MobileMenuButton>

        <AnimatePresence>
          {isUserMenuOpen && (
            <UserMenu
              ref={userMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UserMenuItem onClick={() => navigate('/profile')}>
                <FiUser size={18} />
                Profile
              </UserMenuItem>

              {isAdmin && (
                <>
                  <UserMenuItem onClick={() => navigate('/messages')}>
                    <FiMessageSquare size={18} />
                    Messages
                    {unreadMessages > 0 && <NotificationBadge count={unreadMessages} />}
                  </UserMenuItem>

                  <UserMenuItem onClick={() => navigate('/admin')}>
                    <FiSettings size={18} />
                    Admin Panel
                  </UserMenuItem>
                </>
              )}

              <UserMenuItem onClick={handleLogout}>
                <FiLogOut size={18} />
                Logout
              </UserMenuItem>
            </UserMenu>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenu
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: "calc(100vh - 70px)"
              }}
              exit={{ 
                opacity: 0,
                height: 0
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MobileMenuItem
                  $active={isActive('/events')}
                  onClick={() => {
                    navigate('/events');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiCalendar size={20} />
                  Events
                </MobileMenuItem>

                <MobileMenuItem
                  $active={isActive('/my-tickets')}
                  onClick={() => {
                    navigate('/my-tickets');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiTag size={20} />
                  View Tickets
                </MobileMenuItem>

                <MobileMenuItem
                  $active={isActive('/')}
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiHome size={20} />
                  Home
                </MobileMenuItem>

                {isAdmin && (
                  <>
                    <MobileMenuItem
                      onClick={() => {
                        navigate('/events/create');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FiPlusCircle size={20} />
                      Create Event
                    </MobileMenuItem>

                    <MobileMenuItem
                      onClick={() => {
                        navigate('/messages');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FiMessageSquare size={20} />
                      Messages
                      {unreadMessages > 0 && <NotificationBadge count={unreadMessages} />}
                    </MobileMenuItem>

                    <MobileMenuItem
                      onClick={() => {
                        navigate('/admin');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FiSettings size={20} />
                      Admin Panel
                    </MobileMenuItem>
                  </>
                )}

                <MobileMenuItem
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FiUser size={20} />
                  Profile
                </MobileMenuItem>

                <MobileMenuItem onClick={handleLogout}>
                  <FiLogOut size={20} />
                  Logout
                </MobileMenuItem>
              </motion.div>
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavContent>
    </NavbarContainer>
  );
};