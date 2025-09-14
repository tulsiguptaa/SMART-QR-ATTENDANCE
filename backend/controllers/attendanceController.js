const Attendance = require('../models/Attendance');
const QRCode = require('../models/QRCode');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { validateQRCode } = require('../utils/generateQR');


const markAttendance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { qrData, location, deviceInfo } = req.body;
        const studentId = req.user._id;

        const qrValidation = validateQRCode(qrData);
        if (!qrValidation.valid) {
            return res.status(400).json({
                success: false,
                message: qrValidation.message
            });
        }

        const { sessionId, subject, teacherId } = qrValidation.data;

        const qrCode = await QRCode.findOne({
            sessionId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!qrCode) {
            return res.status(400).json({
                success: false,
                message: 'QR code has expired or is invalid'
            });
        }

        const existingAttendance = await Attendance.findOne({
            student: studentId,
            qrCode: qrData
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for this session'
            });
        }

        const teacher = await User.findById(teacherId);
        if (!teacher) {
            return res.status(400).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        const attendance = await Attendance.create({
            student: studentId,
            studentId: req.user.studentId,
            studentName: req.user.name,
            subject,
            teacher: teacherId,
            teacherName: teacher.name,
            time: new Date().toLocaleTimeString(),
            location: {
                type: 'Point',
                coordinates: location.coordinates
            },
            deviceInfo,
            qrCode: qrData,
            status: 'present'
        });

        qrCode.currentAttendance += 1;
        await qrCode.save();

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            data: { attendance }
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, startDate, endDate } = req.query;
        const studentId = req.user._id;

        let query = { student: studentId };

        if (subject) {
            query.subject = new RegExp(subject, 'i');
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const attendances = await Attendance.find(query)
            .populate('teacher', 'name email')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Attendance.countDocuments(query);

        res.json({
            success: true,
            data: {
                attendances,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get student attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getTeacherAttendance = async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, date } = req.query;
        const teacherId = req.user._id;

        let query = { teacher: teacherId };

        if (subject) {
            query.subject = new RegExp(subject, 'i');
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const attendances = await Attendance.find(query)
            .populate('student', 'name studentId department year')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Attendance.countDocuments(query);

        res.json({
            success: true,
            data: {
                attendances,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get teacher attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getAttendanceStats = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const userId = req.user._id;
        const userRole = req.user.role;

        let matchQuery = {};
        let groupBy = {};

        if (userRole === 'student') {
            matchQuery.student = userId;
            groupBy = { subject: '$subject' };
        } else if (userRole === 'teacher') {
            matchQuery.teacher = userId;
            groupBy = { subject: '$subject' };
        }

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

        matchQuery.date = { $gte: startDate };

        const stats = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: groupBy,
                    totalClasses: { $sum: 1 },
                    present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
                    absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
                    late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } }
                }
            },
            {
                $addFields: {
                    attendancePercentage: {
                        $multiply: [
                            { $divide: ['$present', '$totalClasses'] },
                            100
                        ]
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        console.error('Get attendance stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getRecentAttendance = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const userId = req.user._id;
        const userRole = req.user.role;

        let query = {};
        if (userRole === 'student') {
            query.student = userId;
        } else if (userRole === 'teacher') {
            query.teacher = userId;
        }

        const attendances = await Attendance.find(query)
            .populate(userRole === 'student' ? 'teacher' : 'student', 'name email studentId')
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { attendances }
        });
    } catch (error) {
        console.error('Get recent attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    markAttendance,
    getStudentAttendance,
    getTeacherAttendance,
    getAttendanceStats,
    getRecentAttendance
};
