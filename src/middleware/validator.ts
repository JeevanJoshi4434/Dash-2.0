const {body} = require('express-validator');


export const validateCreateUser = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
    body('id').notEmpty().withMessage('ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('type').isIn(['farmer', 'buyer', 'admin']).withMessage('User type should be farmer, buyer, or admin'),
    body('location').notEmpty().withMessage('Location is required'),
];
