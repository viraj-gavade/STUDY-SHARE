import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import resourceService, { Resource, Comment } from '@/services/resource';
// import { Button } from '@/components/ui/button';
import PDFPreview from '@/components/resources/PDFPreview';
import CommentBox from '@/components/resources/CommentBox';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [upvotes, setUpvotes] = useState<number>(0);
  
  // Fetch resource details
  useEffect(() => {
    const fetchResource = async () => {
      if (!id) {
        setError('Resource ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const data = await resourceService.getResourceById(id);
        setResource(data);
        setUpvotes(data.upvotes);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch resource details');
        toast.error('Failed to load resource');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);
  
  // Handle upvote
  const handleUpvote = async () => {
    if (!resource || !user) {
      toast.error('Please log in to upvote resources');
      return;
    }
    
    try {
      const response = await resourceService.upvoteResource(resource._id);
      setUpvotes(response.upvotes);
      toast.success('Resource upvoted!');
    } catch (error) {
      toast.error('Failed to upvote resource');
    }
  };
  
  // Handle comment added
  const handleCommentAdded = (newComment: Comment) => {
    if (resource) {
      // Update the resource with the new comment
      setResource({
        ...resource,
        comments: [...resource.comments, newComment]
      });
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Error state
  if (error || !resource) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>{error || 'Resource not found'}</p>
          <Link to="/resources" className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 block">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }
  
  // Success state with resource details
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/resources" className="hover:text-blue-600">Resources</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{resource.title}</span>
        </nav>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Resource details column */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <h1 className="text-xl md:text-2xl font-bold mb-3">{resource.title}</h1>
            
            {/* Resource metadata */}
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <p className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Uploaded by {resource.uploadedBy.name}
                </p>
                
                <p className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                </p>
                
                <p className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {resource.department}
                </p>
                
                <p className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {resource.subject}
                </p>
                
                <p className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Semester {resource.semester}
                </p>
                
                {resource.teacher && (
                  <p className="flex items-center mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    Teacher: {resource.teacher}
                  </p>
                )}
              </div>
              
              {/* Resource description */}
              {resource.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              )}
              
              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-4">
                  {/* Download button */}
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                  
                  {/* Upvote button */}
                  <button
                    onClick={handleUpvote}
                    disabled={!user}
                    className="text-gray-600 hover:text-blue-600 flex items-center text-sm font-medium"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>{upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments section */}
          <CommentBox 
            resourceId={resource._id}
            comments={resource.comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>
        
        {/* Document preview column */}
        <div className="lg:col-span-2 order-1 lg:order-2 mb-6 lg:mb-0">
          <div className="sticky top-4">
            <PDFPreview 
              fileUrl={resource.fileUrl}
              fileType={resource.fileType}
              fileName={resource.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;