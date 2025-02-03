import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { EventFilters } from '../../../domain/entities/Event';
import { getFirestore, collection, query, where, getDocs, or } from 'firebase/firestore';

const FilterContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus-within {
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  padding-left: 50px;
  padding-right: 100px;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.text}80;
  }

  @media (max-width: 768px) {
    padding: 12px 18px;
    padding-left: 45px;
    padding-right: 90px;
    font-size: 0.95rem;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text}80;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;

  svg {
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    left: 15px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const FilterButton = styled(motion.button)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
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
  white-space: nowrap;
  min-width: fit-content;
  z-index: 2;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #4a6cf7, #6e8efb);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
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
  onFilterChange: (filters: EventFilters, filteredEvents: any[]) => void;
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

  const handleFilterChange = useCallback(async (newFilters: Partial<EventFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    try {
      const db = getFirestore();
      const eventsRef = collection(db, 'events');
      let queryConstraints: any[] = [];

      // Add search term filter if there's a search term
      if (updatedFilters.searchTerm?.trim()) {
        const searchTerm = updatedFilters.searchTerm.toLowerCase().trim();
        const titleQuery = query(eventsRef,
          where('title', '>=', searchTerm),
          where('title', '<=', searchTerm + '\uf8ff')
        );
        const titleSnapshot = await getDocs(titleQuery);
        const events = titleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        onFilterChange(updatedFilters, events);
        return;
      }

      // Add date filters
      if (updatedFilters.startDate) {
        queryConstraints.push(where('date', '>=', updatedFilters.startDate));
      }
      if (updatedFilters.endDate) {
        queryConstraints.push(where('date', '<=', updatedFilters.endDate));
      }

      // Add price filters
      if (updatedFilters.minPrice !== undefined && updatedFilters.minPrice !== null) {
        queryConstraints.push(where('price', '>=', Number(updatedFilters.minPrice)));
      }
      if (updatedFilters.maxPrice !== undefined && updatedFilters.maxPrice !== null) {
        queryConstraints.push(where('price', '<=', Number(updatedFilters.maxPrice)));
      }

      let events: any[] = [];

      // If no filters, get all events
      if (queryConstraints.length === 0) {
        const snapshot = await getDocs(eventsRef);
        events = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } else {
        // Apply filters
        const q = query(eventsRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);
        events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      // Pass both filters and filtered events to parent
      onFilterChange(updatedFilters, events);
    } catch (error) {
      console.error('Error filtering events:', error);
      // Pass empty results on error
      onFilterChange(updatedFilters, []);
    }
  }, [filters, onFilterChange]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterChange({ searchTerm: value });
  }, [handleFilterChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value;
      handleFilterChange({ searchTerm: value });
    }
  }, [handleFilterChange]);

  const handleDateChange = useCallback((type: 'startDate' | 'endDate', value: string) => {
    handleFilterChange({
      [type]: value ? new Date(value) : undefined
    });
  }, [handleFilterChange]);

  const handlePriceChange = useCallback((type: 'minPrice' | 'maxPrice', value: string) => {
    handleFilterChange({
      [type]: value ? Number(value) : undefined
    });
  }, [handleFilterChange]);

  return (
    <FilterContainer>
      <SearchContainer>
        <SearchInputWrapper>
          <SearchIconWrapper>
            <FiSearch size={20} />
          </SearchIconWrapper>
          <SearchInput
            placeholder="Search events..."
            value={filters.searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
            aria-label="Search events"
          />
          <FilterButton
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            type="button"
          >
            {isFilterOpen ? <FiX size={18} /> : <FiFilter size={18} />}
            {isFilterOpen ? 'Close' : 'Filter'}
          </FilterButton>
        </SearchInputWrapper>
      </SearchContainer>

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
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
                />
                <span>to</span>
                <input
                  type="date"
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
                />
              </DateRange>
            </FilterGroup>

            <FilterGroup>
              <h3>Price Range</h3>
              <PriceRange>
                <input
                  type="number"
                  placeholder="Min"
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  value={filters.minPrice || ''}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  value={filters.maxPrice || ''}
                />
              </PriceRange>
            </FilterGroup>

            <FilterGroup>
              <h3>Sort By</h3>
              <SortSelect onChange={(e) => onSortChange?.(e.target.value)}>
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