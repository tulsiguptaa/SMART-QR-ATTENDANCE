const QRCode = require('../models/QRCode');
const { generateQRCode, generateSessionId } = require('../utils/generateQR');
const { validationResult } = require('express-validator');

// @desc    Generate QR code for attendance
// @route   POST /api/qr/generate
// @access  Private (Teacher/Admin only)
const generateQR = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { subject, location, maxAttendance = 100 } = req.body;
        const teacherId = req.user._id;

        // Generate session ID
        const sessionId = generateSessionId();

        // Generate QR code data
        const qrData = {
            sessionId,
            subject,
            teacherId,
            location: {
                type: 'Point',
                coordinates: location.coordinates
            }
        };

        const { qrCodeDataURL } = await generateQRCode(qrData);

        // Save QR code to database
        const qrCode = await QRCode.create({
            teacher: teacherId,
            subject,
            qrData: JSON.stringify(qrData),
            sessionId,
            location: {
                type: 'Point',
                coordinates: location.coordinates
            },
            maxAttendance
        });

        res.status(201).json({
            success: true,
            message: 'QR code generated successfully',
            data: {
                qrCode: {
                    id: qrCode._id,
                    sessionId: qrCode.sessionId,
                    subject: qrCode.subject,
                    qrCodeDataURL,
                    expiresAt: qrCode.expiresAt,
                    maxAttendance: qrCode.maxAttendance
                }
            }
        });
    } catch (error) {
        console.error('Generate QR error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get active QR codes for teacher
// @route   GET /api/qr/active
// @access  Private (Teacher/Admin only)
const getActiveQRCodes = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const qrCodes = await QRCode.find({
            teacher: teacherId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { qrCodes }
        });
    } catch (error) {
        console.error('Get active QR codes error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Deactivate QR code
// @route   PUT /api/qr/:id/deactivate
// @access  Private (Teacher/Admin only)
const deactivateQR = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user._id;

        const qrCode = await QRCode.findOneAndUpdate(
            { _id: id, teacher: teacherId },
            { isActive: false },
            { new: true }
        );

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found'
            });
        }

        res.json({
            success: true,
            message: 'QR code deactivated successfully',
            data: { qrCode }
        });
    } catch (error) {
        console.error('Deactivate QR error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get QR code statistics
// @route   GET /api/qr/stats
// @access  Private (Teacher/Admin only)
const getQRStats = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { period = 'month' } = req.query;

        // Date filtering based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        const stats = await QRCode.aggregate([
            {
                $match: {
                    teacher: teacherId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { subject: '$subject' },
                    totalSessions: { $sum: 1 },
                    totalAttendance: { $sum: '$currentAttendance' },
                    averageAttendance: { $avg: '$currentAttendance' }
                }
            }
        ]);

        res.json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        console.error('Get QR stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    generateQR,
    getActiveQRCodes,
    deactivateQR,
    getQRStats
};
