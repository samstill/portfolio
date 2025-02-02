import styled from 'styled-components';
import { motion } from 'framer-motion';

export const NotificationBadge = styled(motion.div)`
  position: absolute;
  top: -6px;
  right: auto;
  left: 18px;
  background: linear-gradient(135deg, #ff6b6b, #ff4444);
  color: white;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  font-weight: 600;
  border: 2px solid ${props => props.theme.background};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  z-index: 2;

  /* Handle double-digit numbers */
  ${props => props.children && Number(props.children) > 9 && `
    min-width: 24px;
    padding: 0 4px;
  `}
`;

export const BadgeWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
