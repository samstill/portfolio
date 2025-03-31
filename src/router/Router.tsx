import { createBrowserRouter } from 'react-router-dom';
import TicketValidationScreen from '../presentation/screens/TicketValidationScreen';
import BackButton from '../presentation/components/BackButton';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = () => (
  <div className="error-fallback">
    <h2>Something went wrong</h2>
    <button onClick={() => window.location.reload()}>Refresh</button>
  </div>
);

// Ensure the validation route exists
const router = createBrowserRouter([
  {
    path: '/admin/tickets/:ticketId/validate',
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BackButton />
        <TicketValidationScreen />
      </ErrorBoundary>
    ),
  },
  // ... other routes
]);

export default router; 