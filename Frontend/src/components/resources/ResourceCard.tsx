import React from 'react';
import { Link } from 'react-router-dom';
import { Resource } from '@/services/resource';
import { useAuth } from '@/context/AuthContext';
import resourceService from '@/services/resource';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

// Helper to get file type icon
const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  } else if (fileType.includes('word') || fileType.includes('doc')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  } else if (fileType.includes('presentation') || fileType.includes('powerpoint') || fileType.includes('ppt')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  } else if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
};

// Function to format file size from URL string
const getFileExtension = (fileUrl: string) => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  return extension ? extension.toUpperCase() : 'FILE';
};

interface ResourceCardProps {
  resource: Resource;
  onUpvote?: (id: string) => void;
  showActions?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource,
  onUpvote,
  showActions = true 
}) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = React.useState<number>(resource.upvotes);
  const [isUpvoting, setIsUpvoting] = React.useState<boolean>(false);
  
  // Handle upvote click
  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to upvote resources');
      return;
    }
    
    if (isUpvoting) return;
    
    try {
      setIsUpvoting(true);
      const response = await resourceService.upvoteResource(resource._id);
      setUpvotes(response.upvotes);
      
      if (onUpvote) {
        onUpvote(resource._id);
      }
      
      toast.success('Resource upvoted!');
    } catch (error) {
      toast.error('Failed to upvote resource',error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link to={`/resources/${resource._id}`} className="block">
        <div className="p-5 flex flex-col h-full">
          {/* Header with title and file type */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold line-clamp-2 flex-1">{resource.title}</h3>
            <div className="ml-4 flex-shrink-0">
              {getFileIcon(resource.fileType)}
              <span className="text-xs font-medium mt-1 block text-center">
                {getFileExtension(resource.fileUrl)}
              </span>
            </div>
          </div>
          
          {/* Subject and department info */}
          <div className="text-sm text-gray-600 mb-2 flex items-center space-x-2">
            <span className="font-medium">{resource.subject}</span>
            <span className="text-gray-400">•</span>
            <span>{resource.department}</span>
            <span className="text-gray-400">•</span>
            <span>Sem {resource.semester}</span>
          </div>
          
          {/* Description */}
          {resource.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{resource.description}</p>
          )}
          
          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Footer with metadata */}
          <div className="mt-auto pt-3 border-t flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <span>By {resource.uploadedBy?.name}</span>
              <span className="mx-2">•</span>
              <span>{formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}</span>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-4">
                {/* Comments count */}
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>{resource.comments.length}</span>
                </div>
                
                {/* Upvotes */}
                <button 
                  onClick={handleUpvote} 
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{upvotes}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ResourceCard;