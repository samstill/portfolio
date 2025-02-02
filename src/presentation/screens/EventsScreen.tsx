import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiUser, FiHome, FiPlusCircle, FiMessageSquare, FiSettings, FiBookmark } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';
import { auth } from '../../firebase';
import { messageService } from '../../firebase/services/messageService';
import { toast, Toaster } from 'react-hot-toast';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from '../components/events/EventCard';
import { EventsNavbar } from '../components/events/EventsNavbar';
import { LoadingCard } from '../components/common/LoadingCard';
import {
  Container,
  EventsGrid,
  IconButton,
  MobileMenuContent
} from '../styles/EventsStyles';
import { EventsFilter } from '../components/events/EventsFilter';
import styled from 'styled-components';
import { eventService } from '../../firebase/services/eventService';

const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 999;
`;

const TicketBadge = styled.span<{ $available: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background: ${props => props.$available > 0 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.$available > 0 ? '#4ade80' : '#ef4444'};
`;

const EventsScreen: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { events, loading, error, setFilters, setSort, deleteEvent } = useEvents();

  useEffect(() => {
    if (isAdmin) {
      const fetchUnreadCount = async () => {
        const count = await messageService.getUnreadCount();
        setUnreadMessages(count);
      };
      fetchUnreadCount();
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out');
    }
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleBookEvent = (id: string) => {
    navigate(`/events/${id}/book`);
  };

  return (
    <Container>
      <Toaster position="top-right" />
      <EventsNavbar unreadMessages={unreadMessages} />

      <EventsFilter
        onFilterChange={setFilters}
        onSortChange={setSort}
      />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MenuOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileMenuContent
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {isAdmin && (
                <>
                  <IconButton $variant="navbar" onClick={handleCreateEvent}>
                    <FiPlusCircle size={18} />
                    Create Event
                  </IconButton>
                  <IconButton onClick={() => navigate('/messages')}>
                    <FiMessageSquare size={18} />
                    Messages
                    {unreadMessages > 0 && (
                      <span className="badge">
                        {unreadMessages > 99 ? '99+' : unreadMessages}
                      </span>
                    )}
                  </IconButton>
                  <IconButton onClick={() => navigate('/admin')}>
                    <FiSettings size={18} />
                    Admin Panel
                  </IconButton>
                </>
              )}
              <IconButton onClick={() => navigate('/')}>
                <FiHome size={18} />
                Home
              </IconButton>
              <IconButton onClick={() => navigate('/profile')}>
                <FiUser size={18} />
                Profile
              </IconButton>
              <IconButton onClick={handleLogout}>
                <FiLogOut size={18} />
                Logout
              </IconButton>
            </MobileMenuContent>
          </>
        )}
      </AnimatePresence>

      <EventsGrid>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <LoadingCard key={index} />
          ))
        ) : events.length > 0 ? (
          events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isAdmin={isAdmin}
              onDelete={handleDeleteEvent}
              onBook={handleBookEvent}
              ticketInfo={
                <TicketBadge $available={event.availableTickets || 0}>
                  <FiBookmark size={14} />
                  {event.availableTickets || 0} available
                </TicketBadge>
              }
            />
          ))
        ) : (
          <div>No events found</div>
        )}
      </EventsGrid>
    </Container>
  );
};

export default EventsScreen;