
import { Request, Response, NextFunction } from 'express';
import { check, ValidationChain, validationResult } from 'express-validator';

/**
 * Validation rules for resource creation
 */
export const resourceValidation: ValidationChain[] = [
  check('title', 'Title is required').not().isEmpty().trim(),
  check('subject', 'Subject is required').not().isEmpty().trim(),
  check('department', 'Department is required').not().isEmpty().trim(),
  check('semester', 'Semester is required').not().isEmpty(),
  check('semester', 'Semester must be a number').isNumeric(),
  // Optional fields with validation if provided
  check('description').optional().trim(),
  check('teacher').optional().trim(),
  check('tags').optional(),
];

/**
 * Middleware to handle validation errors
 */
export const validateResource = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
