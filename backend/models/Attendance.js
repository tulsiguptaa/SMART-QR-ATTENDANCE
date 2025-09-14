const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'present'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    deviceInfo: {
        userAgent: String,
        platform: String,
        browser: String
    },
    qrCode: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

attendanceSchema.index({ student: 1, date: -1 });
attendanceSchema.index({ teacher: 1, date: -1 });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ studentId: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
