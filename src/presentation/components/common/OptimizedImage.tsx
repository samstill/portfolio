import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageWrapperProps {
  $aspectRatio?: number;
  $blur?: boolean;
}

const ImageWrapper = styled.div<ImageWrapperProps>`
  position: relative;
  width: 100%;
  padding-bottom: ${props => props.$aspectRatio ? `${100 / props.$aspectRatio}%` : '100%'};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: ${props => props.$blur ? 'blur(10px)' : 'none'};
    transition: filter 0.3s ease;
  }
`;

const Placeholder = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

interface OptimizedImageProps {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  lowResSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  aspectRatio,
  className,
  lowResSrc
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || '');

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <ImageWrapper
      $aspectRatio={aspectRatio}
      $blur={isLoading && !!lowResSrc}
      className={className}
    >
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
        />
      )}
      <AnimatePresence>
        {isLoading && (
          <Placeholder
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </ImageWrapper>
  );
};

export default OptimizedImage; 