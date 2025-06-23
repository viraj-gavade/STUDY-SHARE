import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password, department, semester, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create new user with hashed password (handled by mongoose pre-save hook)
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook
      department,
      semester,
      role: role || 'student', // Default to student if not provided
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.email, newUser.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        semester: newUser.semester,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if password is correct
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};
