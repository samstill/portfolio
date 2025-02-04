import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { UserData } from '../../../shared/types/user';
import { userService } from '../../../firebase/services/userService';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../../components/SearchBar';
import { Skeleton } from '../../components/Skeleton';
import { pageTransition, cardTransition, staggerContainer } from '../../../shared/animations';

// Reuse the styled components from AdminScreen
const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
  padding: 10px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 0 15px;
    box-sizing: border-box;

    > * {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    padding: 0 10px;
    gap: 20px;
  }
`;

const UserCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  padding: 25px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.18);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 768px) {
    padding: 20px;
    gap: 15px;
  }
`;

const UserInfo = styled.div`
  overflow: hidden;
  flex: 1;
  
  h3 {
    color: ${props => props.theme.text};
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    font-size: 0.9rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const UserAvatar = styled.div<{ $imageUrl?: string }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => props.$imageUrl ? 
    `url(${props.$imageUrl}) no-repeat center/cover` : 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
`;

const SearchWrapper = styled.div`
  width: 100%;
  padding: 0 15px;
  margin-bottom: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 15px;
    margin-bottom: 15px;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;

    form {
      max-width: 100%;
      width: 100%;
      box-sizing: border-box;
    }
  }
`;

const NoResults = styled(motion.div)`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  width: 100%;
  max-width: calc(100vw - 40px);
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  svg {
    margin-bottom: 15px;
    opacity: 0.7;
    font-size: 48px;
  }

  p {
    margin: 0;
    max-width: 80%;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 30px 15px;
    font-size: 1rem;
    margin: 15px auto;
    min-height: 180px;
    max-width: calc(100vw - 30px);

    svg {
      font-size: 40px;
      margin-bottom: 12px;
    }

    p {
      max-width: 90%;
    }
  }
`;

const LoadMoreContainer = styled(motion.div)`
  min-height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const LoadingAnimation = () => (
  <LoadMoreContainer
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageTransition}
  >
    <div>Loading...</div>
  </LoadMoreContainer>
);

const getInitials = (email: string) => {
  return email
    .split('@')[0]
    .split('.')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ITEMS_PER_PAGE = 12;

const UserAdminScreen: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
    triggerOnce: false,
    delay: 100
  });

  const fetchUsers = useCallback(async (searchText = '', isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setIsSearching(true);
        setLoading(true);
        setPage(1);
        setUsers([]);
      } else {
        setLoadingMore(true);
      }

      const allUsers = await userService.getAllUsers(searchText);
      setFilteredData(allUsers);

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedUsers = allUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      const hasMoreItems = allUsers.length > (page * ITEMS_PER_PAGE);
      setHasMore(hasMoreItems);

      if (isNewSearch) {
        setUsers(paginatedUsers);
      } else {
        setUsers(prev => {
          const newUsers = [...prev];
          paginatedUsers.forEach(user => {
            if (!newUsers.some(u => u.uid === user.uid)) {
              newUsers.push(user);
            }
          });
          return newUsers;
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsSearching(false);
      setLoading(false);
      setLoadingMore(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  const debouncedUserSearch = useMemo(
    () => debounce((searchText: string) => fetchUsers(searchText, true), 500),
    [fetchUsers]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const shouldLoadMore = 
      !isInitialLoad && 
      inView && 
      !isSearching && 
      !loadingMore && 
      hasMore &&
      filteredData.length > users.length;

    if (shouldLoadMore) {
      const timer = setTimeout(() => {
        setPage(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [
    inView, 
    isSearching, 
    loadingMore, 
    hasMore, 
    isInitialLoad,
    filteredData.length,
    users.length
  ]);

  return (
    <motion.div {...pageTransition}>
      <SearchWrapper>
        <SearchBar
          placeholder="Search users by email..."
          onSearch={debouncedUserSearch}
          isLoading={isSearching}
        />
      </SearchWrapper>
      
      <AnimatePresence mode="wait">
        {loading ? (
          <UsersGrid
            as={motion.div}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div key={index} variants={cardTransition}>
                <UserCard>
                  <Skeleton height={80} />
                </UserCard>
              </motion.div>
            ))}
          </UsersGrid>
        ) : users.length === 0 ? (
          <NoResults {...pageTransition}>
            <FiUsers size={40} />
            <p>No users found</p>
          </NoResults>
        ) : (
          <>
            <UsersGrid
              as={motion.div}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {users.map((user, index) => {
                const uniqueKey = `${user.uid}_${index}`;
                return (
                  <motion.div
                    key={uniqueKey}
                    variants={cardTransition}
                    custom={index}
                  >
                    <UserCard
                      onClick={() => navigate(`/admin/users/${user.uid}`)}
                    >
                      <UserInfo>
                        <h3>{user.email}</h3>
                        <p>
                          <FiUsers size={14} />
                          ID: {user.uid.substring(0, 8)}...
                        </p>
                      </UserInfo>
                      <UserAvatar $imageUrl={user.profilePhoto}>
                        {!user.profilePhoto && getInitials(user.email)}
                      </UserAvatar>
                    </UserCard>
                  </motion.div>
                );
              })}
            </UsersGrid>
            {(hasMore || loadingMore) && (
              <LoadMoreContainer ref={loadMoreRef}>
                {loadingMore && <LoadingAnimation />}
              </LoadMoreContainer>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserAdminScreen; 