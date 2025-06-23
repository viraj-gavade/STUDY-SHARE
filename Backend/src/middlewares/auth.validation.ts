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
