import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthFormWrapper from '@/components/auth/AuthFormWrapper';
import authService from '@/services/api';

// Schema matching backend validation
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please include a valid email' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      await authService.forgotPassword(data);
      setSubmittedEmail(data.email);
      setSubmitted(true);
      toast.success('Reset instructions sent to your email');
    } catch (error: any) {
      // Even if user doesn't exist, we show a success message for security
      // This prevents user enumeration attacks
      if (error.response && error.response.status === 404) {
        setSubmittedEmail(data.email);
        setSubmitted(true);
        toast.success('Reset instructions sent to your email');
      } else if (error.response && error.response.data) {
        // Only show other errors during development
        const { message } = error.response.data;
        toast.error(message || 'Failed to process request');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthFormWrapper
        title="Check your email"
        description="We've sent a password reset code to:"
      >
        <div className="text-center">
          <p className="font-medium text-lg mb-6">{submittedEmail}</p>
          <p className="mb-8 text-gray-600">
            Please check your email for a 6-digit code to reset your password. The code will expire in 15 minutes.
          </p>
          
          <div className="space-y-4">
            <Link to="/auth/reset-password">
              <Button className="w-full">
                Enter reset code
              </Button>
            </Link>
            
            <p className="text-sm">
              Didn't receive an email?{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-blue-600 hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title="Reset your password"
      description="Enter your email address and we'll send you a reset code"
      footerText="Remember your password?"
      footerLink={{ text: "Sign in", to: "/auth/login" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </div>
      </form>
    </AuthFormWrapper>
  );
};

export default ForgotPassword;
