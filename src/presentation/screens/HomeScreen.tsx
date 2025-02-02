import React, { useRef, useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { FiLogIn, FiCalendar, FiSend, FiUserPlus, FiCheck, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import Logo from '../components/Logo';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';
import Navbar from '../components/Navbar';
import { messageService } from '../../firebase/services/messageService';
import { AnimatePresence, motion } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  html {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
  }

  /* Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  body {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
  }
`;

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.text};
  position: relative;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div<{ $isNavVisible: boolean }>`
  display: flex;
  gap: 20px;
  opacity: ${props => props.$isNavVisible ? 0 : 1};
  transition: opacity 0.3s ease;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;

const ScrollIndicator = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 16px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    font-weight: 500;
    opacity: 0.9;
    white-space: nowrap;
    text-align: center;
    margin: 0;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ScrollFadeWrapper = styled(motion.div)<{ $scrollY: number }>`
  position: fixed;
  bottom: 8vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
  opacity: ${({ $scrollY }) => $scrollY > 10 ? 0 : 1};
  visibility: ${({ $scrollY }) => ($scrollY > 10 ? 'hidden' : 'visible')};
  pointer-events: ${({ $scrollY }) => ($scrollY > 10 ? 'none' : 'auto')};
  transform: translateY(${({ $scrollY }) => Math.min($scrollY * 0.5, 10)}px);
  transition: transform 0.2s ease;
  z-index: 10;
  
  @media (max-width: 768px) {
    bottom: 5vh;
  }
`;

const ContactSection = styled.div<{ $isVisible: boolean }>`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  perspective: 1000px;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: translateY(${props => props.$isVisible ? '0' : '30px'});
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  will-change: opacity, transform;
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  position: relative;
  z-index: ${props => props.$isVisible ? 1 : -1};
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  transform-style: preserve-3d;
  transform: rotateX(5deg);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px;
    width: 95%;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 16px;
    width: 98%;
  }
`;

const ContactTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  transform: translateZ(30px);
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ContactForm = styled.form<{ $isSubmitting?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 95%;
  margin: 0 auto;
  opacity: ${props => props.$isSubmitting ? 0.7 : 1};
  pointer-events: ${props => props.$isSubmitting ? 'none' : 'auto'};
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  margin: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: ${props => props.theme.text};
  font-size: 16px;
  min-height: 150px;
  max-height: 50vh;
  transition: all 0.3s ease;
  resize: vertical;
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-height: 120px;
    font-size: 14px;
    padding: 14px;
  }

  @media (max-width: 480px) {
    min-height: 100px;
    max-height: 40vh;
    padding: 12px;
  }

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.25);
  }

  &::placeholder {
    color: ${props => props.theme.text}80;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateZ(20px);

  &:hover {
    transform: translateZ(25px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 1rem;
  color: ${props => props.theme.text};
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  svg {
    color: #4a6cf7;
  }
`;

const HomeScreen: React.FC = () => {
  useDocumentTitle('Home');
  const { currentUser } = useAuth();
  const parallaxRef = useRef<any>(null);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const checkInitialScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > window.innerHeight * 0.5) {
        setIsContactVisible(true);
      }
    };
    checkInitialScroll();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0.1, 0.5],
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsContactVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          setIsContactVisible(false);
        }
      });
    }, options);

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    let lastScroll = 0;
    
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setIsNavVisible(currentScroll > 100 && currentScroll > lastScroll);
      lastScroll = currentScroll;
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await messageService.createMessage(message);
      setMessage('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
      // You might want to show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContact = () => {
    parallaxRef.current?.scrollTo(1);
  };

  return (
    <>
      <GlobalStyle />
      <Logo />
      <Navbar isVisible={isNavVisible} />
      <HomeContainer>
        <Parallax
          ref={parallaxRef}
          pages={2}
          style={{ top: '0', left: '0' }}
          config={{ tension: 170, friction: 26 }}
        >
          <ParallaxLayer
            offset={0}
            speed={0.5}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
          </ParallaxLayer>
          
          <ParallaxLayer offset={0} speed={0.1}>
            <HeroSection>
              <Title>Hi! Welcome to Harshit Padha</Title>
              <Description>
                Discover and manage amazing events all in one place. Join our community
                and start exploring today!
              </Description>
              <ButtonContainer $isNavVisible={isNavVisible}>
                {currentUser ? (
                  <StyledButton to="/events">
                    <FiCalendar size={20} />
                    View Events
                  </StyledButton>
                ) : (
                  <>
                    <StyledButton to="/login">
                      <FiLogIn size={20} />
                      Sign In
                    </StyledButton>
                    <StyledButton to="/signup">
                      <FiUserPlus  size={20} />
                      Sign Up
                    </StyledButton>
                  </>
                )}
              </ButtonContainer>
            </HeroSection>
          </ParallaxLayer>

          <ParallaxLayer
            offset={1}
            speed={0.2}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // Fixed: changed from justify-content to justifyContent
            }}
          >
            <ContactSection ref={contactRef} $isVisible={isContactVisible}>
              <ContactCard>
                <ContactTitle>Send an Anonymous Message</ContactTitle>
                <ContactForm 
                  onSubmit={handleSubmit} 
                  $isSubmitting={isSubmitting}
                >
                  <TextArea 
                    placeholder="Type your message here... Surprise me!"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <SubmitButton 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <FiSend size={20} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </SubmitButton>
                </ContactForm>
                <AnimatePresence>
                  {showSuccess && (
                    <SuccessMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <FiCheck size={20} />
                      Message sent successfully!
                    </SuccessMessage>
                  )}
                </AnimatePresence>
              </ContactCard>
            </ContactSection>
          </ParallaxLayer>
        </Parallax>
        <ScrollFadeWrapper $scrollY={scrollY}>
          <ScrollIndicator
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 1
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContact}
          >
            <p>Scroll to send anonymous message</p>
            <motion.div
              animate={{ 
                y: [0, 6, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              <FiChevronDown size={22} />
            </motion.div>
          </ScrollIndicator>
        </ScrollFadeWrapper>
      </HomeContainer>
    </>
  );
};

export default HomeScreen;
