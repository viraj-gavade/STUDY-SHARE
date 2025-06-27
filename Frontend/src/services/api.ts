import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Include cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
    // Ensure referrer policy is set for all requests
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration or unauthorized
    if (error.response && error.response.status === 401 && localStorage.getItem('token')) {
      // Only clear tokens if this is a session timeout/invalid token
      // (not for failed login attempts)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Authentication token expired or invalid. Redirecting to login.');
      // Force redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  department: string;
  semester: number;
  role?: 'student' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth API service
const authService = {
  // Register a new user
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login a user
  login: async (credentials: LoginData) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Request password reset
  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset password with code
  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
  
  // Get user profile
  getUserProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (data: {
    name?: string;
    department?: string;
    semester?: number;
  }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  
  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      // Log the error and clear invalid user data
      console.error('Invalid user data found in localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
