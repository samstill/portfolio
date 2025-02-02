import styled from 'styled-components';
import { motion } from 'framer-motion';

interface SkeletonProps {
  $height?: string;
  $width?: string;
  $borderRadius?: string;
  $marginTop?: string;
  $marginBottom?: string;
  style?: React.CSSProperties;
}

const SkeletonBase = styled(motion.div)<SkeletonProps>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.skeleton.start} 25%,
    ${props => props.theme.skeleton.middle} 37%,
    ${props => props.theme.skeleton.end} 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  height: ${props => props.$height || '20px'};
  width: ${props => props.$width || '100%'};
  border-radius: ${props => props.$borderRadius || '4px'};
  margin-top: ${props => props.$marginTop || '0'};
  margin-bottom: ${props => props.$marginBottom || '0'};

  @keyframes skeleton-loading {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`;

export const Skeleton: React.FC<{
  height?: string;
  width?: string;
  borderRadius?: string;
  marginTop?: string;
  marginBottom?: string;
  style?: React.CSSProperties;
}> = ({ height, width, borderRadius, marginTop, marginBottom, style }) => {
  return (
    <SkeletonBase
      $height={height}
      $width={width}
      $borderRadius={borderRadius}
      $marginTop={marginTop}
      $marginBottom={marginBottom}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
    />
  );
}; 