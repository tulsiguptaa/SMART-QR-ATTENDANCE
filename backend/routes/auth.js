const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['student', 'teacher', 'admin'])
        .withMessage('Role must be student, teacher, or admin')
], register);

router.post('/login', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
], login);

router.get('/me', auth, getMe);

router.put('/profile', auth, [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Department name too long'),
    body('year')
        .optional()
        .trim()
        .isLength({ max: 10 })
        .withMessage('Year must be less than 10 characters'),
    body('phone')
        .optional()
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone number must be between 10 and 15 characters')
], updateProfile);

router.put('/change-password', auth, [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
], changePassword);

module.exports = router;
