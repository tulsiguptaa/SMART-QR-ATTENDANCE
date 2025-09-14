const express = require('express');
const { body, query } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const {
    generateQR,
    getActiveQRCodes,
    deactivateQR,
    getQRStats
} = require('../controllers/qrController');

const router = express.Router();

router.post('/generate', auth, authorize('teacher', 'admin'), [
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ max: 100 })
        .withMessage('Subject name too long'),
    body('location.coordinates')
        .isArray({ min: 2, max: 2 })
        .withMessage('Location coordinates must be an array of 2 numbers'),
    body('maxAttendance')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Max attendance must be between 1 and 1000')
], generateQR);

router.get('/active', auth, authorize('teacher', 'admin'), getActiveQRCodes);

router.put('/:id/deactivate', auth, authorize('teacher', 'admin'), deactivateQR);

router.get('/stats', auth, authorize('teacher', 'admin'), [
    query('period')
        .optional()
        .isIn(['week', 'month', 'year'])
        .withMessage('Period must be week, month, or year')
], getQRStats);

module.exports = router;
