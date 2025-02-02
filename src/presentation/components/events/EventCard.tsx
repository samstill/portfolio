import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiX, FiTag, FiBookmark } from 'react-icons/fi';
import { Event } from '../../../domain/entities/Event';
import { useNavigate } from 'react-router-dom';
import { FirebaseEventRepository } from '../../../data/repositories/FirebaseEventRepository';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onBook: (id: string) => void;
}

const TicketBadge = styled.div<{ $isFull?: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.$isFull 
    ? 'rgba(238, 82, 83, 0.2)' 
    : 'rgba(74, 108, 247, 0.1)'};  // Light blue background
  backdrop-filter: blur(4px);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: ${props => props.$isFull ? '#ee5253' : '#4a6cf7'};  // Blue color for available tickets
  font-weight: 600;
  z-index: 1;
`;

const Card = styled(motion.div)`
  position: relative;  // Add this to handle absolute positioning of badge
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const EventTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const EventInfo = styled.p`
  color: ${props => props.theme.text}CC;
  font-size: 0.9rem;
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EventPrice = styled.div`
  color: #4a6cf7;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 10px;
`;

const EventActions = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ActionButton = styled(motion.button)<{ $variant?: 'danger'; $disabled?: boolean }>`
  padding: 8px 20px;
  border: none;
  border-radius: 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${props => {
    if (props.$disabled) return 'rgba(255, 255, 255, 0.08)'; // Slightly darker background for disabled state
    return props.$variant === 'danger' 
      ? 'linear-gradient(135deg, #ff6b6b, #ee5253)'
      : 'linear-gradient(135deg, #6e8efb, #4a6cf7)';
  }};
  color: ${props => {
    if (props.$disabled) {
      return props.theme.text + '99'; // Semi-transparent version of the text color
    }
    return 'white';
  }};
  opacity: ${props => props.$disabled ? 0.8 : 1}; // Increased opacity for better visibility
  min-width: ${props => props.$variant === 'danger' ? '120px' : '140px'};
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    transform: ${props => props.$disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => {
      if (props.$disabled) return 'none';
      return props.$variant === 'danger'
        ? '0 8px 20px rgba(238, 82, 83, 0.3)'
        : '0 8px 20px rgba(74, 108, 247, 0.3)';
    }};
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: 0;
  }
`;

const TicketCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  margin-top: 8px;
`;

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isAdmin,
  onDelete,
  onBook
}) => {
  const navigate = useNavigate();
  const [availableTickets, setAvailableTickets] = useState<number | null>(null);
  const eventRepository = new FirebaseEventRepository();

  useEffect(() => {
    const eventRef = doc(db, 'events', event.id);
    
    const unsubscribe = onSnapshot(eventRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setAvailableTickets(data.availableTickets || 0);
      }
    });

    return () => unsubscribe();
  }, [event.id]);

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      whileHover={{
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
        transition: { duration: 0.3 }
      }}
    >
      <TicketBadge $isFull={availableTickets === 0}>
        <FiTag size={16} />
        {availableTickets === 0 ? (
          'House Full'
        ) : (
          <span>{availableTickets !== null ? `${availableTickets} left` : 'Loading...'}</span>
        )}
      </TicketBadge>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <EventTitle>{event.title}</EventTitle>
        <EventInfo>
          <FiCalendar size={14} />
          {new Date(event.date).toLocaleString()}
        </EventInfo>
        <EventInfo>
          <FiMapPin size={14} />
          {event.location}
        </EventInfo>
        <EventPrice>₹{event.price}</EventPrice>
        
        <TicketCount>
          <FiBookmark size={16} />
          {availableTickets !== null ? `${availableTickets} tickets left` : 'Loading...'}
        </TicketCount>
        
        <EventActions>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              if (availableTickets === 0) return;
              onBook(event.id);
            }}
            whileHover={{ scale: availableTickets === 0 ? 1 : 1.05 }}
            whileTap={{ scale: availableTickets === 0 ? 1 : 0.95 }}
            $disabled={availableTickets === 0}
          >
            {availableTickets === 0 ? 'Sold Out' : 'Book Ticket'}
          </ActionButton>
          
          {isAdmin && (
            <ActionButton
              $variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiX size={16} />
              Delete
            </ActionButton>
          )}
        </EventActions>
      </motion.div>
    </Card>
  );
};