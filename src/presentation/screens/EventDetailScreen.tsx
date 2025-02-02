import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiArrowLeft, FiShare2, FiTrash2, FiPlus, FiEdit } from 'react-icons/fi';
import { FirebaseEventRepository } from '../../data/repositories/FirebaseEventRepository';
import { Event } from '../../domain/entities/Event';
import { useAuth } from '../../shared/context/AuthContext';
import { toast } from 'react-hot-toast';
import { EventDetailSkeleton } from '../components/common/EventDetailSkeleton';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import { eventService } from '../../firebase/services/eventService';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};

  @media (max-width: 768px) {
    padding: 60px 15px;
  }
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const EventDetailCard = styled(motion.div)`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 15px;
  }
`;

const EditButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    top: 15px;
    right: 15px;
  }
`;

const EventHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const EventInfoContainer = styled.div`
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }
`;

const EventInfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EventTitle = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
`;

const EventInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.text}CC;
  margin: 10px 0;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const EventDescription = styled.div`
  color: ${props => props.theme.text};
  line-height: 1.6;
  font-size: 1.1rem;
  max-width: 100%;
  
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin: 1.5em 0 0.8em;
    line-height: 1.3;
    font-weight: 600;
  }

  h1 { font-size: 1.8em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.3em; }
  h4 { font-size: 1.1em; }
  h5, h6 { font-size: 1em; }

  p {
    margin: 1em 0;
    line-height: 1.8;
    color: ${props => props.theme.text}CC;
  }

  ul, ol {
    margin: 1em 0;
    padding-left: 1.5em;
  }

  li {
    margin: 0.5em 0;
    color: ${props => props.theme.text}CC;
  }

  pre {
    margin: 1.5em 0;
    padding: 0;
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
  }

  code:not(pre code) {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5em 0;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.01);
    }
  }

  blockquote {
    margin: 1.5em 0;
    padding: 0.8em 1.2em;
    border-left: 3px solid #4a6cf7;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    font-style: italic;
    color: ${props => props.theme.text}CC;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
  }

  th, td {
    padding: 0.75em;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
  }

  th {
    background: rgba(255, 255, 255, 0.05);
    font-weight: 600;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 2em 0;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    
    h1 { font-size: 1.6em; }
    h2 { font-size: 1.4em; }
    h3 { font-size: 1.2em; }
    h4, h5, h6 { font-size: 1em; }

    pre {
      border-radius: 6px;
    }

    blockquote {
      padding: 0.6em 1em;
    }
  }
`;

const PriceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 6px 12px;
  }
`;

const QuickActionButtons = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }
`;

const QuickButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary'; $disabled?: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    background: ${props => {
      if (props.$disabled) return 'rgba(255, 255, 255, 0.08)';
      return props.$variant === 'primary'
        ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
        : 'linear-gradient(135deg, #2c3e50, #34495e)';
    }};
    color: ${props => props.$disabled ? props.theme.text + '99' : 'white'};
    border: none;
    border-radius: 8px;
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.$disabled ? 0.8 : 1};
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;

    @media (max-width: 380px) {
      padding: 8px;
      
      span {
        display: none;
      }
    }
  }
`;

const MainActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 20px;
    
    /* Hide Book Now and Share buttons on mobile as they're moved to quick actions */
    button[data-action="book"],
    button[data-action="share"] {
      display: none;
    }
  }
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'danger'; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => {
    if (props.$disabled) return 'rgba(255, 255, 255, 0.08)'; // Slightly darker background
    switch (props.$variant) {
      case 'primary':
        return 'linear-gradient(135deg, #6e8efb, #4a6cf7)';
      case 'danger':
        return 'linear-gradient(135deg, #ff6b6b, #ee5253)';
      default:
        return 'linear-gradient(135deg, #2c3e50, #34495e)';
    }
  }};
  color: ${props => {
    if (props.$disabled) {
      return props.theme.text + '99'; // Semi-transparent version of the text color
    }
    return 'white';
  }};
  border: none;
  border-radius: 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.8 : 1}; // Increased opacity for better visibility
  font-size: 1rem;
  font-weight: 500;
  min-width: 140px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
    padding: 10px 16px;
    font-size: 0.9rem;
    
    /* Hide button text on very small screens, show only icon */
    @media (max-width: 380px) {
      min-width: auto;
      padding: 10px;
      
      span {
        display: none;
      }
    }
  }

  &:hover {
    transform: ${props => props.$disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => {
      if (props.$disabled) return 'none';
      switch (props.$variant) {
        case 'primary':
          return '0 5px 15px rgba(74, 108, 247, 0.4)';
        case 'danger':
          return '0 5px 15px rgba(238, 82, 83, 0.4)';
        default:
          return '0 5px 15px rgba(52, 73, 94, 0.4)';
      }
    }};
  }
`;

const TicketInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: ${props => props.theme.text};

  .count {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${props => props.theme.text};
  }

  .label {
    color: ${props => props.theme.text}CC;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const QuantityButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1.2rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  min-width: 40px;
  text-align: center;
`;

const EventDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTickets, setAvailableTickets] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const eventRepository = new FirebaseEventRepository();

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const eventRef = doc(db, 'events', id);
    
    const unsubscribe = onSnapshot(eventRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setEvent({
            id: doc.id,
            ...data,
            availableTickets: data.availableTickets || 0,
            soldTickets: data.soldTickets || 0
          } as Event);
          setAvailableTickets(data.availableTickets || 0);
        } else {
          toast.error('Event not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = async () => {
    if (!event || !window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.deleteEvent(event.id);
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;

    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}\/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const handleEdit = () => {
    if (!event) return;
    navigate(`/events/${event.id}/edit`);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < (availableTickets || 0)) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleBooking = () => {
    if (availableTickets === 0) return;
    navigate(`/events/${event.id}/book`, { 
      state: { quantity } 
    });
  };

  if (loading) {
    return (
      <Container>
        <EventDetailSkeleton />
      </Container>
    );
  }

  if (!event) {
    return <Container>Event not found</Container>;
  }

  return (
    <Container>
      <BackButton
        onClick={() => navigate('/events')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft size={18} />
        Back to Events
      </BackButton>

      <EventDetailCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isAdmin && (
          <EditButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
          >
            <FiEdit size={18} />
          </EditButton>
        )}

        <EventHeader>
          <EventTitle>{event.title}</EventTitle>
          
          <EventInfoContainer>
            <EventInfoGroup>
              <EventInfo>
                <FiCalendar size={18} />
                {new Date(event.date).toLocaleDateString()}
              </EventInfo>

              <EventInfo>
                <FiClock size={18} />
                {new Date(event.date).toLocaleTimeString()}
              </EventInfo>

              <EventInfo>
                <FiMapPin size={18} />
                {event.location}
              </EventInfo>
            </EventInfoGroup>

            <QuickActionButtons>
              <QuickButton
                $variant="primary"
                $disabled={availableTickets === 0}
                whileHover={{ scale: availableTickets === 0 ? 1 : 1.05 }}
                whileTap={{ scale: availableTickets === 0 ? 1 : 0.95 }}
                onClick={handleBooking}
              >
                <FiCalendar size={16} />
                <span>{availableTickets === 0 ? 'Sold Out' : 'Book Now'}</span>
              </QuickButton>

              <QuickButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
              >
                <FiShare2 size={16} />
                <span>Share</span>
              </QuickButton>
            </QuickActionButtons>
          </EventInfoContainer>
        </EventHeader>

        <PriceTag>
          ₹ {event.price}
        </PriceTag>

        <TicketInfo>
          <FiCalendar size={18} />
          <span className="count">
            {availableTickets !== null ? availableTickets : (event.availableTickets || 0)}
          </span>
          <span className="label">tickets available</span>
        </TicketInfo>

        <QuantitySelector>
          <QuantityButton
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            -
          </QuantityButton>
          <QuantityDisplay>{quantity}</QuantityDisplay>
          <QuantityButton
            onClick={handleIncreaseQuantity}
            disabled={quantity >= (availableTickets || 0)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            +
          </QuantityButton>
        </QuantitySelector>

        <EventDescription>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: '1.5em 0',
                      borderRadius: '8px',
                      padding: '1em'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              table: ({children}) => (
                <div style={{ overflowX: 'auto' }}>
                  <table>{children}</table>
                </div>
              ),
              img: ({src, alt}) => (
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    margin: '1.5em 0'
                  }}
                />
              ),
              h1: ({node, ...props}) => <h1 style={{marginBottom: '0.5em'}} {...props} />,
              h2: ({node, ...props}) => <h2 style={{marginBottom: '0.5em'}} {...props} />,
              h3: ({node, ...props}) => <h3 style={{marginBottom: '0.5em'}} {...props} />,
            }}
          >
            {event.description}
          </ReactMarkdown>
        </EventDescription>

        <MainActionButtons>
          <Button
            data-action="book"
            $variant="primary"
            $disabled={availableTickets === 0}
            whileHover={{ scale: availableTickets === 0 ? 1 : 1.05 }}
            whileTap={{ scale: availableTickets === 0 ? 1 : 0.95 }}
            onClick={handleBooking}
          >
            <FiCalendar size={18} />
            <span>
              {availableTickets === 0 ? 'Sold Out' : `Book Now (${availableTickets} available)`}
            </span>
          </Button>

          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCalendar}
          >
            <FiCalendar size={18} />
            <FiPlus size={14} style={{ marginLeft: -6, marginRight: -4 }} />
            <span>Add to Calendar</span>
          </Button>

          <Button
            data-action="share"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
          >
            <FiShare2 size={18} />
            <span>Share</span>
          </Button>

          {isAdmin && (
            <Button
              $variant="danger"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
            >
              <FiTrash2 size={18} />
              <span>Delete Event</span>
            </Button>
          )}
        </MainActionButtons>
      </EventDetailCard>
    </Container>
  );
};

export default EventDetailScreen;
