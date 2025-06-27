import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/api';
import { toast } from 'react-hot-toast';
import useResources from '@/hooks/useResources';
import ResourceCard from '@/components/resources/ResourceCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SearchParams } from '@/services/resource';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProfileData {
  name: string;
  email: string;
  department: string;
  semester: number;
  role: 'student' | 'admin';
  createdAt: string;
}

// Tabs for dashboard
type DashboardTab = 'profile' | 'resources' | 'password';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');

  // Form states
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    semester: 1,
  });

  // Password states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Get user resources
  const {
    resources: userResources,
    loading: resourcesLoading,
    error: resourcesError,
  } = useResources({ 
    limit: 8,
    // This would need to be implemented in the backend to filter by userId
    userId: user?.id
  } as SearchParams);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await authService.getUserProfile();
        setProfile(data);
        setFormData({
          name: data.name,
          department: data.department,
          semester: data.semester,
        });
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) : value,
    }));
  };

  // Handle password form input change
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.updateProfile(formData);
      setEditMode(false);
      
      // Refresh profile data
      const data = await authService.getUserProfile();
      setProfile(data);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      await authService.changePassword(passwordForm);
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    toast.success('Logged out successfully');
  };

  if (!user) {
    return (
        
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view your dashboard</p>
      </div>
    );
  }

  return (
      <>
      <Navbar/>
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('resources')}
          className={`py-2 px-4 ${activeTab === 'resources' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        >
          My Resources
        </button>
        <button 
          onClick={() => setActiveTab('password')}
          className={`py-2 px-4 ${activeTab === 'password' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        >
          Change Password
        </button>
      </div>
      
      {/* Profile tab */}
      {activeTab === 'profile' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          
          {loading ? (
            <p>Loading profile data...</p>
          ) : (
            <>
              {!editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{profile?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{profile?.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Semester</p>
                      <p className="font-medium">{profile?.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium capitalize">{profile?.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium">
                        {profile?.createdAt && new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-medium">
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="semester" className="block text-sm font-medium">
                      Semester
                    </label>
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </Card>
      )}
      
      {/* Resources tab */}
      {activeTab === 'resources' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Resources</h2>
            <Button onClick={() => navigate('/resources/upload')}>
              Upload New Resource
            </Button>
          </div>
          
          {resourcesLoading ? (
            <p>Loading your resources...</p>
          ) : resourcesError ? (
            <p className="text-red-500">Failed to load resources</p>
          ) : userResources.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg">You haven't uploaded any resources yet</p>
              <Button 
                onClick={() => navigate('/resources/upload')}
                className="mt-4"
              >
                Upload Your First Resource
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userResources.map(resource => (
                <ResourceCard 
                  key={resource._id}
                  resource={resource}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Password tab */}
      {activeTab === 'password' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                className="w-full p-2 border rounded-md"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </Card>
      )}
    </div>
    </>
  );
};

export default UserDashboard;
