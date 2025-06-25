import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Simple component to debug authentication issues
const AuthDebugger: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log authentication state whenever it changes
    console.log('=== Auth Debug Info ===');
    console.log('Current path:', location.pathname);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('Loading:', loading);
    console.log('Token exists:', !!localStorage.getItem('token'));
    console.log('=====================');
  }, [isAuthenticated, user, loading, location.pathname]);

  // This component doesn't render anything
  return null;
};

export default AuthDebugger;
