import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthFormWrapper from '@/components/auth/AuthFormWrapper';
import authService, { RegisterData } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';


// Create schema based on backend validation
const signupSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please include a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  department: z.string().min(1, { message: 'Department is required' }),
  semester: z.coerce.number().positive({ message: 'Semester must be a positive number' })
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  
  // Debug log
  console.log('SignUp component rendered, isAuthenticated:', isAuthenticated);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    // Force the resolver to work with our types
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      // Ensure data has the correct type for RegisterData
      const registerData: RegisterData = {
        name: data.name,
        email: data.email,
        password: data.password,
        department: data.department,
        semester: data.semester
      };
      
      const response = await authService.register(registerData);
      
      // Update auth context with the user data
      login(response.token, response.user);
      
      // Show success message
      toast.success('Account created successfully!');
      
      // Redirect to home or dashboard
      navigate('/');
    } catch (error: unknown) {
      // Define a type for the backend error response
      interface BackendError {
        param: string;
        msg: string;
      }
      
      interface ErrorResponse {
        response?: { 
          data: { 
            message: string; 
            errors?: BackendError[]
          } 
        }
      }
      
      // Handle different error types
      const axiosError = error as ErrorResponse;
      
      if (axiosError.response && axiosError.response.data) {
        const { message, errors: backendErrors } = axiosError.response.data;
        
        // Handle duplicate email error
        if (message === 'User already exists with this email') {
          setError('email', {
            type: 'manual',
            message: 'Email already in use. Please use a different email.',
          });
        } 
        // Handle validation errors from backend
        else if (backendErrors) {
          backendErrors.forEach((err: BackendError) => {
            // Make sure the param is a valid key in our form
            if (err.param === 'name' || 
                err.param === 'email' || 
                err.param === 'password' || 
                err.param === 'department' || 
                err.param === 'semester') {
              
              setError(err.param, {
                type: 'manual',
                message: err.msg,
              });
            }
          });
        } else {
          toast.error(message || 'Failed to create account');
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
      title="Create your account"
      description="Enter your details to create a StudyShare account"
      footerText="Already have an account?"
      footerLink={{ text: "Sign in", to: "/auth/login" }}
    >
      <form onSubmit={handleSubmit((data) => {
        // Use the data with explicit typing
        return onSubmit(data as unknown as SignupFormData);
      })} className="space-y-6">
        <div>
          <Label htmlFor="name">
            Full Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="mt-1">
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">
            Email Address
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="mt-1">
            <Input
              id="email"
              type="email"
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
          <Label htmlFor="password">
            Password
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
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
          <Label htmlFor="department">
            Department
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="mt-1">
            <Input
              id="department"
              placeholder="Computer Science"
              {...register('department')}
              className={errors.department ? 'border-red-500' : ''}
            />
          </div>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="semester">
            Semester
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="mt-1">
            <Input
              id="semester"
              type="number"
              placeholder="3"
              {...register('semester')}
              className={errors.semester ? 'border-red-500' : ''}
            />
          </div>
          {errors.semester && (
            <p className="mt-1 text-sm text-red-600">{errors.semester.message}</p>
          )}
        </div>

      

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </AuthFormWrapper>
  );
};

export default SignUp;
