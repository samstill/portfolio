import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  borderradius?: string;
  marginbottom?: string;
}

export const Skeleton = styled.div<SkeletonProps>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => props.borderradius || '4px'};
  margin-bottom: ${props => props.marginbottom || '0'};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.08) 37%,
    rgba(255, 255, 255, 0.03) 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
`; 