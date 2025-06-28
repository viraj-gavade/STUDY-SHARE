import { useState } from 'react';
import resourceService, { ResourceFormData } from '../services/resource';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const useUpload = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateFile = (file: File | null): boolean => {
    if (!file) {
      setError('Please select a file to upload');
      return false;
    }

    // Check file size (max 200MB)
    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 200MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return false;
    }

    // Check file types
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.ms-powerpoint',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: PDF, DOCX, PPTX, XLSX, JPG, PNG');
      return false;
    }

    return true;
  };

  const uploadResource = async (data: ResourceFormData): Promise<boolean> => {
    
    console.log('Data received from the frontend:', data);
    if (data.file) {
      console.log('File details:', {
        name: data.file.name,
        size: data.file.size,
        sizeInMB: (data.file.size / (1024 * 1024)).toFixed(2) + 'MB',
        type: data.file.type
      });
    }
    
    setLoading(true);
    setError(null);

    if (!validateFile(data.file)) {
      setLoading(false);
      return false;
    }

    // Additional validation before submission
    if (!data.title || !data.subject || !data.department || 
        data.semester === undefined || data.semester === null || 
        isNaN(Number(data.semester))) {
      setError('Please fill in all required fields correctly');
      setLoading(false);
      return false;
    }

    try {
      // Convert form data to FormData for multipart upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('subject', data.subject);
      formData.append('department', data.department);
      formData.append('semester', data.semester ? data.semester.toString() : '');
      
      if (data.teacher) {
        formData.append('teacher', data.teacher);
      }
      
      if (data.tags) {
        formData.append('tags', data.tags);
      }
      
      if (data.file) {
        formData.append('file', data.file);
        console.log('Adding file to formData:', data.file.name);
      }

      // Send upload request
      console.log('Sending upload request to server...');
      const response = await resourceService.uploadResource(formData);
      console.log('Upload response:', response);
      
      // Show success toast
      toast.success('Resource uploaded successfully!');
      
      // Redirect to resources page
      navigate('/resources');
      
      return true;
    } catch (err: any) {
      console.error('Upload error:', err);
      
      // Handle validation errors from backend
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Show each validation error as a toast
        err.response.data.errors.forEach((error: { msg: string; path: string; type: string }) => {
          toast.error(`${error.path}: ${error.msg}` || 'Validation error');
        });
        setError('Please fix the validation errors');
      } else {
        const errorMessage = err.response?.data?.message || 'Failed to upload resource';
        setError(errorMessage);
        toast.error(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadResource,
    loading,
    error,
    validateFile,
  };
};

export default useUpload;
