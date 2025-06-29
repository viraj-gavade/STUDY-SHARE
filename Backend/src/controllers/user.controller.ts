import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import { AuthRequest } from '../middlewares/auth.js';

/**
 * Get current user profile
 * @route GET /api/users/me
 * @access Private
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // req.user is set by auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const user = await User.findById(userId).select('-password -__v');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        semester: user.semester,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update current user profile
 * @route PATCH /api/users/me
 * @access Private
 */
export const updateCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const { email, semester, department } = req.body;
    
    // Prepare update object with only provided fields
    const updateData: { email?: string; semester?: number; department?: string } = {};
    
    if (email !== undefined) updateData.email = email;
    if (semester !== undefined) updateData.semester = parseInt(semester, 10);
    if (department !== undefined) updateData.department = department;
    
    // Check if email already exists (if email is being updated)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        res.status(400).json({ message: 'Email already in use by another account' });
        return;
      }
    }
    
    // Update user with new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        department: updatedUser.department,
        semester: updatedUser.semester,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
