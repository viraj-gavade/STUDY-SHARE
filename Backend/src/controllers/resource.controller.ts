import { Request, Response, NextFunction } from 'express';
import Resource from '../models/resource.model';
import { AuthRequest } from '../middlewares/auth';

export const createResource = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = req.file as Express.MulterS3.File;

    const tags: string[] = (() => {
      if (!req.body.tags) return [];
      if (typeof req.body.tags === 'string') {
        return req.body.tags.split(',').map((tag:String)=> tag.trim());
      }
      if (Array.isArray(req.body.tags)) {
        return req.body.tags.map((tag:String) => tag.trim());
      }
      return [];
    })();

    const resource = new Resource({
      title: req.body.title,
      description: req.body.description || '',
      subject: req.body.subject,
      department: req.body.department,
      semester: req.body.semester,
      teacher: req.body.teacher || '',
      tags,
      fileUrl: file.location,
      fileType: file.mimetype,
      uploadedBy: req.user._id,
    });

    const savedResource = await resource.save();

    const populatedResource = await Resource.findById(savedResource._id)
      .populate('uploadedBy', 'name email department semester');

    res.status(201).json({
      message: 'Resource created successfully',
      resource: populatedResource,
    });

  } catch (error: any) {
    console.error('Error creating resource:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: 'Validation error', errors });
      return;
    }

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
    
    const userId = req.user._id;
    
    // Check if user has already upvoted this resource
    const userIndex = resource.upvotedBy.findIndex(
      (id) => id.toString() === userId.toString()
    );
    
    let message = '';
    
    if (userIndex === -1) {
      // User hasn't upvoted yet, so add upvote
      resource.upvotes += 1;
      resource.upvotedBy.push(userId);
      message = 'Resource upvoted successfully';
    } else {
      // User has already upvoted, so remove upvote
      resource.upvotes = Math.max(0, resource.upvotes - 1); // Ensure it doesn't go below 0
      resource.upvotedBy.splice(userIndex, 1);
      message = 'Upvote removed successfully';
    }
    
    await resource.save();
    
    res.status(200).json({ 
      message,
      upvotes: resource.upvotes,
      hasUpvoted: userIndex === -1 // If it was -1, user has now upvoted
    });
  } catch (error) {
    console.error('Error toggling resource upvote:', error);
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

/**
 * Update a resource's metadata
 * @route PUT /api/resources/:id
 * @access Private
 */
export const updateResource = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const resourceId = req.params.id;
    
    // Find the resource
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
    
    // Check ownership
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this resource' });
      return;
    }
    
    // Parse tags if provided
    let tags = resource.tags;
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        tags = req.body.tags.split(',').map((tag: string) => tag.trim());
      } else if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      }
    }
    
    // Update allowed fields
    const updatedData = {
      title: req.body.title || resource.title,
      description: req.body.description || resource.description,
      subject: req.body.subject || resource.subject,
      department: req.body.department || resource.department,
      semester: req.body.semester || resource.semester,
      teacher: req.body.teacher || resource.teacher,
      tags: tags,
    };
    
    // Update and return the updated document
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      updatedData,
      { new: true }
    ).populate('uploadedBy', 'name email');
    
    res.status(200).json({
      message: 'Resource updated successfully',
      resource: updatedResource,
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    next(error);
  }
};

/**
 * Delete a resource
 * @route DELETE /api/resources/:id
 * @access Private (owner or admin)
 */
export const deleteResource = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const resourceId = req.params.id;
    
    // Find the resource
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      res.status(404).json({ message: 'Resource not found' });
      return;
    }
    
    // Check ownership
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this resource' });
      return;
    }
    
    // Delete from database
    await Resource.findByIdAndDelete(resourceId);
    
    // Note: File cleanup from S3 could be implemented here
    // or handled by a separate scheduled process
    
    res.status(200).json({
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    next(error);
  }
};

/**
 * Get all resources uploaded by the current user
 * @route GET /api/resources/user
 * @access Private
 */
export const getUserResources = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const resources = await Resource.find({ uploadedBy: req.user._id })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ resources });
  } catch (error) {
    console.error('Error fetching user resources:', error);
    next(error);
  }
};