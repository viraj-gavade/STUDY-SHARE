import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useResources from '@/hooks/useResources';
import ResourceList from '@/components/resources/ResourceList';
import { Button } from '@/components/ui/button';
import { SearchParams } from '@/services/resource';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { string } from 'zod';




const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState({
    departments: [] as string[],
    semesters: [] as number[],
    fileTypes: [] as string[],
  });

  // Parse search params
  const initialParams: SearchParams = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    searchText: searchParams.get('searchText') || undefined,
    department: searchParams.get('department') || undefined,
    semester: searchParams.get('semester') ? Number(searchParams.get('semester')) : undefined,
    fileType: searchParams.get('fileType') || undefined,
    sortBy: (searchParams.get('sortBy') as 'recent' | 'upvotes' | 'comments') || 'recent',
  };

  const {
    resources,
    pagination,
    loading,
    error,
    fetchResources,
    updateSearch,
    searchParams: currentSearchParams,
  } = useResources(initialParams);

  // Update URL when search params change
  useEffect(() => {
    if (currentSearchParams) {
      const newParams = new URLSearchParams();
      
      if (currentSearchParams.page && currentSearchParams.page > 1) {
        newParams.set('page', currentSearchParams.page.toString());
      }
      
      if (currentSearchParams.searchText) {
        newParams.set('searchText', currentSearchParams.searchText);
      }
      
      if (currentSearchParams.department) {
        newParams.set('department', currentSearchParams.department);
      }
      
      if (currentSearchParams.semester) {
        newParams.set('semester', currentSearchParams.semester.toString());
      }
      
      if (currentSearchParams.fileType) {
        newParams.set('fileType', currentSearchParams.fileType);
      }
      
      if (currentSearchParams.sortBy && currentSearchParams.sortBy !== 'recent') {
        newParams.set('sortBy', currentSearchParams.sortBy);
      }
      
      setSearchParams(newParams);
    }
  }, [currentSearchParams, setSearchParams]);

  // Extract available filter options from resource data
  useEffect(() => {
    if (resources.length > 0) {
      const departments = Array.from(new Set(resources.map(r => r.department)));
      const semesters = Array.from(new Set(resources.map(r => r.semester))).sort((a, b) => a - b);
      const fileTypes = Array.from(new Set(resources.map(r => r.fileType)));
      
      setFilterOptions({
        departments,
        semesters,
        fileTypes,
      });
    }
  }, [resources]);

  // Handle page change
  const handlePageChange = (page: number) => {
    updateSearch({ page });
    window.scrollTo(0, 0);
  };

  // Handle search change
  const handleSearchChange = (params: Partial<SearchParams>) => {
    updateSearch(params);
  };

  // Handle resource upvote
  const handleUpvote = async (id: string) => {
    // If user sorts by upvotes, we need to refresh the list to get the updated order
    if (searchParams.get('sortBy') === 'upvotes') {
      fetchResources(currentSearchParams);
    }
    // Otherwise, each ResourceCard handles its own upvote state
  };

  return (
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="container mx-auto px-4 py-10 flex-grow">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Study Resources</h1>
          <p className="text-gray-600 mt-1">
            Browse and search through study materials uploaded by students
          </p>
        </div>
        
        {user && (
          <Link to="/resources/upload">
            <Button className="mt-4 md:mt-0">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Resource
            </Button>
          </Link>
        )}
      </div>
      
      {/* Resources list with filters */}
      <ResourceList
        resources={resources}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onUpvote={handleUpvote}
        filterOptions={filterOptions}
        searchParams={currentSearchParams}
      />
    </div>
       <Footer/>
    </div>
  );
};

export default ResourcesPage;