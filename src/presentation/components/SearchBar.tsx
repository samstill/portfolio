import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 0 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus-within {
    background: rgba(255, 255, 255, 0.08);
    border-color: #4a6cf7;
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.15);
  }

  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
    max-width: none;
    border-radius: 12px;
    padding: 0 12px;
    box-sizing: border-box;
  }
`;

const SearchIcon = styled(FiSearch)`
  color: ${props => props.theme.text}80;
  min-width: 20px;
  margin-right: 12px;

  @media (max-width: 768px) {
    min-width: 18px;
    margin-right: 10px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 0;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: ${props => props.theme.text}80;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 12px 0;
  }
`;

const ClearButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.text}80;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  min-width: 32px;
  height: 32px;
  margin-left: 8px;

  &:hover {
    color: ${props => props.theme.text};
  }

  @media (max-width: 768px) {
    min-width: 28px;
    height: 28px;
    padding: 4px;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  margin-left: 8px;
  border: 2px solid transparent;
  border-top-color: #4a6cf7;
  border-right-color: #4a6cf7;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    margin-left: 6px;
  }
`;

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => Promise<void>;
  debounceMs?: number;
  className?: string;
  initialValue?: string;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  className,
  initialValue = "",
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useCallback(async (query: string) => {
    if (onSearch) {
      setIsSearching(true);
      try {
        await onSearch(query);
      } finally {
        setIsSearching(false);
      }
    }
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== initialValue) {
        debouncedSearch(searchQuery);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, debounceMs, debouncedSearch, initialValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleClear = async () => {
    setSearchQuery('');
    await debouncedSearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await debouncedSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', boxSizing: 'border-box' }}>
      <SearchContainer className={className}>
        <SearchIcon size={20} />
        <SearchInput
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label={placeholder}
        />
        <AnimatePresence>
          {(isSearching || isLoading) && (
            <LoadingSpinner
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ 
                opacity: 1,
                rotate: 360,
                transition: { 
                  rotate: { 
                    duration: 1,
                    ease: "linear",
                    repeat: Infinity 
                  }
                }
              }}
              exit={{ opacity: 0 }}
            />
          )}
          {searchQuery && !isSearching && !isLoading && (
            <ClearButton
              onClick={handleClear}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Clear search"
              type="button"
            >
              <FiX size={18} />
            </ClearButton>
          )}
        </AnimatePresence>
      </SearchContainer>
    </form>
  );
}; 