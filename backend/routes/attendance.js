const express = require('express');
const { body, query } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const {
    markAttendance,
    getStudentAttendance,
    getTeacherAttendance,
    getAttendanceStats,
    getRecentAttendance
} = require('../controllers/attendanceController');

const router = express.Router();

// @route   POST /api/attendance/mark
// @desc    Mark attendance
// @access  Private (Student)
router.post('/mark', auth, authorize('student'), [
    body('qrData')
        .notEmpty()
        .withMessage('QR data is required'),
    body('location.coordinates')
        .isArray({ min: 2, max: 2 })
        .withMessage('Location coordinates must be an array of 2 numbers'),
    body('deviceInfo')
        .optional()
        .isObject()
        .withMessage('Device info must be an object')
], markAttendance);

// @route   GET /api/attendance/student
// @desc    Get student attendance
// @access  Private (Student)
router.get('/student', auth, authorize('student'), [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('subject')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Subject name too long'),
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
], getStudentAttendance);

// @route   GET /api/attendance/teacher
// @desc    Get teacher's class attendance
// @access  Private (Teacher/Admin)
router.get('/teacher', auth, authorize('teacher', 'admin'), [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('subject')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Subject name too long'),
    query('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid date')
], getTeacherAttendance);

// @route   GET /api/attendance/stats
// @desc    Get attendance statistics
// @access  Private
router.get('/stats', auth, [
    query('period')
        .optional()
        .isIn(['week', 'month', 'year'])
        .withMessage('Period must be week, month, or year')
], getAttendanceStats);

// @route   GET /api/attendance/recent
// @desc    Get recent attendance
// @access  Private
router.get('/recent', auth, [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
], getRecentAttendance);

module.exports = router;
