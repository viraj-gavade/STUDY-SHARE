import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.model';
import PasswordReset from '../models/passwordReset.model';
import { generateToken } from '../utils/jwt.utils';
import { sendEmail } from '../utils/email.utils';

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

/**
 * Generate and send a password reset code
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found with this email address' });
      return;
    }

    // Generate a random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Delete any existing password reset codes for this user
    await PasswordReset.deleteMany({ email });

    // Save the new reset code
    await PasswordReset.create({
      email,
      resetCode,
      expiresAt,
      used: false,
    });

    console.log(`Password reset code for ${email}: ${resetCode}`);
    // Send the reset code via email
    await sendEmail({
      to: email,
      subject: 'StudyShare Password Reset',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your StudyShare account.</p>
        <p>Your password reset code is: <strong>${resetCode}</strong></p>
        <p>This code is valid for 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    });

    res.status(200).json({ 
      message: 'Password reset code sent to your email address',
      email 
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error while processing password reset', error: error.message });
  }
};

/**
 * Verify reset code and reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, resetCode, newPassword } = req.body;

    // Find the reset code entry
    const resetEntry = await PasswordReset.findOne({
      email,
      resetCode,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetEntry) {
      res.status(400).json({ message: 'Invalid or expired reset code' });
      return;
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    // Mark the reset code as used
    resetEntry.used = true;
    await resetEntry.save();

    res.status(200).json({ message: 'Password has been successfully reset' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error while resetting password', error: error.message });
  }
};
