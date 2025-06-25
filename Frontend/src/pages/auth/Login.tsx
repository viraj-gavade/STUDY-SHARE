import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthFormWrapper from '@/components/auth/AuthFormWrapper';
import authService, { LoginData } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Schema matching backend validation
const loginSchema = z.object({
  email: z.string().email({ message: 'Please include a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(data as LoginData);
      
      // Update auth context with the user data
      login(response.token, response.user);
      
      toast.success('Login successful');
      
      // Redirect to home/dashboard
      navigate('/');
    } catch (error: any) {
      // Handle different types of errors
      if (error.response && error.response.status === 401) {
        // Invalid credentials
        setError('root', { 
          type: 'manual',
          message: 'Invalid email or password' 
        });
      } else if (error.response && error.response.data) {
        const { message, errors: backendErrors } = error.response.data;
        
        // Handle validation errors from backend
        if (backendErrors) {
          backendErrors.forEach((err: any) => {
            setError(err.param as keyof LoginFormData, {
              type: 'manual',
              message: err.msg,
            });
          });
        } else {
          toast.error(message || 'Login failed');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Welcome back"
      description="Sign in to your StudyShare account"
      footerText="Don't have an account?"
      footerLink={{ text: "Sign up", to: "/auth/signup" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        <div>
          <Label htmlFor="email">
            Email Address
          </Label>
          <div className="mt-1">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Password
            </Label>
            <div className="text-sm">
              <Link to="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="mt-1 relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </AuthFormWrapper>
  );
};

export default Login;
