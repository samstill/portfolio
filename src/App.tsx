import React, { Suspense } from 'react';
import { 
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import styled, { StyleSheetManager, keyframes } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import MeshGradientBackground from './presentation/components/MeshGradientBackground';
import { ThemeProvider } from './shared/context/ThemeContext';
import { AuthProvider } from './shared/context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './shared/components/ProtectedRoute';
import { AdminRoute } from './shared/components/AdminRoute';
import { ProfileProvider } from './shared/context/ProfileContext';
import { AIProvider } from './shared/contexts/AIContext';
import './shared/styles/typography.css';

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

// Lazy load legal screens
const TermsConditionsScreen = React.lazy(() => import('./presentation/screens/legal/TermsConditionsScreen'));
const PrivacyPolicyScreen = React.lazy(() => import('./presentation/screens/legal/PrivacyPolicyScreen'));
const RefundPolicyScreen = React.lazy(() => import('./presentation/screens/legal/RefundPolicyScreen'));
const AboutUsScreen = React.lazy(() => import('./presentation/screens/legal/AboutUsScreen'));

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
`;

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

// Loading component for Suspense fallback
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
    <Route>
      <Route index element={
        <Suspense fallback={
          <LoadingSpinner>
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
            <LoadingText>Loading...</LoadingText>
          </LoadingSpinner>
        }>
          <HomeScreen />
        </Suspense>
      } />
      <Route
        path="login"
        element={
          <PublicOnlyRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <LoginScreen />
            </Suspense>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="signup"
        element={
          <PublicOnlyRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <SignUpScreen />
            </Suspense>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="reset-password"
        element={
          <PublicOnlyRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <ResetPasswordScreen />
            </Suspense>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="events"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <EventsScreen />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <ProfileScreen />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <AdminScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="admin/users/:userId"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <UserDetailScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="admin/users/:userId/tickets"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <UserTicketsScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="admin/users/:userId/transactions"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <UserTransactionsScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="events/create"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <CreateEventScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="messages"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <MessagesScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="events/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <EventDetailScreen />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="events/:id/edit"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <EditEventScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="events/:id/book"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <BookingScreen />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <TicketScreen />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="my-tickets"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <MyTicketsScreen />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="validate-ticket/:ticketId"
        element={
          <AdminRoute>
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <ValidateTicketScreen />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route path="unauthorized" element={
        <Suspense fallback={
          <LoadingSpinner>
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
            <LoadingText>Loading...</LoadingText>
          </LoadingSpinner>
        }>
          <UnauthorizedScreen />
        </Suspense>
      } />
      <Route path="/payment-error" element={
        <Suspense fallback={
          <LoadingSpinner>
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
            <LoadingText>Loading...</LoadingText>
          </LoadingSpinner>
        }>
          <PaymentErrorScreen />
        </Suspense>
      } />
      <Route path="*" element={
        <Suspense fallback={
          <LoadingSpinner>
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
            <LoadingText>Loading...</LoadingText>
          </LoadingSpinner>
        }>
          <NotFoundScreen />
        </Suspense>
      } />
      <Route path="legal">
        <Route
          path="terms-conditions"
          element={
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <TermsConditionsScreen />
            </Suspense>
          }
        />
        <Route
          path="privacy-policy"
          element={
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <PrivacyPolicyScreen />
            </Suspense>
          }
        />
        <Route
          path="refund-policy"
          element={
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <RefundPolicyScreen />
            </Suspense>
          }
        />
        <Route
          path="about-us"
          element={
            <Suspense fallback={
              <LoadingSpinner>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
                <LoadingText>Loading...</LoadingText>
              </LoadingSpinner>
            }>
              <AboutUsScreen />
            </Suspense>
          }
        />
      </Route>
    </Route>
  ),
  {
    basename: '/',
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }
  }
);

const App: React.FC = () => {
  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => !['margin'].includes(prop)}
    >
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProfileProvider>
              <AIProvider>
                <AppContainer>
                  <MeshGradientBackground />
                  <ContentContainer>
                    <RouterProvider router={router} />
                  </ContentContainer>
                </AppContainer>
              </AIProvider>
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </StyleSheetManager>
  );
};

export default App;
