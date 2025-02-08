import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Ticket } from '../../../domain/entities/Ticket';
import { ticketService } from '../../../firebase/services/ticketService';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import { SearchBar } from '../../components/SearchBar';
import { Skeleton } from '../../components/Skeleton';
import QRScannerSection from '../../components/admin/QRScannerSection';
import TicketActions from '../../components/admin/TicketActions';
import TicketValidation from '../TicketValidation';
import { pageTransition, cardTransition, staggerContainer, overlayTransition } from '../../../shared/animations';
import { useNavigate } from 'react-router-dom';
import { ModelSelector } from '../../components/ModelSelector';
import { useAI } from '../../../shared/contexts/AIContext';

const TicketsGrid = styled.div`
  display: grid;
  gap: 25px;
  margin-top: 20px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));

  @media (min-width: 1800px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1400px) and (max-width: 1799px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) and (max-width: 1399px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 15px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;

    > * {
      width: 100% !important;
      margin: 0 !important;
    }
  }
`;

const TicketCard = styled(motion.div)<{ $isSelected?: boolean }>`
  background: ${props => props.$isSelected ? 
    'rgba(74, 108, 247, 0.15)' : 
    'rgba(255, 255, 255, 0.05)'};
  padding: 25px;
  border-radius: 15px;
  border: 1px solid ${props => props.$isSelected ? 
    'rgba(74, 108, 247, 0.5)' : 
    'rgba(255, 255, 255, 0.1)'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  transform: translateZ(0);
  will-change: transform;
  box-sizing: border-box;
  width: 100%;
  
  &:hover {
    background: ${props => props.$isSelected ? 
      'rgba(74, 108, 247, 0.2)' : 
      'rgba(255, 255, 255, 0.08)'};
    transform: translateY(-5px) translateZ(0);
    box-shadow: 0 5px 20px -5px rgba(31, 38, 135, 0.15);
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TicketCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 10px;
`;

const TicketTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin: 0;
  flex: 1;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TicketDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 15px 0;
  flex: 1;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 45px;
  }
`;

const DetailItem = styled.div`
  .label {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 0.95rem;
    color: ${props => props.theme.text};
    font-weight: 500;
    word-break: break-word;
  }
`;

const ProgressBar = styled.div<{ $percentage: number }>`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$percentage}%;
    background: linear-gradient(135deg, #6e8efb, #4a6cf7);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const StatusBadge = styled.span<{ status: Ticket['status'] }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${props => {
    switch (props.status) {
      case 'valid': return 'rgba(76, 175, 80, 0.2)';
      case 'used': return 'rgba(255, 193, 7, 0.2)';
      case 'cancelled': return 'rgba(244, 67, 54, 0.2)';
      default: return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'valid': return '#4CAF50';
      case 'used': return '#FFC107';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  }};
  backdrop-filter: blur(5px);
`;

const TicketStats = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StatBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(74, 108, 247, 0.15);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4a6cf7;

  .count {
    font-weight: 600;
  }

  .label {
    opacity: 0.8;
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
`;

const LoadMoreContainer = styled(motion.div)`
  min-height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const ValidationOverlay = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 32px rgba(31, 38, 135, 0.37);
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1000;
  max-height: 90vh;
  overflow-y: auto;
  padding: env(safe-area-inset-bottom);
  
  > div {
    padding: 30px;
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    max-height: 85vh;
    border-radius: 15px 15px 0 0;
    
    > div {
      padding: 20px 15px;
    }
  }
`;

const OverlayBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
`;

const ValidationCloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const BottomSheetHandle = styled.div`
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin: 0 auto 20px;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
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

const ITEMS_PER_PAGE = 12;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const TicketAdminScreen: React.FC = () => {
  const { selectedModel } = useAI();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filteredData, setFilteredData] = useState<Ticket[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
    triggerOnce: false,
    delay: 100
  });

  const navigate = useNavigate();

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

      setFilteredData(filteredTickets);

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
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setIsSearching(false);
      setLoading(false);
      setLoadingMore(false);
      setIsInitialLoad(false);
    }
  }, [page]);

  const debouncedTicketSearch = useMemo(
    () => debounce((searchText: string) => fetchTickets(searchText, true), 500),
    [fetchTickets]
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const shouldLoadMore = 
      !isInitialLoad && 
      inView && 
      !isSearching && 
      !loadingMore && 
      hasMore &&
      filteredData.length > tickets.length;

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
    tickets.length
  ]);

  const handleTicketUpdate = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, ...updates } : ticket
    ));
  };

  const handleTicketSelect = (ticket: Ticket) => {
    if (window.innerWidth > 768) {
      navigate(`/admin/tickets/${ticket.id}/validate`);
    } else {
      setSelectedTicket(ticket);
    }
  };

  return (
    <motion.div {...pageTransition}>
      <Header>
        <HeaderLeft>
          <SearchWrapper>
            <SearchBar
              placeholder="Search tickets by number, event, or user..."
              onSearch={debouncedTicketSearch}
              isLoading={isSearching}
            />
          </SearchWrapper>
        </HeaderLeft>
        <HeaderRight>
          <ModelSelector />
        </HeaderRight>
      </Header>

      <QRScannerSection onTicketFound={(ticket) => handleTicketSelect(ticket)} />

      <AnimatePresence mode="wait">
        {loading ? (
          <TicketsGrid
            as={motion.div}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div key={index} variants={cardTransition}>
                <TicketCard>
                  <Skeleton height={200} />
                </TicketCard>
              </motion.div>
            ))}
          </TicketsGrid>
        ) : tickets.length === 0 ? (
          <NoResults {...pageTransition}>
            <FiTag />
            <p>No tickets found</p>
          </NoResults>
        ) : (
          <>
            <TicketsGrid
              as={motion.div}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {tickets.map((ticket, index) => {
                const usagePercentage = (ticket.usedCount / ticket.quantity) * 100;
                const isSelected = selectedTicket?.id === ticket.id;
                const uniqueKey = `${ticket.id}_${index}`;
                
                return (
                  <motion.div
                    key={uniqueKey}
                    variants={cardTransition}
                    custom={index}
                  >
                    <TicketCard
                      $isSelected={isSelected}
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <TicketCardHeader>
                        <TicketTitle>{ticket.eventDetails.title}</TicketTitle>
                        <StatusBadge status={ticket.status}>
                          {ticket.status.toUpperCase()}
                        </StatusBadge>
                      </TicketCardHeader>

                      <ProgressBar $percentage={usagePercentage} />
                      
                      <TicketDetails>
                        <DetailItem>
                          <div className="label">Ticket #</div>
                          <div className="value">{ticket.ticketNumber}</div>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">User ID</div>
                          <div className="value" style={{ fontSize: '0.8rem' }}>
                            {ticket.userId.substring(0, 8)}...
                          </div>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">Event Date</div>
                          <div className="value">
                            {new Date(ticket.eventDetails.date).toLocaleDateString()}
                          </div>
                        </DetailItem>
                        <DetailItem>
                          <div className="label">Purchase Date</div>
                          <div className="value">
                            {new Date(ticket.purchasedAt).toLocaleDateString()}
                          </div>
                        </DetailItem>
                        {ticket.lastValidatedAt && (
                          <DetailItem>
                            <div className="label">Last Used</div>
                            <div className="value">
                              {new Date(ticket.lastValidatedAt).toLocaleString()}
                            </div>
                          </DetailItem>
                        )}
                      </TicketDetails>

                      <TicketActions 
                        ticket={ticket}
                        onUpdate={(updates) => handleTicketUpdate(ticket.id, updates)}
                      />

                      <TicketStats>
                        <StatBadge>
                          <span className="count">{ticket.usedCount}</span>
                          <span className="label">/ {ticket.quantity}</span>
                        </StatBadge>
                      </TicketStats>
                    </TicketCard>
                  </motion.div>
                );
              })}
            </TicketsGrid>
            {(hasMore || loadingMore) && (
              <LoadMoreContainer ref={loadMoreRef}>
                {loadingMore && <LoadingAnimation />}
              </LoadMoreContainer>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Only show overlay on mobile */}
      <AnimatePresence>
        {selectedTicket && (
          <>
            <OverlayBackdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
            />
            <ValidationOverlay
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 200,
                mass: 1
              }}
            >
              <ValidationCloseButton
                onClick={() => setSelectedTicket(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={20} />
              </ValidationCloseButton>
              <TicketValidation
                ticket={selectedTicket}
                onValidationComplete={() => {
                  if (selectedTicket.id) {
                    Promise.all([
                      ticketService.getTicket(selectedTicket.id).then(setSelectedTicket),
                      ticketService.getAllTickets().then((newTickets) => {
                        setTickets(
                          newTickets.sort((a, b) => 
                          new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
                        )
                        );
                      })
                    ]);
                  }
                }}
              />
            </ValidationOverlay>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TicketAdminScreen; 