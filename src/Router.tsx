import React, { Suspense } from 'react';
import { 
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ProtectedRoute, PublicOnlyRoute } from './shared/components/ProtectedRoute';
import { AdminRoute } from './shared/components/AdminRoute';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load all screens with error boundaries
const withErrorBoundary = (Component: React.LazyExoticComponent<React.FC>) => (
  <ErrorBoundary
    fallback={
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>Something went wrong</h2>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            background: '#4a6cf7',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
    }
  >
    <Suspense fallback={
      <LoadingSpinner>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
        <LoadingText>Loading...</LoadingText>
      </LoadingSpinner>
    }>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// Lazy load all screens
const HomeScreen = React.lazy(() => import('./presentation/screens/HomeScreen'));
const NotFoundScreen = React.lazy(() => import('./presentation/screens/NotFoundScreen'));
const LoginScreen = React.lazy(() => import('./presentation/screens/LoginScreen'));
const SignUpScreen = React.lazy(() => import('./presentation/screens/SignUpScreen'));
const ResetPasswordScreen = React.lazy(() => import('./presentation/screens/ResetPasswordScreen'));
const EventsScreen = React.lazy(() => import('./presentation/screens/EventsScreen'));
const ProfileScreen = React.lazy(() => import('./presentation/screens/ProfileScreen'));
const AdminScreen = React.lazy(() => import('./presentation/screens/AdminScreen'));
const CreateEventScreen = React.lazy(() => import('./presentation/screens/CreateEventScreen'));
const MessengerScreen = React.lazy(() => import('./presentation/screens/MessengerScreen'));
const ChatScreen = React.lazy(() => import('./presentation/screens/ChatScreen'));
const MessagesScreen = React.lazy(() => import('./presentation/screens/MessagesScreen'));
const EventDetailScreen = React.lazy(() => import('./presentation/screens/EventDetailScreen'));
const EditEventScreen = React.lazy(() => import('./presentation/screens/EditEventScreen'));
const BookingScreen = React.lazy(() => import('./presentation/screens/BookingScreen'));
const TicketScreen = React.lazy(() => import('./presentation/screens/TicketScreen'));
const MyTicketsScreen = React.lazy(() => import('./presentation/screens/MyTicketsScreen'));
const ValidateTicketScreen = React.lazy(() => import('./presentation/screens/ValidateTicketScreen'));
const UnauthorizedScreen = React.lazy(() => import('./presentation/screens/UnauthorizedScreen'));
const PaymentErrorScreen = React.lazy(() => import('./presentation/screens/PaymentErrorScreen'));
const UserDetailScreen = React.lazy(() => import('./presentation/screens/UserDetailScreen'));
const UserTicketsScreen = React.lazy(() => import('./presentation/screens/UserTicketsScreen'));
const UserTransactionsScreen = React.lazy(() => import('./presentation/screens/UserTransactionsScreen'));
const TicketValidationScreen = React.lazy(() => import('./presentation/screens/admin/TicketValidationScreen'));
const UserSearchScreen = React.lazy(() => import('./presentation/screens/UserSearchScreen'));

// Lazy load legal screens
const TermsConditionsScreen = React.lazy(() => import('./presentation/screens/legal/TermsConditionsScreen'));
const PrivacyPolicyScreen = React.lazy(() => import('./presentation/screens/legal/PrivacyPolicyScreen'));
const RefundPolicyScreen = React.lazy(() => import('./presentation/screens/legal/RefundPolicyScreen'));
const AboutUsScreen = React.lazy(() => import('./presentation/screens/legal/AboutUsScreen'));

// Loading animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(0.85); opacity: 0.5; }
  50% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0.85); opacity: 0.5; }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
`;

const Spinner = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: ${props => props.theme.colors?.primary || '#3498db'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  &::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: -9px;
    left: -9px;
    right: -9px;
    bottom: -9px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: ${props => props.theme.colors?.secondary || '#e74c3c'};
    animation: ${spin} 1.5s linear infinite reverse;
  }
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors?.text || '#2c3e50'};
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 16px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={withErrorBoundary(NotFoundScreen)}>
      {/* Public Routes */}
      <Route index element={withErrorBoundary(HomeScreen)} />

      {/* Auth Routes - Only accessible when NOT logged in */}
      <Route path="login" element={
        <PublicOnlyRoute>
          {withErrorBoundary(LoginScreen)}
        </PublicOnlyRoute>
      } />
      <Route path="signup" element={
        <PublicOnlyRoute>
          {withErrorBoundary(SignUpScreen)}
        </PublicOnlyRoute>
      } />
      <Route path="reset-password" element={
        <PublicOnlyRoute>
          {withErrorBoundary(ResetPasswordScreen)}
        </PublicOnlyRoute>
      } />

      {/* Protected Routes - Require Authentication */}
      <Route path="events" element={
        <ProtectedRoute>
          {withErrorBoundary(EventsScreen)}
        </ProtectedRoute>
      } />
      <Route path="events/:id" element={
        <ProtectedRoute>
          {withErrorBoundary(EventDetailScreen)}
        </ProtectedRoute>
      } />
      <Route path="events/:id/book" element={
        <ProtectedRoute>
          {withErrorBoundary(BookingScreen)}
        </ProtectedRoute>
      } />
      <Route path="profile" element={
        <ProtectedRoute>
          {withErrorBoundary(ProfileScreen)}
        </ProtectedRoute>
      } />
      <Route path="my-tickets" element={
        <ProtectedRoute>
          {withErrorBoundary(MyTicketsScreen)}
        </ProtectedRoute>
      } />
      <Route path="/tickets/:ticketId" element={
        <ProtectedRoute>
          {withErrorBoundary(TicketScreen)}
        </ProtectedRoute>
      } />
      <Route path="messages" element={
        <ProtectedRoute>
          {withErrorBoundary(MessagesScreen)}
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="admin" element={
        <AdminRoute>
          {withErrorBoundary(AdminScreen)}
        </AdminRoute>
      } />
      <Route path="admin/users" element={
        <AdminRoute>
          {withErrorBoundary(AdminScreen)}
        </AdminRoute>
      } />
      <Route path="admin/tickets" element={
        <AdminRoute>
          {withErrorBoundary(AdminScreen)}
        </AdminRoute>
      } />
      <Route path="admin/users/:userId" element={
        <AdminRoute>
          {withErrorBoundary(UserDetailScreen)}
        </AdminRoute>
      } />
      <Route path="admin/users/:userId/tickets" element={
        <AdminRoute>
          {withErrorBoundary(UserTicketsScreen)}
        </AdminRoute>
      } />
      <Route path="admin/users/:userId/transactions" element={
        <AdminRoute>
          {withErrorBoundary(UserTransactionsScreen)}
        </AdminRoute>
      } />
      <Route path="admin/tickets/:ticketId/validate" element={
        <AdminRoute>
          {withErrorBoundary(TicketValidationScreen)}
        </AdminRoute>
      } />
      <Route path="events/create" element={
        <AdminRoute>
          {withErrorBoundary(CreateEventScreen)}
        </AdminRoute>
      } />
      <Route path="events/:id/edit" element={
        <AdminRoute>
          {withErrorBoundary(EditEventScreen)}
        </AdminRoute>
      } />
      <Route path="validate-ticket/:ticketId" element={
        <AdminRoute>
          {withErrorBoundary(ValidateTicketScreen)}
        </AdminRoute>
      } />

      {/* Messenger Routes */}
      <Route path="messenger" element={
        <ProtectedRoute>
          {withErrorBoundary(MessengerScreen)}
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="search" />} />
        <Route path="search" element={withErrorBoundary(UserSearchScreen)} />
        <Route path="chat/:conversationId" element={withErrorBoundary(ChatScreen)} />
      </Route>

      {/* Error and Status Routes */}
      <Route path="unauthorized" element={withErrorBoundary(UnauthorizedScreen)} />
      <Route path="/payment-error" element={withErrorBoundary(PaymentErrorScreen)} />

      {/* Legal Routes */}
      <Route path="legal">
        <Route path="terms-conditions" element={withErrorBoundary(TermsConditionsScreen)} />
        <Route path="privacy-policy" element={withErrorBoundary(PrivacyPolicyScreen)} />
        <Route path="refund-policy" element={withErrorBoundary(RefundPolicyScreen)} />
        <Route path="about-us" element={withErrorBoundary(AboutUsScreen)} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={withErrorBoundary(NotFoundScreen)} />
    </Route>
  ),
  {
    basename: '/',
    future: {
      v7_relativeSplatPath: true
    }
  }
);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router; 