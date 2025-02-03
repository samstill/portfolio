import React from 'react';
import { Tab, Tabs } from '@mui/material';
import QRScannerComponent from './QRScannerComponent';
import { SearchBar } from '../../../components/SearchBar';
import { UserCard } from '../../../components/UserCard';
import { TicketCard } from '../../../components/TicketCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { useAdminScreen } from '../hooks/useAdminScreen';
import {
  AdminContainer,
  TabsContainer,
  SearchWrapper,
  ContentContainer,
  GridContainer,
  LoadingContainer,
  NoResultsContainer,
  LoadMoreTrigger,
  ErrorContainer,
} from '../styles/AdminScreen.styles';

export const AdminScreen: React.FC = () => {
  const {
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
  } = useAdminScreen();

  const renderContent = () => {
    if (loading && !loadingMore) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <ErrorContainer>
          <p>Error: {error}</p>
        </ErrorContainer>
      );
    }

    if (activeTab === 'users' && users.length === 0 && !isSearching) {
      return (
        <NoResultsContainer>
          <p>No users found</p>
        </NoResultsContainer>
      );
    }

    if (activeTab === 'tickets' && tickets.length === 0 && !isSearching) {
      return (
        <NoResultsContainer>
          <p>No tickets found</p>
        </NoResultsContainer>
      );
    }

    return (
      <GridContainer>
        {activeTab === 'users'
          ? users.map((user) => (
              <UserCard key={user.uid} user={user} />
            ))
          : tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onValidationComplete={handleValidationComplete}
              />
            ))}
      </GridContainer>
    );
  };

  return (
    <AdminContainer>
      <TabsContainer>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => handleTabChange(newValue)}
          aria-label="admin tabs"
        >
          <Tab label="Users" value="users" />
          <Tab label="Tickets" value="tickets" />
        </Tabs>
      </TabsContainer>

      <SearchWrapper>
        <SearchBar
          onSearch={handleSearch}
          placeholder={`Search ${activeTab}...`}
        />
        {activeTab === 'tickets' && (
          <QRScannerComponent
            isScannerOpen={isScannerOpen}
            setIsScannerOpen={setIsScannerOpen}
            onScan={handleScan}
          />
        )}
      </SearchWrapper>

      <ContentContainer>
        {renderContent()}
        {hasMore && !loading && (
          <LoadMoreTrigger ref={loadMoreRef}>
            {loadingMore && <LoadingSpinner />}
          </LoadMoreTrigger>
        )}
      </ContentContainer>
    </AdminContainer>
  );
}; 