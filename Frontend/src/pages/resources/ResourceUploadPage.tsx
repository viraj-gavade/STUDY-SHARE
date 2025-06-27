import React from 'react';
import { Link } from 'react-router-dom';
import ResourceUploadForm from '@/components/resources/ResourceUploadForm';
import Navbar from '@/components/Navbar';   
import Footer from '@/components/Footer';

const ResourceUploadPage: React.FC = () => {
  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/resources" className="hover:text-blue-600">Resources</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Upload New Resource</span>
        </nav>
      </div>
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <ResourceUploadForm />
      </div>
    </div>
   < Footer/>
    </>
  );
};

export default ResourceUploadPage;