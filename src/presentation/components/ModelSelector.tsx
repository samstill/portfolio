import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiZap, FiCpu } from 'react-icons/fi';
import { useAI, AI_MODELS } from '../../shared/contexts/AIContext';

const Container = styled(motion.div)`
  position: relative;
  z-index: 100;
`;

const ModelButton = styled(motion.button)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 10px 20px;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ModelIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: linear-gradient(135deg, #FF69B4, #9370DB);
  color: white;
`;

const ModelDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  min-width: 240px;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  padding: 8px;
`;

const ModelOption = styled(motion.button)`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: white; // changed text to white for better contrast
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  ${props => props.active && `
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(147, 112, 219, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
`;

const ProviderBadge = styled.span<{ provider: 'deepseek' | 'google' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.provider === 'google' 
    ? 'linear-gradient(135deg, #4285f4, #34a853)' 
    : 'linear-gradient(135deg, #FF69B4, #9370DB)'};
  color: white;
  margin-left: auto;
`;

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 25 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: { duration: 0.2 } 
  }
};

export const ModelSelector: React.FC<{ className?: string }> = ({ className }) => {
  const { selectedModel, setSelectedModel, isModelDropdownOpen, setIsModelDropdownOpen } = useAI();

  return (
    <Container className={className}>
      <ModelButton
        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ModelIcon
          animate={{ rotate: isModelDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiCpu size={14} />
        </ModelIcon>
        {selectedModel.name}
        <FiChevronDown 
          size={16}
          style={{
            transform: `rotate(${isModelDropdownOpen ? '180deg' : '0deg'})`,
            transition: 'transform 0.3s ease'
          }}
        />
      </ModelButton>

      <AnimatePresence>
        {isModelDropdownOpen && (
          <ModelDropdown
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {AI_MODELS.map(model => (
              <ModelOption
                key={model.id}
                onClick={() => {
                  setSelectedModel(model);
                  setIsModelDropdownOpen(false);
                }}
                whileHover={{ x: 5 }}
                active={model.id === selectedModel.id}
              >
                <ModelIcon>
                  {model.provider === 'google' ? <FiZap size={14} /> : <FiCpu size={14} />}
                </ModelIcon>
                {model.name}
                <ProviderBadge provider={model.provider}>
                  {model.provider}
                </ProviderBadge>
              </ModelOption>
            ))}
          </ModelDropdown>
        )}
      </AnimatePresence>
    </Container>
  );
};
