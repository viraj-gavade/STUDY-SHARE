import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { userValidation } from '../middlewares/user.validation';
import { getCurrentUser, updateCurrentUser } from '../controllers/user.controller';

const User_router = Router();

/**
 * @route   GET api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
User_router.get('/me', authMiddleware, getCurrentUser);

/**
 * @route   PATCH api/users/me
 * @desc    Update current user profile (email, semester, department)
 * @access  Private
 */
User_router.patch('/me', authMiddleware, userValidation, updateCurrentUser);

export default User_router;
