import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const AvatarContainer = styled(motion.div)<{ $size?: string }>`
  position: relative;
  width: ${({ $size }) => $size || '100px'};
  height: ${({ $size }) => $size || '100px'};
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.loaded {
    opacity: 1;
  }
`;

const DefaultAvatar = styled(motion.div)<{ $bgColor?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bgColor }) => $bgColor || 'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  color: white;
  font-size: 2rem;
  font-weight: 600;

  svg {
    width: 50%;
    height: 50%;
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.15) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    animation: ${shimmer} 1.5s infinite;
  }
`;

interface AvatarProps {
  imageUrl?: string | null;
  name?: string;
  size?: string;
  bgColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  imageUrl, 
  name = '', 
  size = '100px',
  bgColor
}) => {
  const [isLoading, setIsLoading] = useState(!!imageUrl);
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <AvatarContainer $size={size}>
      {imageUrl && !hasError ? (
        <>
          <AvatarImage
            src={imageUrl}
            alt={name || 'User avatar'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={!isLoading ? 'loaded' : ''}
          />
          <AnimatePresence>
            {isLoading && (
              <LoadingOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <DefaultAvatar
          $bgColor={bgColor}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {name ? getInitials(name) : <FiUser />}
        </DefaultAvatar>
      )}
    </AvatarContainer>
  );
};

export default Avatar; 