# Smart QR Attendance System

A modern, full-stack web application for managing attendance using QR codes. Built with Node.js, Express, MongoDB, and React.

## 🚀 Features

### For Students
- **QR Code Scanning**: Scan QR codes to mark attendance automatically
- **Attendance Dashboard**: View attendance statistics and history
- **Profile Management**: Update personal information and settings
- **Real-time Notifications**: Get notified about attendance updates

### For Teachers
- **QR Code Generation**: Generate QR codes for classes with location tracking
- **Class Management**: Monitor student attendance in real-time
- **Analytics**: View attendance statistics and trends
- **Session Management**: Control QR code validity and attendance limits

### For Administrators
- **User Management**: Create and manage student, teacher, and admin accounts
- **System Overview**: Monitor overall system performance and usage
- **Data Analytics**: Comprehensive attendance reports and insights
- **Settings Management**: Configure system-wide settings

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **QRCode** - QR code generation
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Chakra UI** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Smart-QR-Attendance-App
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-qr-attendance
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Start the Application

#### Option 1: Using the provided script
```bash
# From the root directory
npm run start:dev
```

#### Option 2: Manual start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🔐 Demo Accounts

The application comes with pre-configured demo accounts:

- **Admin**: admin@demo.com / password123
- **Teacher**: teacher@demo.com / password123
- **Student**: student@demo.com / password123

## 📱 Usage Guide

### For Students

1. **Login** with your student credentials
2. **Scan QR Code** using the camera or manual input
3. **View Dashboard** to see attendance statistics
4. **Check Attendance** history and performance

### For Teachers

1. **Login** with teacher credentials
2. **Generate QR Code** for your class
3. **Monitor Attendance** in real-time
4. **View Analytics** and class statistics

### For Administrators

1. **Login** with admin credentials
2. **Manage Users** - create, edit, and manage accounts
3. **Monitor System** - view system-wide statistics
4. **Configure Settings** - adjust system parameters

## 🏗️ Project Structure

```
Smart-QR-Attendance-App/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   └── qrController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   └── QRCode.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   └── qr.js
│   ├── utils/
│   │   └── generateQR.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── QRScanner.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/student` - Get student attendance
- `GET /api/attendance/teacher` - Get teacher attendance
- `GET /api/attendance/stats` - Get attendance statistics
- `GET /api/attendance/recent` - Get recent attendance

### QR Codes
- `POST /api/qr/generate` - Generate QR code
- `GET /api/qr/active` - Get active QR codes
- `PUT /api/qr/:id/deactivate` - Deactivate QR code
- `GET /api/qr/stats` - Get QR code statistics

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin resource sharing protection
- **Input Validation** - Server-side validation for all inputs
- **Location Tracking** - GPS-based attendance verification

## 📊 Features in Detail

### QR Code System
- **Time-based Expiry** - QR codes expire after 15 minutes
- **Location Verification** - GPS coordinates are captured
- **Session Management** - Unique session IDs for each QR code
- **Attendance Limits** - Configurable maximum attendance per session

### Real-time Updates
- **Live Dashboard** - Real-time attendance statistics
- **Instant Notifications** - Toast notifications for all actions
- **Auto-refresh** - Automatic data updates

### Responsive Design
- **Mobile-first** - Optimized for mobile devices
- **Progressive Web App** - Can be installed on mobile devices
- **Cross-browser** - Compatible with all modern browsers

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy the backend directory
4. Configure MongoDB Atlas

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the dist folder
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with learning management systems
- [ ] Biometric authentication
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] Data export functionality

---

**Built with ❤️ for modern education**
"# SMART-QR-ATTENDANCE" 
