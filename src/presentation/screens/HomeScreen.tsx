import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';
import { device } from '../../shared/styles/breakpoints';

const HomeContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  padding: 0 5%;
  max-width: 1200px;
  margin: 0 auto;

  ${device.tablet} {
    padding: 0 10%;
  }
`;

const Greeting = styled(motion.h1)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;

  ${device.tablet} {
    font-size: 2rem;
  }
`;

const Name = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;

  ${device.tablet} {
    font-size: 3.5rem;
  }
`;

const Bio = styled(motion.p)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: 1rem 0 2rem 0;
  max-width: 600px;
  line-height: 1.5;
  text-shadow: ${({ theme }) => theme.textShadow || 'none'};
  font-weight: ${({ theme }) => theme.text.secondary === '#1f1f1f' ? '500' : '400'};

  ${device.tablet} {
    font-size: 1.5rem;
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  ${device.tablet} {
    gap: 1.5rem;
  }
`;

const SocialLink = styled(motion.a)`
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  font-size: 2rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
    transform: translateY(-2px);
  }
`;

const HomeScreen: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const containerVariants = {
    visible: {
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const textReveal = {
    hidden: { y: 100 },
    visible: { 
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.6, 0.01, -0.05, 0.95]
      }
    }
  };

  return (
    <HomeContainer
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <Greeting
        variants={itemVariants}
        initial="hidden"
        whileHover={{ scale: 1.02 }}
      >
        Hi there 👋, I'm
      </Greeting>
      
      <Name
        variants={textReveal}
        initial="hidden"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        Harshit Padha
      </Name>

      <Bio
        variants={itemVariants}
        initial="hidden"
        whileHover={{ x: 10 }}
      >
        A software engineer passionate about building elegant solutions 
        to complex problems. I specialize in full-stack development 
        and creating user-centric experiences.
      </Bio>

      <SocialLinks variants={itemVariants}>
        {[
          { icon: FaGithub, link: 'https://github.com/samstill' },
          { icon: FaLinkedin, link: 'https://linkedin.com/in/harshitpadha' },
          { icon: FaEnvelope, link: 'mailto:harshitpadha@gmail.com' },
          { icon: FaInstagram, link: 'https://instagram.com/samstill_1' }
        ].map(({ icon: Icon, link }, index) => (
          <SocialLink
            key={link}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            custom={index}
          >
            <Icon />
          </SocialLink>
        ))}
      </SocialLinks>
    </HomeContainer>
  );
};

export default HomeScreen;
