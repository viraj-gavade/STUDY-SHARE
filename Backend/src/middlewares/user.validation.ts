import { body } from 'express-validator';

export const userValidation = [
  // Validate email if provided
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  
  // Validate semester if provided
  body('semester')
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be a number between 1 and 8'),
  
  // Validate department if provided
  body('department')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters')
];
