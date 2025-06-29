import React, { useState, useRef, } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useUpload from '@/hooks/useUpload';
import { toast } from 'react-hot-toast';
import { ResourceFormData } from '@/services/resource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Predefined options for department and semester
const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Electronics',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Business Administration',
  'Economics',
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const ResourceUploadForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { uploadResource, loading, error } = useUpload();
  
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    subject: '',
    department: user?.department || '',
    semester: user?.semester || 1,
    teacher: '',
    tags: '',
    file: null,
  });
  
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle semester as a number
    if (name === 'semester') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value === '' ? 1 : parseInt(value, 10) 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, file }));
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData((prev) => ({ ...prev, file }));
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Open file dialog when the drop area is clicked
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const validationErrors: string[] = [];
    
    console.log('Form data before submission:', formData)
    console.log(typeof(formData.title))
    
    // if (!formData.title) validationErrors.push('Title is required');
    // if (!formData.subject) validationErrors.push('Subject is required');
    // if (!formData.department) validationErrors.push('Department is required');
    // if (!formData.file) validationErrors.push('File upload is required');

    
    // Validate semester is a number and provided
    // if (formData.semester === '' || formData.semester === undefined) {
    //   validationErrors.push('Semester is required');
    // } else if (isNaN(Number(formData.semester))) {
    //   validationErrors.push('Semester must be a number');
    // }
    
    // Display validation errors
    if (validationErrors.length > 0) {
      validationErrors.forEach(err => toast.error(err));
      return;
    }
    
    // Submit form and handle response

    console.log("Form data  before going to api request : " , formData)
    const success = await uploadResource(formData);

    if (success) {
      toast.success('Resource uploaded successfully!');
      navigate('/resources');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Study Resource</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p className="font-medium">{error}</p>
          {error === 'Please fix the validation errors' && (
            <p className="text-sm mt-1">Please check that all required fields are filled correctly.</p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a descriptive title"
            required
          />
        </div>
        
        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g. Data Structures, Database Systems"
            required
          />
        </div>
        
        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        {/* Semester */}
        <div className="space-y-2">
          <Label htmlFor="semester">Semester *</Label>
          <select
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem.toString()}>{`Semester ${sem}`}</option>
            ))}
          </select>
        </div>
        
        {/* Teacher (optional) */}
        <div className="space-y-2">
          <Label htmlFor="teacher">Teacher (optional)</Label>
          <Input
            id="teacher"
            name="teacher"
            value={formData.teacher || ''}
            onChange={handleInputChange}
            placeholder="Teacher's name"
          />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a brief description of the resource"
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags || ''}
            onChange={handleInputChange}
            placeholder="e.g. notes, assignment, lecture, exam"
          />
        </div>
        
        {/* File Upload with Drag & Drop */}
        <div className="space-y-2">
          <Label htmlFor="file">File Upload *</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${formData.file ? 'bg-gray-50' : 'hover:bg-gray-50'} cursor-pointer transition-all`}
            onClick={openFileDialog}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file"
              name="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
              className="hidden"
              required
            />
            
            {formData.file ? (
              <div className="flex flex-col items-center">
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="max-h-40 max-w-full mb-4 rounded" />
                ) : (
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-200 rounded">
                    <span className="text-gray-500">{formData.file.name.split('.').pop()?.toUpperCase()}</span>
                  </div>
                )}
                <p className="text-sm font-medium">{formData.file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(formData.file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <div className="mx-auto w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Drag & drop or click to select file</p>
                <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOCX, PPTX, XLSX, JPG, PNG</p>
                <p className="text-xs text-gray-500 mt-1">Max file size: 15MB</p>
              </>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Resource'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResourceUploadForm;