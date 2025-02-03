import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Event } from '../../domain/entities/Event';
import { FirebaseEventRepository } from '../../data/repositories/FirebaseEventRepository';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

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

const EditForm = styled.form`
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const Button = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  margin-top: 20px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditEventScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const eventRepository = new FirebaseEventRepository();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    availableTickets: ''
  });

  useEffect(() => {
    if (!id) return;

    const eventRef = doc(db, 'events', id);
    const unsubscribe = onSnapshot(eventRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Event;
        setEvent({ ...data, id: doc.id });
        
        // Convert date to local date and time format
        const eventDate = new Date(data.date);
        const localDate = eventDate.toISOString().split('T')[0];
        const localTime = eventDate.toTimeString().split(' ')[0].slice(0, 5);

        setFormData({
          title: data.title || '',
          description: data.description || '',
          date: localDate,
          time: localTime,
          location: data.location || '',
          price: data.price?.toString() || '',
          availableTickets: data.availableTickets?.toString() || ''
        });
        setLoading(false);
      } else {
        toast.error('Event not found');
        navigate('/events');
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !event) return;

    try {
      setSaving(true);
      
      // Combine date and time into a single Date object
      const dateTime = new Date(formData.date + 'T' + formData.time);

      const updatedEvent = {
        ...event,
        title: formData.title,
        description: formData.description,
        date: dateTime.toISOString(),
        location: formData.location,
        price: parseFloat(formData.price),
        availableTickets: parseInt(formData.availableTickets, 10)
      };

      await eventRepository.updateEvent(id, updatedEvent);
      toast.success('Event updated successfully');
      navigate(`/events/${id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton
        onClick={() => navigate(`/events/${id}`)}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft size={18} />
        Back to Event
      </BackButton>

      <EditForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description (Markdown supported)</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="time">Time</Label>
          <Input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="availableTickets">Available Tickets</Label>
          <Input
            type="number"
            id="availableTickets"
            name="availableTickets"
            value={formData.availableTickets}
            onChange={handleInputChange}
            min="0"
            required
          />
        </FormGroup>

        <Button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </EditForm>
    </Container>
  );
};

export default EditEventScreen; 