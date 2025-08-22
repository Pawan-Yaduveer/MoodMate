import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  console.log('PrivateRoute state:', { isAuthenticated, loading });

  useEffect(() => {
    if (!loading) {
      // Small delay to prevent rapid state changes
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
