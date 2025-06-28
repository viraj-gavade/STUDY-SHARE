import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import authService from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface UserProfileData {
  name: string;
  email: string;
  department: string;
  semester: number;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

const UserProfileCard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    department: '',
    semester: 1
  });
  const [isDirty, setIsDirty] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getUserProfile();
        const userData = response.user;
        setProfile(userData);
        setFormData({
          email: userData.email,
          department: userData.department,
          semester: userData.semester
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value,
    }));
    setIsDirty(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await authService.updateProfile(formData);
      
      // Refresh profile data
      const response = await authService.getUserProfile();
      setProfile(response.user);
      
      toast.success('Profile updated successfully');
      setIsDirty(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
        </div>
      </Card>
    );
  }

  // Error state
  if (!profile) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Failed to load profile data. Please refresh the page.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Refresh
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-gray-600">{profile.role}</p>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Joined {new Date(profile.createdAt || '').toLocaleDateString()}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <Input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
            Semester
          </label>
          <select
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                Semester {num}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!isDirty || saving}
            className="px-4 py-2"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserProfileCard;
