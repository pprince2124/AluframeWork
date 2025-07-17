// src/middleware/validators/userValidator.js
import { body, validationResult } from 'express-validator';
import ApiError from '../../utils/apiError.js';

export const registerValidator = [
  body('name').notEmpty().withMessage('Name required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Min‑6 char password'),
  (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(422, 'Validation failed', errors.array()));
    next();
  }
];

export const loginValidator = [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Phone required'),
  body('password').notEmpty().withMessage('Password required'),
  (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new ApiError(422, 'Validation failed', errors.array()));
    next();
  }
];
