const QRCode = require('qrcode');
const crypto = require('crypto');

const generateQRCode = async (data) => {
    try {
        const qrData = JSON.stringify({
            sessionId: data.sessionId,
            subject: data.subject,
            teacherId: data.teacherId,
            timestamp: Date.now(),
            location: data.location
        });

        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return {
            qrData,
            qrCodeDataURL,
            sessionId: data.sessionId
        };
    } catch (error) {
        throw new Error('Failed to generate QR code');
    }
};

const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
};

const validateQRCode = (qrData) => {
    try {
        const parsed = JSON.parse(qrData);
        const now = Date.now();
        const qrTime = parsed.timestamp;
        const timeDiff = now - qrTime;

        // QR code is valid for 15 minutes
        if (timeDiff > 15 * 60 * 1000) {
            return { valid: false, message: 'QR code has expired' };
        }

        return { valid: true, data: parsed };
    } catch (error) {
        return { valid: false, message: 'Invalid QR code format' };
    }
};

module.exports = {
    generateQRCode,
    generateSessionId,
    validateQRCode
};
