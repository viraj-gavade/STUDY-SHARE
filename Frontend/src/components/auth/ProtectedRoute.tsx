import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
  requireAuth?: boolean;
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/auth/login',
  requireAuth = true,
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
console.log('ProtectedRoute: loading=', loading, 'isAuthenticated=', isAuthenticated);


  if (loading) {
    // You can show a loading spinner or screen here
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If requireAuth is true but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If requireAuth is false and user is authenticated (used for auth pages)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the conditions are met, render the children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
