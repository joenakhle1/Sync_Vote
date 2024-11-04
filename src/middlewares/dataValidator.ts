import { body } from 'express-validator';
import { Request } from 'express-validator/lib/base';

export const validateCreateUser = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('username').notEmpty().withMessage('Username is required'),
];

export const validateUpdateComment = [
  body('description').isString().withMessage('Comment description required and as a string'),
];

export const validateUpdateUser = [
  (req: Request, res: any, next: (error?: any) => void) => {
    if (req.body.email) {
      body('email').isEmail().withMessage('Email is in the wrong format');
    }
    if (req.body.username) {
      body('username').isString().withMessage('username should only be a string');
    }
    if (req.body.role) {
      body('role').isString().withMessage('role should only be a string : member or admin');
    }
    next();
  },
];

export const validateLoginUser = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateCreatePost = [
  body('title')
  .notEmpty()
  .withMessage('Title is required')
  .isString()
  .withMessage('Title must be a string'),
  body('description')
  .notEmpty()
  .withMessage('Description is required')
  .isString()
  .withMessage('Description must be a string'),
  body('categories')
  .isArray({ min: 1 })
  .withMessage('At least one category is required')
  .custom((categories) =>
      categories.every((category: string) => typeof category === 'string')
)
.withMessage('All categories must be strings'),
];

export const validateUpdatePost = [
  (req: Request, res: any, next: (error?: any) => void) => {
    if (req.body.title) {
      body('title').isString().withMessage('title can not be empty and can only a string');
    }
    if (req.body.description) {
      body('description').isString().withMessage('username should only be a string');
    }
    if (req.body.categories) {
      body('categories').isArray({ min: 1 }).withMessage('At least one category is required').custom((categories) => categories.every((category: string) => typeof category === 'string')).withMessage('All categories must be strings');
    }
    next();
  },
];
