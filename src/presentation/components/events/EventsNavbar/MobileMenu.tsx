import { FiTag } from 'react-icons/fi'; // Changed from FiTicket to FiTag
// ...existing imports...

export const MobileMenu: React.FC = () => {
  // ...existing code...
  
  return (
    <MobileMenuContent>
      <IconButton onClick={() => navigate('/my-tickets')}>
        <FiTag size={18} /> {/* Changed from FiTicket to FiTag */}
        View Tickets
      </IconButton>
      {/* ...existing menu items... */}
    </MobileMenuContent>
  );
};
