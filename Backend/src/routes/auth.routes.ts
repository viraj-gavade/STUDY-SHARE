import { Router } from 'express';
import { 
  loginUser, 
  registerUser, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth.controller.js';
import { 
  loginValidation, 
  registerValidation, 
  forgotPasswordValidation,
  resetPasswordValidation
} from '../middlewares/auth.validation.js';

const router = Router();

/**
 * @route   POST api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, registerUser);

/**
 * @route   POST api/auth/login
 * @desc    Login a user and get token
 * @access  Public
 */
router.post('/login', loginValidation, loginUser);

/**
 * @route   POST api/auth/forgot-password
 * @desc    Send a password reset code to user's email
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);

/**
 * @route   POST api/auth/reset-password
 * @desc    Reset user's password using the reset code
 * @access  Public
 */
router.post('/reset-password', resetPasswordValidation, resetPassword);

export default router;
