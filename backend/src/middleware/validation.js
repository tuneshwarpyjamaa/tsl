import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('username')
    .isLength({ min: 1, max: 20 })
    .withMessage('Username must be between 1 and 20 characters'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
