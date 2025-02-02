import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
`;

export const EventsNavbar = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.3rem 1.5rem;
  background: rgba(17, 25, 40, 0.98);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
`;

export const NavContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

export const NavTitle = styled.h1`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
`;

export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }
  }
`;

export const IconButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
  }

  svg {
    color: #4a6cf7;
  }

  .badge {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ff4757;
    color: white;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-left: auto;
    box-shadow: 0 2px 5px rgba(255, 71, 87, 0.3);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  ${props => props.$variant === 'navbar' && `
    padding: 6px 12px;
    background: linear-gradient(135deg, #6e8efb, #4a6cf7);
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
    width: auto;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
      background: linear-gradient(135deg, #5d7cfa, #3955d3);
    }

    svg {
      color: white;
    }

    .badge {
      position: absolute;
      top: -8px;
      right: -8px;
      min-width: 18px;
      height: 18px;
      font-size: 0.7rem;
      margin: 0;
      border: 2px solid ${props => props.theme.background};
    }
  `}
`;

export const MobileMenuContent = styled(motion.div)`
  position: absolute;
  top: 70px;
  right: 20px;
  background: rgba(17, 25, 40, 0.98);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 16px 48px rgba(0, 0, 0, 0.3);
  z-index: 1000;

  @media (max-width: 768px) {
    right: 16px;
    min-width: 180px;
  }
`;

export const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px) saturate(180%);
  z-index: 999;
`;

export const EventsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
  z-index: 1;
`;

export const UserDropdown = styled.div`
  position: relative;
`;

export const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.$imageUrl 
    ? `url(${props.$imageUrl}) no-repeat center/cover`
    : 'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;

export const AvatarButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const DropdownItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  color: ${props => props.theme.text};
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: rgba(17, 25, 40, 0.98);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 16px 48px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 99;

  > ${DropdownItem} {
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const DropdownItemWithBadge = styled(DropdownItem)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;

  > span {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const MobileMenu = styled(motion.div)`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const DropdownBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff4757;
  color: white;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: auto;
  box-shadow: 0 2px 5px rgba(255, 71, 87, 0.3);
`;