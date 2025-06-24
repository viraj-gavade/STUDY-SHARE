import { Request, Response, NextFunction } from 'express';
import { check, ValidationChain } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const registerValidation: ValidationChain[] = [
  check('name', 'Name is required').not().isEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  check('department', 'Department is required').not().isEmpty(),
  check('semester', 'Semester must be a number').isNumeric(),
  check('role')
    .optional()
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin'),
];

/**
 * Validation rules for user login
 */
export const loginValidation: ValidationChain[] = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').not().isEmpty(),
];

/**
 * Validation rules for forgot password
 */
export const forgotPasswordValidation: ValidationChain[] = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
];

/**
 * Validation rules for reset password
 */
export const resetPasswordValidation: ValidationChain[] = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('resetCode', 'Reset code is required').isLength({ min: 6, max: 6 }).isNumeric(),
  check('newPassword', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
];
