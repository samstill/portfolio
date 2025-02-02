import React from 'react';
import { 
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import styled, { StyleSheetManager } from 'styled-components';
import MeshGradientBackground from './presentation/components/MeshGradientBackground';
import HomeScreen from './presentation/screens/HomeScreen';
import NotFoundScreen from './presentation/screens/NotFoundScreen';
import LoginScreen from './presentation/screens/LoginScreen';
import SignUpScreen from './presentation/screens/SignUpScreen';
import EventsScreen from './presentation/screens/EventsScreen';
import ProfileScreen from './presentation/screens/ProfileScreen';
import AdminScreen from './presentation/screens/AdminScreen';
import CreateEventScreen from './presentation/screens/CreateEventScreen';
import MessagesScreen from './presentation/screens/MessagesScreen';
import EventDetailScreen from './presentation/screens/EventDetailScreen';
import BookingScreen from './presentation/screens/BookingScreen';
import TicketScreen from './presentation/screens/TicketScreen';
import MyTicketsScreen from './presentation/screens/MyTicketsScreen';
import ValidateTicketScreen from './presentation/screens/ValidateTicketScreen';
import UnauthorizedScreen from './presentation/screens/UnauthorizedScreen';
import PaymentErrorScreen from './presentation/screens/PaymentErrorScreen';
import './shared/styles/typography.css';
import { ThemeProvider } from './shared/context/ThemeContext';
import { AuthProvider } from './shared/context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './shared/components/ProtectedRoute';
import { AdminRoute } from './shared/components/AdminRoute';
import { ProfileProvider } from './shared/context/ProfileContext';
import { AIProvider } from './shared/contexts/AIContext';

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<HomeScreen />} />
      <Route
        path="login"
        element={
          <PublicOnlyRoute>
            <LoginScreen />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="signup"
        element={
          <PublicOnlyRoute>
            <SignUpScreen />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="events"
        element={
          <ProtectedRoute>
            <EventsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminScreen />
          </AdminRoute>
        }
      />
      <Route
        path="events/create"
        element={
          <AdminRoute>
            <CreateEventScreen />
          </AdminRoute>
        }
      />
      <Route
        path="messages"
        element={
          <AdminRoute>
            <MessagesScreen />
          </AdminRoute>
        }
      />
      <Route
        path="events/:id"
        element={
          <ProtectedRoute>
            <EventDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="events/:id/book"
        element={
          <ProtectedRoute>
            <BookingScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute>
            <TicketScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-tickets"
        element={
          <ProtectedRoute>
            <MyTicketsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="validate-ticket/:ticketId"
        element={
          <AdminRoute>
            <ValidateTicketScreen />
          </AdminRoute>
        }
      />
      <Route path="unauthorized" element={<UnauthorizedScreen />} />
      <Route path="/payment-error" element={<PaymentErrorScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Route>
  ),
  {
    basename: '/',
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const App: React.FC = () => {
  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => !['margin'].includes(prop)}
    >
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
    </StyleSheetManager>
  );
};

export default App;
