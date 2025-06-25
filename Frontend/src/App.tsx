

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
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

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true} redirectPath="/auth/login">
              <Home />
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
