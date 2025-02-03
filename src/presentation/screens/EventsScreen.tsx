import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiUser, FiHome, FiPlusCircle, FiMessageSquare, FiSettings, FiBookmark, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';
import { auth } from '../../firebase';
import { messageService } from '../../firebase/services/messageService';
import { toast, Toaster } from 'react-hot-toast';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from '../components/events/EventCard';
import { EventsNavbar } from '../components/events/EventsNavbar';
import { LoadingCard } from '../components/common/LoadingCard';
import NotificationBadge from '../components/NotificationBadge';
import { Skeleton } from '../components/Skeleton';
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

const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const NoResults = styled(motion.div)`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  width: 100%;
  max-width: calc(100vw - 40px);
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  svg {
    margin-bottom: 15px;
    opacity: 0.7;
    font-size: 48px;
  }

  p {
    margin: 0;
    max-width: 80%;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 30px 15px;
    font-size: 1rem;
    margin: 15px auto;
    min-height: 180px;
    max-width: calc(100vw - 30px);

    svg {
      font-size: 40px;
      margin-bottom: 12px;
    }

    p {
      max-width: 90%;
    }
  }

  @media (max-width: 480px) {
    padding: 25px 15px;
    min-height: 160px;
    
    svg {
      font-size: 36px;
      margin-bottom: 10px;
    }
  }
`;

const EventCardSkeleton = () => (
  <motion.div
    style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '15px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      height: '100%'
    }}
  >
    <Skeleton height="24px" width="70%" marginbottom="15px" borderradius="4px" />
    <Skeleton height="16px" width="40%" marginbottom="20px" borderradius="4px" />
    <Skeleton height="100px" width="100%" marginbottom="15px" borderradius="4px" />
    <Skeleton height="16px" width="60%" marginbottom="10px" borderradius="4px" />
    <Skeleton height="16px" width="50%" marginbottom="20px" borderradius="4px" />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Skeleton height="32px" width="100px" borderradius="16px" />
      <Skeleton height="32px" width="80px" borderradius="16px" />
    </div>
  </motion.div>
);

interface FilterState {
  searchTerm: string;
  dateRange: { start: Date | null; end: Date | null };
  priceRange: { min: number | null; max: number | null };
  sortOrder: string;
}

const EventsScreen: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    dateRange: { start: null, end: null },
    priceRange: { min: null, max: null },
    sortOrder: 'date-desc'
  });

  // Filter events based on all criteria
  const filterEvents = useCallback((filters: FilterState, eventsList: Event[]) => {
    if (!eventsList.length) return [];
    
    let filtered = [...eventsList];

    try {
      // Text search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
        );
      }

      // Date range filter
      if (filters.dateRange?.start || filters.dateRange?.end) {
        filtered = filtered.filter(event => {
          try {
            const eventDate = new Date(event.date);
            if (!eventDate.getTime()) return false; // Invalid date

            if (filters.dateRange?.start) {
              const startDate = new Date(filters.dateRange.start);
              startDate.setHours(0, 0, 0, 0);
              if (eventDate < startDate) return false;
            }

            if (filters.dateRange?.end) {
              const endDate = new Date(filters.dateRange.end);
              endDate.setHours(23, 59, 59, 999);
              if (eventDate > endDate) return false;
            }

            return true;
          } catch (error) {
            console.error('Error filtering by date:', error);
            return false; // Exclude events with invalid dates
          }
        });
      }

      // Price range filter
      if (filters.priceRange?.min !== null || filters.priceRange?.max !== null) {
        filtered = filtered.filter(event => {
          try {
            const price = parseFloat(event.price.toString());
            if (isNaN(price)) return false; // Invalid price

            if (filters.priceRange?.min !== null) {
              const minPrice = parseFloat(filters.priceRange.min.toString());
              if (!isNaN(minPrice) && price < minPrice) return false;
            }

            if (filters.priceRange?.max !== null) {
              const maxPrice = parseFloat(filters.priceRange.max.toString());
              if (!isNaN(maxPrice) && price > maxPrice) return false;
            }

            return true;
          } catch (error) {
            console.error('Error filtering by price:', error);
            return false; // Exclude events with invalid prices
          }
        });
      }

      // Apply sorting
      if (filters.sortOrder) {
        filtered.sort((a, b) => {
          try {
            switch (filters.sortOrder) {
              case 'date-asc':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              case 'date-desc':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              case 'price-asc':
                return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
              case 'price-desc':
                return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
              default:
                return 0;
            }
          } catch (error) {
            console.error('Error sorting events:', error);
            return 0;
          }
        });
      }

      return filtered;
    } catch (error) {
      console.error('Error in filterEvents:', error);
      return []; // Return empty array in case of error to prevent showing unfiltered events
    }
  }, []); // No dependencies needed as it's a pure function

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilterState(prev => {
      const updatedFilters = { ...prev, ...newFilters };
      return updatedFilters;
    });
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((sortOrder: string) => {
    handleFilterChange({ sortOrder });
  }, [handleFilterChange]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await eventService.getEvents();
        setEvents(eventsData);
        // Apply initial sorting
        const initialFiltered = filterEvents(filterState, eventsData);
        setFilteredEvents(initialFiltered);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filterEvents, filterState]);

  // Fetch unread messages for admin
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

  // Apply filters whenever events or filterState changes
  useEffect(() => {
    if (!loading) {
      const filtered = filterEvents(filterState, events);
      setFilteredEvents(filtered);
    }
  }, [events, filterState, filterEvents, loading]);

  return (
    <Container>
      <Toaster position="top-right" />
      <EventsNavbar unreadMessages={unreadMessages} />

      <EventsFilter
        filters={filterState}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
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
                    <IconWrapper>
                      <FiMessageSquare size={18} />
                      {unreadMessages > 0 && (
                        <NotificationBadge 
                          count={unreadMessages}
                          size="small"
                          variant="primary"
                        />
                      )}
                    </IconWrapper>
                    Messages
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

      <AnimatePresence mode="wait">
        {loading ? (
          <EventsGrid>
            {[...Array(6)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </EventsGrid>
        ) : filteredEvents.length === 0 ? (
          <NoResults
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FiCalendar size={40} />
            <p>No events found</p>
          </NoResults>
        ) : (
          <EventsGrid>
            {filteredEvents.map(event => (
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
            ))}
          </EventsGrid>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default EventsScreen;