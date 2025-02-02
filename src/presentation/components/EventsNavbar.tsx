import { useProfile } from '../../shared/context/ProfileContext';
import { useAuth } from '../../shared/context/AuthContext';

// Add this styled component
const UserAvatar = styled.div<{ imageUrl?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) no-repeat center/cover`
    : 'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
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
    // ...existing code...
    <UserAvatar imageUrl={profileImage}>
      {!profileImage && currentUser?.email && getInitials(currentUser.email)}
    </UserAvatar>
    // ...existing code...
  );
};
