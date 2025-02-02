import styled from 'styled-components';
import { FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState } from 'react';

const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text}99;
  pointer-events: none;
`;

const FilterButton = styled(motion.button)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.$isActive 
    ? 'linear-gradient(135deg, #6e8efb, #4a6cf7)'
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isActive 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  color: ${props => props.$isActive ? 'white' : props.theme.text};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: auto;
    padding: 12px;
    aspect-ratio: 1;

    span {
      display: none;
    }
  }
`;

const FiltersDrawer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.background};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  @media (min-width: 769px) {
    position: absolute;
    top: calc(100% + 8px);
    bottom: auto;
    left: auto;
    right: 0;
    width: 300px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
`;

const SearchBox: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const toggleFilters = () => {
    setIsFiltersOpen(prev => !prev);
  };
  
  return (
    <SearchContainer>
      <SearchInputWrapper>
        <SearchInput 
          type="text"
          placeholder="Search..."
        />
        <SearchIcon>
          {/* Add your search icon here */}
        </SearchIcon>
      </SearchInputWrapper>
      
      <FilterButton 
        $isActive={isFiltersOpen}
        onClick={toggleFilters}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiFilter size={18} />
        <span>Filters</span>
      </FilterButton>
      
      {isFiltersOpen && (
        <FiltersDrawer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          {/* Add your filter content here */}
        </FiltersDrawer>
      )}
    </SearchContainer>
  );
};

export default SearchBox;
