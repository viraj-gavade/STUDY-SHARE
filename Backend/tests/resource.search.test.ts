import { searchResources } from '../src/controllers/search.controller';
import Resource from '../src/models/resource.model';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Mock mongoose methods
jest.mock('../src/models/resource.model', () => ({
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockImplementation(() => Promise.resolve([
    {
      _id: 'test-id-1',
      title: 'Test Resource 1',
      description: 'A test description',
      subject: 'Computer Science',
      department: 'Computer Science',
      semester: 1,
      fileUrl: 'https://example.com/test.pdf',
      fileType: 'application/pdf',
      upvotes: 5,
      comments: [{ _id: 'comment1' }, { _id: 'comment2' }],
      createdAt: new Date().toISOString(),
      uploadedBy: { name: 'Test User', email: 'test@example.com' }
    }
  ])),
  countDocuments: jest.fn().mockResolvedValue(1)
}));

describe('Search Controller Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('searchResources should return resources with pagination', async () => {
    // Set up request query params
    req.query = {
      searchText: 'test',
      page: '1',
      limit: '10'
    };

    // Call the function
    await searchResources(req as Request, res as Response, next);

    // Check if the appropriate methods were called
    expect(Resource.find).toHaveBeenCalled();
    expect(Resource.populate).toHaveBeenCalled();
    expect(Resource.sort).toHaveBeenCalled();
    expect(Resource.countDocuments).toHaveBeenCalled();

    // Check the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      resources: expect.any(Array),
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
        pages: 1
      }
    });
  });

  test('searchResources should handle sorting by upvotes', async () => {
    req.query = {
      sortBy: 'upvotes'
    };

    await searchResources(req as Request, res as Response, next);

    expect(Resource.sort).toHaveBeenCalledWith({ upvotes: 'desc' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('searchResources should handle sorting by recent', async () => {
    req.query = {
      sortBy: 'recent'
    };

    await searchResources(req as Request, res as Response, next);

    expect(Resource.sort).toHaveBeenCalledWith({ createdAt: 'desc' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // Test error handling
  test('searchResources should handle errors', async () => {
    const error = new Error('Database error');
    (Resource.find as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await searchResources(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});