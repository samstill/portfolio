import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';
import { ticketService } from '../../firebase/services/ticketService';
import BackButton from '../components/BackButton';
import QRScanner from '../components/QRScanner';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px;
  background: ${props => props.theme.background};
`;

const Card = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  color: ${props => props.theme.text};
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
