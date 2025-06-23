import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { loginValidation, registerValidation } from '../middlewares/auth.validation';

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

export default router;
