const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    qrData: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    },
    isActive: {
        type: Boolean,
        default: true
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
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    maxAttendance: {
        type: Number,
        default: 100
    },
    currentAttendance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better query performance
qrCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
qrCodeSchema.index({ teacher: 1, isActive: 1 });
qrCodeSchema.index({ qrData: 1 });

module.exports = mongoose.model('QRCode', qrCodeSchema);
