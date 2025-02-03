import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BadgeProps {
  $size?: 'small' | 'medium' | 'large';
  $variant?: 'primary' | 'danger' | 'success';
}

const BadgeContainer = styled(motion.span)<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '24px';
      default: return '20px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '24px';
      default: return '20px';
    }
  }};
  padding: 0 4px;
  border-radius: 999px;
  background: ${props => {
    switch (props.$variant) {
      case 'danger': return 'linear-gradient(135deg, #ff4b4b, #f70000)';
      case 'success': return 'linear-gradient(135deg, #4ade80, #22c55e)';
      default: return 'linear-gradient(135deg, #6e8efb, #4a6cf7)';
    }
  }};
  color: white;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.7rem';
      case 'large': return '0.9rem';
      default: return '0.8rem';
    }
  }};
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border: 2px solid ${props => props.theme.background};
  z-index: 10;
`;

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'danger' | 'success';
  maxCount?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'medium',
  variant = 'primary',
  maxCount = 99
}) => {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <BadgeContainer
      $size={size}
      $variant={variant}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 25
      }}
    >
      {displayCount}
    </BadgeContainer>
  );
};

export default NotificationBadge;
