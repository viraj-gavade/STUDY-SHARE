import { Request, Response, NextFunction } from 'express';
import Resource from '../models/resource.model';

/**
 * Search for resources based on given query parameters
 * @route GET /api/resources/search
 * @access Public
 */
export const searchResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      searchText,
      subject,
      department,
      semester,
      teacher,
      tags,
      fileType,
      uploadedBy,
      sortBy = 'recent',
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query: any = {};

    // Apply filters if provided
    if (searchText) {
      // Search in multiple fields
      query.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
        { subject: { $regex: searchText, $options: 'i' } },
        { teacher: { $regex: searchText, $options: 'i' } },
      ];
    }
    
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (department) query.department = { $regex: department, $options: 'i' };
    if (semester) query.semester = Number(semester);
    if (teacher) query.teacher = { $regex: teacher, $options: 'i' };
    if (uploadedBy) query.uploadedBy = uploadedBy;
    if (fileType) query.fileType = { $regex: fileType, $options: 'i' };
    
    // Handle tags (can be comma-separated string or array)
    if (tags) {
      const tagsArray = Array.isArray(tags) 
        ? tags 
        : String(tags).split(',').map(tag => tag.trim());
      query.tags = { $in: tagsArray };
    }

    // Pagination
    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    // Determine sort field and direction based on frontend sortBy
    let sortField = 'createdAt';
    let sortDirection: 'asc' | 'desc' = 'desc';
    
    if (sortBy === 'upvotes') {
      sortField = 'upvotes';
    } else if (sortBy === 'recent') {
      sortField = 'createdAt';
    }
    
    const sort: { [key: string]: 'asc' | 'desc' } = {
      [sortField]: sortDirection
    };
    
    // Special handling for comments count sorting
    let resources;
    if (sortBy === 'comments') {
      // First get all resources that match the query
      const allMatchingResources = await Resource.find(query)
        .populate('uploadedBy', 'name email department');
      
      // Sort manually by comments length
      resources = allMatchingResources
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(skip, skip + limitNum);
    } else {
      // Normal sorting for other cases
      resources = await Resource.find(query)
        .populate('uploadedBy', 'name email department')
        .sort(sort)
        .skip(skip)
        .limit(limitNum);
    }

    // Get total count for pagination
    const total = await Resource.countDocuments(query);

    res.status(200).json({
      resources,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error searching resources:', error);
    next(error);
  }
};