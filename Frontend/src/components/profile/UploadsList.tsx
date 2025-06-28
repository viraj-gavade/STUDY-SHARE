import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Resource } from '@/services/resource';

interface UploadsListProps {
  uploads: Resource[];
  loading: boolean;
  error: any;
}

const UploadsList: React.FC<UploadsListProps> = ({ uploads, loading, error }) => {
  
  // Loading state
  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Uploads</h2>
        <div className="animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md p-4">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Uploads</h2>
        <p className="text-red-500">Failed to load your uploads. Please try again.</p>
      </Card>
    );
  }
  
  // Empty state
  if (!uploads || uploads.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Uploads</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't uploaded any resources yet.</p>
          <Button 
            onClick={() => window.location.href = '/resources/upload'}
            className="px-4 py-2"
          >
            Upload Your First Resource
          </Button>
        </div>
      </Card>
    );
  }

  // Sort uploads by most recent first
  const sortedUploads = [...uploads].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Uploads</h2>
        <Button 
          onClick={() => window.location.href = '/resources/upload'}
          variant="outline"
          className="px-3 py-1 text-sm"
        >
          Upload New
        </Button>
      </div>
      
      <div className="space-y-4">
        {sortedUploads.map((upload) => (
          <div 
            key={upload._id} 
            className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{upload.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {upload.subject}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                    {upload.fileType.split('/')[1]}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Uploaded {new Date(upload.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center text-sm font-medium text-amber-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {upload.upvotes || 0}
                </div>
                
                <a 
                  href={upload.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1">Download</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UploadsList;
