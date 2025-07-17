import { body, validationResult } from 'express-validator';
import ApiError from '../../utils/apiError.js';


const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation failed', errors.array()));
  }
  next();
};

export const vendorQuoteValidator = [
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('details').trim().notEmpty().withMessage('Details are required'),
  handleValidation
];

export const finalQuoteValidator = [
  body('price').isFloat({ gt: 0 }).withMessage('Final quote price must be greater than 0'),
  body('details').trim().notEmpty().withMessage('Final quote details are required'),
  handleValidation
];

export const shipMaterialValidator = [
  body('carrier').trim().notEmpty().withMessage('Shipping carrier is required'),
  body('trackingNumber').trim().notEmpty().withMessage('Tracking number is required'),
  body('eta').isISO8601().withMessage('ETA must be a valid date'),
  handleValidation
];
