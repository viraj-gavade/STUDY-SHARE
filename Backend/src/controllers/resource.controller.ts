import { Request, Response, NextFunction } from 'express';
import Resource from '../models/resource.model';
import { AuthRequest } from '../middlewares/auth';

export const createResource = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    // req.file comes from multer
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    
    const file = req.file as Express.MulterS3.File;
    
    // Create new resource
    const resource = new Resource({
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      department: req.body.department,
      semester: req.body.semester,
      teacher: req.body.teacher,
      tags: req.body.tags?.split(',').map((tag: string) => tag.trim()),
      fileUrl: file.location,
      fileType: file.mimetype,
      uploadedBy: req.user._id,
    });
    
    const savedResource = await resource.save();
    
    res.status(201).json({
      message: 'Resource created successfully',
      resource: savedResource,
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    next(error);
  }
};

export const getAllResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resources = await Resource.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ resources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    next(error);
  }
};

export const getResourceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('comments.user', 'name email');
      
    if (!resource) {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
    
    res.status(200).json({ resource });
  } catch (error) {
    console.error('Error fetching resource:', error);
    next(error);
  }
};

export const upvoteResource = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
    
    // Increment upvotes
    resource.upvotes += 1;
    await resource.save();
    
    res.status(200).json({ 
      message: 'Resource upvoted successfully',
      upvotes: resource.upvotes 
    });
  } catch (error) {
    console.error('Error upvoting resource:', error);
    next(error);
  }
};

export const addComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const { text } = req.body;
    
    if (!text) {
      res.status(400).json({ message: 'Comment text is required' });
      return;
    }
    
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
    
    // Add new comment
    resource.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });
    
    await resource.save();
    
    // Return the newly added comment with user details
    const updatedResource = await Resource.findById(req.params.id)
      .populate('comments.user', 'name email');
      
    const newComment = updatedResource?.comments[updatedResource.comments.length - 1];
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    next(error);
  }
};