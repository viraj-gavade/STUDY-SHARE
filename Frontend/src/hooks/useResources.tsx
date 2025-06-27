import { useState, useEffect } from 'react';
import resourceService, { 
  Resource, 
  SearchParams, 
//   SearchResponse,
  PaginationInfo
} from '../services/resource';

export const useResources = (initialParams?: SearchParams) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>(initialParams || {
    page: 1,
    limit: 10,
    sortBy: 'recent',
  });

  const fetchResources = async (params?: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = params || searchParams;
      const response = await resourceService.searchResources(queryParams);
      setResources(response.resources);
      setPagination(response.pagination);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch resources';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceById = async (id: string): Promise<Resource | null> => {
    setLoading(true);
    setError(null);

    try {
      const resource = await resourceService.getResourceById(id);
      return resource;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch resource';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const userResources = await resourceService.getUserResources();
      setResources(userResources);
      return userResources;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch your resources';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (newParams: Partial<SearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);
    return fetchResources(updatedParams);
  };

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    resources,
    pagination,
    loading,
    error,
    fetchResources,
    fetchResourceById,
    fetchUserResources,
    updateSearch,
    searchParams,
  };
};

export default useResources;
