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
      
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <ResourceUploadForm />
      </div>
    </div>
   < Footer/>
    </>
  );
};

export default ResourceUploadPage;