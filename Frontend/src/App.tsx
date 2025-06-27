

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ResourcesPage from './pages/resources/ResourcesPage';
import ResourceDetail from './pages/resources/ResourceDetail';
import ResourceUploadPage from './pages/resources/ResourceUploadPage';
import UserDashboard from './pages/profile/UserDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthDebugger from './components/auth/AuthDebugger';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
   <AuthProvider>
  <ToastProvider>
    <Router>
      <AuthDebugger />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/atest" element={<div>This is the test component</div>} />

        {/* Legacy redirects */}
        <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/register" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />

        {/* Resource Routes */}
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route 
          path="/resources/upload" 
          element={
            <ProtectedRoute requireAuth={true} redirectPath="/auth/login">
              <ResourceUploadPage />
            </ProtectedRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true} redirectPath="/auth/login">
              <Home />
            </ProtectedRoute>
          }
        />
        
        {/* User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth={true} redirectPath="/auth/login">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* TEMP: Comment out wildcard route for now */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  </ToastProvider>
</AuthProvider>

  );
}

export default App;
