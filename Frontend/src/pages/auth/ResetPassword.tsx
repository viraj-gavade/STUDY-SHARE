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
import authService, { ResetPasswordData } from '@/services/api';

// Schema matching backend validation
const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Please include a valid email' }),
  resetCode: z
    .string()
    .length(6, { message: 'Reset code must be exactly 6 digits' })
    .regex(/^\d+$/, { message: 'Reset code must contain only numbers' }),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password' }),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password confirmation does not match new password",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    try {
      await authService.resetPassword(data as ResetPasswordData);
      toast.success('Password reset successfully');
      navigate('/auth/login');
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, errors: backendErrors } = error.response.data;
        
        // Handle invalid or expired reset code
        if (message === 'Invalid or expired reset code') {
          setError('resetCode', {
            type: 'manual',
            message: 'The reset code is invalid or has expired',
          });
        } 
        // Handle user not found
        else if (message === 'User not found') {
          setError('email', {
            type: 'manual',
            message: 'No account found with this email',
          });
        }
        // Handle validation errors from backend
        else if (backendErrors) {
          backendErrors.forEach((err: any) => {
            setError(err.param as keyof ResetPasswordFormData, {
              type: 'manual',
              message: err.msg,
            });
          });
        } else {
          toast.error(message || 'Failed to reset password');
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
      title="Reset your password"
      description="Enter the 6-digit code sent to your email along with your new password"
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
          <Label htmlFor="resetCode">
            Reset Code
          </Label>
          <div className="mt-1">
            <Input
              id="resetCode"
              placeholder="6-digit code"
              maxLength={6}
              {...register('resetCode')}
              className={errors.resetCode ? 'border-red-500' : ''}
            />
          </div>
          {errors.resetCode && (
            <p className="mt-1 text-sm text-red-600">{errors.resetCode.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword">
            New Password
          </Label>
          <div className="mt-1">
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••"
              {...register('newPassword')}
              className={errors.newPassword ? 'border-red-500' : ''}
            />
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">
            Confirm Password
          </Label>
          <div className="mt-1">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </AuthFormWrapper>
  );
};

export default ResetPassword;
