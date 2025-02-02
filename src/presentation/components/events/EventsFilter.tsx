import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { EventFilters } from '../../../domain/entities/Event';

const FilterContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: ${props => props.theme.text}80;
  }
`;

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #6e8efb, #4a6cf7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilterPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;

  h3 {
    font-size: 1rem;
    color: ${props => props.theme.text};
    margin-bottom: 10px;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    width: 100px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: ${props => props.theme.text};
    outline: none;

    &:focus {
      border-color: #4a6cf7;
    }
  }
`;

const DateRange = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: ${props => props.theme.text};
    outline: none;

    &:focus {
      border-color: #4a6cf7;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SortSelect = styled.select`
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: ${props => props.theme.text};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #4a6cf7;
  }
`;

interface EventsFilterProps {
  onFilterChange: (filters: EventFilters) => void;
  onSortChange: (sort: string) => void;
}

export const EventsFilter: React.FC<EventsFilterProps> = ({
  onFilterChange,
  onSortChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({
    searchTerm: '',
    startDate: undefined,
    endDate: undefined,
    minPrice: undefined,
    maxPrice: undefined
  });

  const handleFilterChange = (newFilters: Partial<EventFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <FilterContainer>
      <SearchBar>
        <FiSearch size={20} color="currentColor" />
        <SearchInput
          placeholder="Search events..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
        />
        <FilterButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? <FiX size={18} /> : <FiFilter size={18} />}
          {isFilterOpen ? 'Close' : 'Filter'}
        </FilterButton>
      </SearchBar>

      <AnimatePresence>
        {isFilterOpen && (
          <FilterPanel
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterGroup>
              <h3>Date Range</h3>
              <DateRange>
                <input
                  type="date"
                  onChange={(e) => handleFilterChange({
                    startDate: e.target.value ? new Date(e.target.value) : undefined
                  })}
                />
                <span>to</span>
                <input
                  type="date"
                  onChange={(e) => handleFilterChange({
                    endDate: e.target.value ? new Date(e.target.value) : undefined
                  })}
                />
              </DateRange>
            </FilterGroup>

            <FilterGroup>
              <h3>Price Range</h3>
              <PriceRange>
                <input
                  type="number"
                  placeholder="Min"
                  onChange={(e) => handleFilterChange({
                    minPrice: e.target.value ? Number(e.target.value) : undefined
                  })}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  onChange={(e) => handleFilterChange({
                    maxPrice: e.target.value ? Number(e.target.value) : undefined
                  })}
                />
              </PriceRange>
            </FilterGroup>

            <FilterGroup>
              <h3>Sort By</h3>
              <SortSelect onChange={(e) => onSortChange(e.target.value)}>
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </SortSelect>
            </FilterGroup>
          </FilterPanel>
        )}
      </AnimatePresence>
    </FilterContainer>
  );
}; 