import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Include cookies with cross-origin requests
  headers: {
    'Content-Type': 'application/json',
    // Ensure referrer policy is set for all requests
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  createdAt: string;
}

export interface Resource {
  _id: string;
  title: string;
  description: string;
  subject: string;
  department: string;
  semester: number;
  teacher?: string;
  tags?: string[];
  fileUrl: string;
  fileType: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
    department?: string;
    semester?: number;
  };
  upvotes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFormData {
  title: string;
  description: string;
  subject: string;
  department: string;
  semester: number;
  teacher?: string;
  tags?: string;
  file: File | null;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  searchText?: string;
  department?: string;
  semester?: number | string;
  fileType?: string;
  sortBy?: 'recent' | 'upvotes' | 'comments';
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SearchResponse {
  resources: Resource[];
  pagination: PaginationInfo;
}

const resourceService = {
  // Get all resources with optional pagination
  getResources: async (): Promise<Resource[]> => {
    const response = await api.get('/resources');
    return response.data.resources;
  },

  // Search resources with filters
  searchResources: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.get('/resources/search', { params });
    return response.data;
  },

  // Get a single resource by ID
  getResourceById: async (id: string): Promise<Resource> => {
    const response = await api.get(`/resources/${id}`);
    return response.data.resource;
  },

  // Upload a new resource
    uploadResource: async (formData: FormData): Promise<Resource> => {
    // Log form data entries to see actual content
    console.log('Form data to upload:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: `, value);
    }
    
    const response = await api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.resource;
  },

  // Upvote a resource
  upvoteResource: async (id: string): Promise<{ upvotes: number }> => {
    const response = await api.post(`/resources/${id}/upvote`);
    return response.data;
  },

  // Add a comment to a resource
  addComment: async (id: string, text: string): Promise<{ comment: Comment }> => {
    const response = await api.post(`/resources/${id}/comment`, { text });
    return response.data;
  },

  // Get user's own resources
  getUserResources: async (): Promise<Resource[]> => {
    const response = await api.get('/resources/user');
    return response.data.resources;
  },

  // Update resource metadata
  updateResource: async (id: string, data: Partial<ResourceFormData>): Promise<Resource> => {
    const response = await api.put(`/resources/${id}`, data);
    return response.data.resource;
  },

  // Delete a resource
  deleteResource: async (id: string): Promise<void> => {
    await api.delete(`/resources/${id}`);
  }
};

export default resourceService;