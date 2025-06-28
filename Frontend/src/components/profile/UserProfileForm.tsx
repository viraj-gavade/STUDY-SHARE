import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import authService from '@/services/api';

// Create schema for form validation
const profileSchema = z.object({
  email: z.string().email({ message: 'Please include a valid email' }),
  semester: z.string().refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1 && num <= 8;
    },
    { message: 'Semester must be a number between 1 and 8' }
  ),
  department: z.string().min(2, { message: 'Department is required' })
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const UserProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange'
  });
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await authService.getUserProfile();
        const { user } = data;
        
        if (user) {
          const formData = {
            email: user.email,
            semester: user.semester.toString(),
            department: user.department
          };
          
          setInitialData(formData);
          reset(formData); // Set form default values
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [reset]);
  
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      
      // Convert semester to number if needed
      const semesterValue = parseInt(data.semester, 10);
      
      await authService.updateProfile({
        email: data.email,
        semester: semesterValue,
        department: data.department
      });
      
      toast.success('Profile updated successfully');
      setInitialData(data); // Update the initial data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !initialData) {
    return <div className="text-center p-4">Loading profile...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <select
          id="semester"
          {...register('semester')}
          className={`w-full px-3 py-2 border rounded-md ${errors.semester ? 'border-red-500' : 'border-gray-300'}`}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>
              Semester {num}
            </option>
          ))}
        </select>
        {errors.semester && (
          <p className="text-red-500 text-sm mt-1">{errors.semester.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          type="text"
          placeholder="Enter your department"
          {...register('department')}
          className={errors.department ? 'border-red-500' : ''}
        />
        {errors.department && (
          <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={loading || !isDirty} 
        className="w-full"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
};

export default UserProfileForm;
