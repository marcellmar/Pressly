import { useEffect } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Component to handle session persistence and redirection
 * This component doesn't render anything but ensures session state is maintained
 * and handles redirects for protected routes.
 */
const SessionPersistence = () => {
  const { isAuthenticated, checkSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current route requires authentication
  const isProtectedRoute = () => {
    const protectedRoutes = [
      '/dashboard',
      '/designs',
      '/smart-match',
      '/my-portfolio',
      '/capacity',
      '/schedule',
      '/equipment',
      '/profile',
      '/messages',
      '/orders'
    ];

    // Check if current path matches any protected route
    // or starts with one of the protected routes followed by a slash or end of string
    return protectedRoutes.some(route =>
      location.pathname === route ||
      location.pathname.startsWith(`${route}/`)
    );
  };

  // Check session validity and handle redirects on mount and route changes
  useEffect(() => {
    // Check if current session is valid
    const sessionValid = checkSession();
    const isProtected = isProtectedRoute();

    // Redirect to login if protected route and not authenticated
    if (isProtected && !sessionValid) {
      // Save the current location to redirect back after login
      navigate('/login', { state: { from: location } });
    }
  }, [location.pathname, checkSession, isAuthenticated, navigate, location]);

  // This component doesn't render anything
  return null;
};

export default SessionPersistence;