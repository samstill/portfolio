import styled from 'styled-components';

interface ButtonProps {
  $variant?: 'primary' | 'secondary';  // Use transient prop with $
}

export const StyledButton = styled.button<ButtonProps>`
  // Use $variant instead of variant in props
  background: ${props => props.$variant === 'secondary' ? 'transparent' : 'primary'};
  // ...existing code...
`;

// Usage:
<StyledButton $variant="secondary">Click me</StyledButton>
