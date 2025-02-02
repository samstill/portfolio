import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';

interface NavbarProps {
  isVisible: boolean;
}

const NavContainer = styled.nav<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  transform: translateY(${props => props.$isVisible ? '0' : '-100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 20px;
    transform: translateY(${props => props.$isOpen ? '0' : '-100vh'});
    transition: transform 0.3s ease-in-out;
  }
`;

const NavButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 108, 247, 0.4);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar: React.FC<NavbarProps> = ({ isVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#nav-links') && !target.closest('#menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <NavContainer $isVisible={isVisible}>
      <NavContent>
        <MenuButton
          id="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </MenuButton>

        <NavLinks id="nav-links" $isOpen={isMenuOpen}>
          {currentUser && (
            <>
              <NavButton to="/events">Events</NavButton>
              <NavButton to="/tickets">Tickets</NavButton>
            </>
          )}
          {!currentUser && (
            <>
              <NavButton to="/login">
                <FiLogIn size={18} />
                Sign In
              </NavButton>
              <NavButton to="/signup">
                <FiLogIn size={18} />
                Sign Up
              </NavButton>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;