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

    // Check file size (max 15MB)
    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 15MB limit');
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
    
    console.log('Data recived from the frontend:',data)
    
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
      }

      // Send upload request

      await resourceService.uploadResource(formData);
      
      // Show success toast
      toast.success('Resource uploaded successfully!');
      
      // Redirect to resources page
      navigate('/resources');
      
      return true;
    } catch (err: any) {
      // Handle validation errors from backend
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Show each validation error as a toast
        err.response.data.errors.forEach((error: { msg: string; path: string; type: string }) => {
          toast.error(error.msg || 'Validation error');
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
