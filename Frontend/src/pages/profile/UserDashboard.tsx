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
import UserProfileForm from '@/components/profile/UserProfileForm';

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
    userId: user?.id
  } as SearchParams);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await authService.getUserProfile();
        setProfile(data.user); // Update to match backend response structure
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

  // Handle password form input change
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
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
        
        {/* User details summary card */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{profile?.name || user.name}</h2>
              <p className="text-gray-600">{profile?.email || user.email}</p>
              <div className="flex gap-3 mt-2 text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                  {profile?.department || 'Department'}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md">
                  Semester {profile?.semester || ''}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md capitalize">
                  {profile?.role || user.role || 'Student'}
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              size="sm"
              className="ml-auto"
            >
              Logout
            </Button>
          </div>
          
          {userResources && !resourcesLoading && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">My Uploads</h3>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-md">
                  {userResources.length} resources
                </span>
              </div>
            </div>
          )}
        </Card>
        
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                
                {loading ? (
                  <p>Loading profile data...</p>
                ) : profile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{profile.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{profile.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Semester</p>
                        <p className="font-medium">{profile.semester}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium capitalize">{profile.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="font-medium">
                          {profile.createdAt && new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No profile data available</p>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
                <UserProfileForm />
              </div>
            </div>
          </Card>
        )}
        
        {/* Resources tab */}
        {activeTab === 'resources' && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Resources</h2>
              <Button onClick={() => navigate('/resources/upload')}>
                Upload New Resource
              </Button>
            </div>
            
            {resourcesLoading ? (
              <div className="py-10 text-center">
                <p>Loading resources...</p>
              </div>
            ) : resourcesError ? (
              <div className="py-10 text-center">
                <p className="text-red-500">Error loading resources</p>
              </div>
            ) : userResources && userResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userResources.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="mb-4">You haven't uploaded any resources yet</p>
                <Button onClick={() => navigate('/resources/upload')}>
                  Upload Your First Resource
                </Button>
              </div>
            )}
          </Card>
        )}
        
      
      </div>
    </>
  );
};

export default UserDashboard;
