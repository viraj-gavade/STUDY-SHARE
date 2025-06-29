import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import UserProfileCard from '@/components/profile/UserProfileCard';
import UploadsList from '@/components/profile/UploadsList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import resourceService from '@/services/resource';
import { Resource } from '@/services/resource';
import { useAuth } from '@/context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userResources, setUserResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserResources = async () => {
      try {
        setLoading(true);
        // Fetch resources uploaded by the current user
        const resources = await resourceService.getUserResources();
        setUserResources(resources);
        setError(null);
      } catch (err) {
        console.error('Error fetching user resources:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch resources'));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserResources();
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Dashboard | StudyShare</title>
        <meta name="description" content="View your profile and uploaded resources on StudyShare" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Section - 1/3 width on desktop */}
          <div className="md:col-span-1">
            <UserProfileCard />
          </div>
          
          {/* Uploads Section - 2/3 width on desktop */}
          <div className="md:col-span-2">
            <UploadsList 
              uploads={userResources} 
              loading={loading} 
              error={error} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;