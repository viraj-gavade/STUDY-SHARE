import React from 'react';
import { Resource, SearchParams } from '@/services/resource';
import ResourceCard from './ResourceCard';
import { Button } from '@/components/ui/button';

interface ResourceListProps {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
  onUpvote?: (id: string) => void;
  onSearchChange?: (params: Partial<SearchParams>) => void;
  filterOptions?: {
    departments: string[];
    semesters: number[];
    fileTypes: string[];
  };
  searchParams?: SearchParams;
}

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  loading,
  error,
  pagination,
  onPageChange,
  onUpvote,
  onSearchChange,
  filterOptions,
  searchParams,
}) => {
  // Function to handle sort change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSearchChange) {
      onSearchChange({ sortBy: event.target.value as 'recent' | 'upvotes' | 'comments' });
    }
  };

  // Function to handle department filter change
  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSearchChange) {
      onSearchChange({ department: event.target.value, page: 1 });
    }
  };

  // Function to handle semester filter change
  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSearchChange) {
      onSearchChange({ 
        semester: event.target.value ? Number(event.target.value) : undefined,
        page: 1 
      });
    }
  };

//   // Function to handle file type filter change
//   const handleFileTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     if (onSearchChange) {
//       onSearchChange({ fileType: event.target.value, page: 1 });
//     }
//   };

  // Function to handle search input
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      // Only update after user stops typing (debounce)
      const searchText = event.target.value;
      onSearchChange({ searchText, page: 1 });
    }
  };

  // Function to handle page change for pagination
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      {onSearchChange && filterOptions && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search resources..."
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onChange={handleSearchInput}
                defaultValue={searchParams?.searchText}
              />
            </div>
            
            {/* Department filter */}
            {filterOptions.departments.length > 0 && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={handleDepartmentChange}
                  value={searchParams?.department || ''}
                >
                  <option value="">All Departments</option>
                  {filterOptions.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Semester filter */}
            {filterOptions.semesters.length > 0 && (
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  id="semester"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={handleSemesterChange}
                  value={searchParams?.semester || ''}
                >
                  <option value="">All Semesters</option>
                  {filterOptions.semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Sort by */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onChange={handleSortChange}
                value={searchParams?.sortBy || 'recent'}
              >
                <option value="recent">Most Recent</option>
                <option value="upvotes">Most Upvoted</option>
                <option value="comments">Most Commented</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Resources grid */}
      {!loading && resources.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4M12 4v16"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard 
              key={resource._id} 
              resource={resource} 
              onUpvote={onUpvote}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === pagination.page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="hidden sm:block"
              >
                {page}
              </Button>
            ))}
            
            <span className="text-sm text-gray-500 sm:hidden">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ResourceList;