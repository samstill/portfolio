import { useState, useCallback, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import { toast } from 'react-hot-toast';
import { collection, getDocs, query, where, getFirestore } from 'firebase/firestore';
import { UserData } from '../../../../shared/types/user';
import { Ticket } from '../../../../domain/entities/Ticket';
import { userService } from '../../../../firebase/services/userService';
import { ticketService } from '../../../../firebase/services/ticketService';
import { logger } from '../../../../utils/logger';

type TabType = 'users' | 'tickets';

export const useAdminScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<{
    users: UserData[];
    tickets: Ticket[];
  }>({
    users: [],
    tickets: []
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

      const db = getFirestore();
      const usersRef = collection(db, 'users');
      
      let queryRef = usersRef;
      if (searchText) {
        queryRef = query(usersRef, 
          where('email', '>=', searchText),
          where('email', '<=', searchText + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(queryRef);
      const uniqueUsers = new Map();
      querySnapshot.docs.forEach(doc => {
        if (!uniqueUsers.has(doc.id)) {
          uniqueUsers.set(doc.id, { 
            uid: doc.id, 
            ...doc.data() 
          } as UserData);
        }
      });
      
      const allUsers = Array.from(uniqueUsers.values());
      setFilteredData(prev => ({ ...prev, users: allUsers }));

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
      logger.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsSearching(false);
      setLoading(false);
      setLoadingMore(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  const fetchTickets = useCallback(async (searchText = '', isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setIsSearching(true);
        setLoading(true);
        setPage(1);
        setTickets([]);
      } else {
        setLoadingMore(true);
      }

      const allTickets = await ticketService.getAllTickets();
      
      let filteredTickets = allTickets;
      if (searchText) {
        const query = searchText.toLowerCase().trim();
        filteredTickets = allTickets.filter(ticket => {
          if (!ticket) return false;
          
          const ticketNumber = ticket?.ticketNumber?.toLowerCase() || '';
          const eventTitle = ticket?.eventDetails?.title?.toLowerCase() || '';
          const userEmail = ticket?.userEmail?.toLowerCase() || '';
          const status = ticket?.status?.toLowerCase() || '';

          return (
            ticketNumber.includes(query) ||
            eventTitle.includes(query) ||
            userEmail.includes(query) ||
            status.includes(query)
          );
        });
      }

      setFilteredData(prev => ({ ...prev, tickets: filteredTickets }));

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const paginatedTickets = filteredTickets
        .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
        .slice(startIndex, startIndex + ITEMS_PER_PAGE);

      const hasMoreItems = filteredTickets.length > (page * ITEMS_PER_PAGE);
      setHasMore(hasMoreItems);

      if (isNewSearch) {
        setTickets(paginatedTickets);
      } else {
        setTickets(prev => {
          const newTickets = [...prev];
          paginatedTickets.forEach(ticket => {
            if (!newTickets.some(t => t.id === ticket.id)) {
              newTickets.push(ticket);
            }
          });
          return newTickets;
        });
      }
    } catch (error) {
      logger.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setIsSearching(false);
      setLoading(false);
      setLoadingMore(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  const debouncedUserSearch = useMemo(
    () => debounce(async (searchText: string) => {
      try {
        setLoading(true);
        await fetchUsers(searchText, true);
        setLoading(false);
      } catch (error) {
        logger.error('Error searching users:', error);
        setLoading(false);
      }
    }, 300),
    [fetchUsers]
  );

  const debouncedTicketSearch = useMemo(
    () => debounce(async (searchText: string) => {
      try {
        setLoading(true);
        await fetchTickets(searchText, true);
        setLoading(false);
      } catch (error) {
        logger.error('Error searching tickets:', error);
        setLoading(false);
      }
    }, 300),
    [fetchTickets]
  );

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchTickets();
    }
  }, [activeTab, fetchUsers, fetchTickets]);

  useEffect(() => {
    const shouldLoadMore = 
      !isInitialLoad && 
      inView && 
      !isSearching && 
      !loadingMore && 
      hasMore &&
      (activeTab === 'users' ? filteredData.users.length > users.length : filteredData.tickets.length > tickets.length);

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
    activeTab, 
    filteredData.users.length, 
    filteredData.tickets.length, 
    users.length, 
    tickets.length
  ]);

  const handleTabChange = useCallback((newTab: TabType) => {
    setActiveTab(newTab);
    setPage(1);
    setUsers([]);
    setTickets([]);
    setSearchQuery('');
    setHasMore(true);
    setIsInitialLoad(true);
    
    if (newTab === 'users') {
      fetchUsers('', true);
    } else {
      fetchTickets('', true);
    }
  }, [fetchUsers, fetchTickets]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (activeTab === 'users') {
      void debouncedUserSearch(query);
    } else {
      void debouncedTicketSearch(query);
    }
  }, [activeTab, debouncedUserSearch, debouncedTicketSearch]);

  const handleScan = async (data: string | null) => {
    if (!data) return;

    try {
      const qrData = JSON.parse(data);
      
      if (!qrData.ticketId) {
        toast.error('Invalid QR code format');
        return;
      }

      const ticket = await ticketService.getTicketById(qrData.ticketId);
      
      if (!ticket) {
        toast.error('Ticket not found');
        return;
      }

      if (ticket.status === 'used') {
        toast.error('Ticket has already been used', {
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }

      if (ticket.status === 'cancelled') {
        toast.error('Ticket has been cancelled', {
          duration: 3000,
          icon: '❌'
        });
        return;
      }

      setSelectedTicket(ticket);
      setIsScannerOpen(false);

      toast.success('Ticket found! Please validate below.', {
        duration: 3000,
        icon: '✅'
      });

    } catch (error) {
      logger.error('Error scanning ticket:', error);
      toast.error('Invalid QR code', {
        duration: 3000,
        icon: '❌'
      });
    }
  };

  const handleValidationComplete = () => {
    setSelectedTicket(null);
  };

  return {
    activeTab,
    users,
    tickets,
    loading,
    error,
    isScannerOpen,
    selectedTicket,
    isSearching,
    loadingMore,
    hasMore,
    loadMoreRef,
    setIsScannerOpen,
    setSelectedTicket,
    handleTabChange,
    handleSearch,
    handleScan,
    handleValidationComplete,
  };
};

export type { TabType }; 