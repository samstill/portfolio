import { useProfile } from '../../shared/context/ProfileContext';
import { useAuth } from '../../shared/context/AuthContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope } from 'react-icons/fa';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const NavbarBrand = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

// Add this styled component
const UserAvatar = styled.div<{ $imageUrl?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$imageUrl 
    ? `url(${props.$imageUrl}) no-repeat center/cover` 
    : 'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
`;

// Add this styled component for the messenger icon
const MessengerIcon = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6cf7;
  font-size: 1.2rem;
  margin-right: 16px;
  text-decoration: none;
  
  &:hover {
    color: #6e8efb;
  }
  
  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff4b4b;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavbarIconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #555;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #4a6cf7;
  }
`;

const EventsNavbar: React.FC = () => {
  const { currentUser } = useAuth();
  const { profileImage } = useProfile();

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <NavbarContainer>
      <NavbarBrand>EventHub</NavbarBrand>
      
      <NavLinks>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/my-tickets">My Tickets</NavLink>
        {currentUser?.isAdmin && (
          <NavLink to="/admin">Admin</NavLink>
        )}
      </NavLinks>
      
      <NavbarIconsContainer>
        <MessengerIcon to="/messenger">
          <FaEnvelope />
          {/* Uncomment and implement if you want unread message notifications */}
          {/* {unreadMessages > 0 && (
            <span className="notification-badge">{unreadMessages}</span>
          )} */}
        </MessengerIcon>
        
        <Link to="/profile">
          <UserAvatar $imageUrl={profileImage}>
            {!profileImage && currentUser?.email && getInitials(currentUser.email)}
          </UserAvatar>
        </Link>
      </NavbarIconsContainer>
    </NavbarContainer>
  );
};

export default EventsNavbar;
