import styled from 'styled-components';

export const AuthWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: ${props => props.theme.background};
  width: 100vw;
  max-width: 100%;
  overflow-x: hidden;
`;

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }

  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
  }
  max-width: 100vw;
  overflow-x: hidden;
`;

export const AuthCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: clamp(20px, 5vw, 40px);
  width: 100%;
  max-width: min(400px, 100%);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    background: transparent;
    box-shadow: none;
    padding: 1rem;
    width: 100%;
    max-width: 100%;
  }
`;

export const Title = styled.h2`
  color: ${props => props.theme.text};
  margin-bottom: clamp(20px, 4vw, 30px);
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 1.5rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 3vw, 20px);

  @media (max-width: 768px) {
    width: 100%;
    gap: 1.5rem;
  }
  max-width: 100%;
`;

export const InputGroup = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    height: 50px; // Larger touch target
  }
  max-width: 100%;
  box-sizing: border-box;
`;

export const Label = styled.label`
  color: ${props => props.theme.text};
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 500;
  margin-left: 4px;
`;

export const Input = styled.input`
  width: 100%;
  padding: clamp(10px, 2vw, 12px) 12px clamp(10px, 2vw, 12px) 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.25);
  color: ${props => props.theme.text};
  font-size: clamp(14px, 3vw, 16px);
  transition: all 0.3s ease;
  box-sizing: border-box;
  -webkit-appearance: none;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
    background: rgba(255, 255, 255, 0.35);
  }

  &::placeholder {
    color: ${props => props.theme.text}80;
  }

  @media (max-width: 768px) {
    font-size: 16px; // Prevent zoom on iOS
    padding: 12px 40px;
  }
  max-width: 100%;
  box-sizing: border-box;
`;

export const Icon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text}CC;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: clamp(12px, 2.5vw, 14px);
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: clamp(14px, 3vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 50px;
    font-size: 16px;
    margin-top: 1rem;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
  margin-top: 10px;
  font-size: clamp(12px, 3vw, 14px);
`;

export const AuthLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${props => props.theme.text};
  font-size: clamp(14px, 3vw, 16px);
  
  a {
    color: #4a6cf7;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;