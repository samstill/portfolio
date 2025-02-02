import styled from 'styled-components';

const FiltersPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background: ${props => props.theme.background};
    padding: 16px 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$variant === 'primary'
    ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
    : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }
`;

// ...rest of your FiltersPanel component code...
