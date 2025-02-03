import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiCreditCard, FiDollarSign, FiTag, FiClock, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Ticket } from '../../domain/entities/Ticket';
import { ticketService } from '../../firebase/services/ticketService';
import { userService } from '../../firebase/services/userService';
import { UserData } from '../../shared/types/user';
import { LoadingCard } from '../components/common/LoadingCard';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
  background: linear-gradient(135deg, ${props => props.theme.background}, ${props => props.theme.background}F2);

  @media (max-width: 768px) {
    padding: 60px 15px 15px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 25px;
  padding: 0;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin: 0 0 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto 30px;
  padding: 0 15px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 15px;
    margin: 0 auto 20px;
    max-width: 100%;
  }
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 15px 20px;
  padding-right: 45px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 12px 40px 12px 15px;
    font-size: 0.95rem;
  }
`;

const ClearButton = styled(motion.button)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const TransactionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const TransactionTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin: 0;
  font-weight: 500;
`;

const TransactionAmount = styled.div<{ type: 'payment' | 'refund' }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.type === 'payment' ? '#4CAF50' : '#F44336'};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.95rem;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  svg {
    font-size: 48px;
    margin-bottom: 20px;
    color: ${props => props.theme.primary};
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: ${props => props.theme.text};
  }

  p {
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LoadingState: React.FC = () => {
  return (
    <Container>
      <ContentWrapper>
        <LoadingContainer>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </LoadingContainer>
      </ContentWrapper>
    </Container>
  );
};

const UserTransactionsScreen: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        const [userData, userTickets] = await Promise.all([
          userService.getUserById(userId),
          ticketService.getTicketsByUserId(userId)
        ]);
        
        setUser(userData);
        
        // Transform tickets into transactions
        const allTransactions = userTickets
          .map(ticket => ({
            id: ticket.id,
            eventTitle: ticket.eventDetails.title,
            amount: ticket.amountPaid,
            type: 'payment',
            date: ticket.purchasedAt,
            paymentMode: ticket.paymentMode,
            ticketNumber: ticket.ticketNumber,
            transactionId: ticket.transactionId
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.eventTitle.toLowerCase().includes(searchLower) ||
      transaction.ticketNumber.toLowerCase().includes(searchLower) ||
      transaction.paymentMode.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <BackButton
            onClick={() => navigate(`/admin/users/${userId}`)}
            whileHover={{ x: -4 }}
          >
            <FiArrowLeft /> Back to User Details
          </BackButton>
          <Title>Transaction History - {user?.email}</Title>
        </Header>

        <SearchContainer>
          <SearchInput
            placeholder="Search by event name, ticket number, or payment mode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          {searchQuery && (
            <ClearButton
              onClick={() => setSearchQuery('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiX size={18} />
            </ClearButton>
          )}
        </SearchContainer>

        <AnimatePresence>
          {filteredTransactions.length === 0 ? (
            <EmptyState
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FiCreditCard />
              <h3>No Transactions Found</h3>
              <p>{transactions.length === 0 ? 'This user has no transactions yet.' : 'No transactions match your search.'}</p>
            </EmptyState>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate(`/tickets/${transaction.id}`)}
              >
                <TransactionHeader>
                  <TransactionTitle>{transaction.eventTitle}</TransactionTitle>
                  <TransactionAmount type={transaction.type}>
                    <span style={{ fontFamily: 'Arial' }}>₹</span>
                    {transaction.amount.toFixed(2)}
                  </TransactionAmount>
                </TransactionHeader>
                <TransactionDetails>
                  <TransactionInfo>
                    <FiClock />
                    {new Date(transaction.date).toLocaleDateString()}
                  </TransactionInfo>
                  <TransactionInfo>
                    <FiCreditCard />
                    {transaction.paymentMode}
                  </TransactionInfo>
                  <TransactionInfo>
                    <FiTag />
                    {transaction.ticketNumber}
                  </TransactionInfo>
                  <TransactionInfo>
                    <FiCalendar />
                    Transaction ID: {transaction.transactionId}
                  </TransactionInfo>
                </TransactionDetails>
              </TransactionCard>
            ))
          )}
        </AnimatePresence>
      </ContentWrapper>
    </Container>
  );
};

export default UserTransactionsScreen; 