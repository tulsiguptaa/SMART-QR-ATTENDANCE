# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Setup Environment Variables

#### Backend
Copy `backend/env.example` to `backend/.env` and update the values:
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-qr-attendance
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend
Copy `frontend/env.example` to `frontend/.env`:
```bash
cp frontend/env.example frontend/.env
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Start the Application

#### Windows
```bash
start.bat
```

#### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

#### Manual Start
```bash
npm run start:dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Demo Accounts
- **Admin**: admin@demo.com / password123
- **Teacher**: teacher@demo.com / password123
- **Student**: student@demo.com / password123

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env file

2. **Port Already in Use**
   - Change PORT in backend/.env
   - Kill processes using the ports

3. **CORS Errors**
   - Check FRONTEND_URL in backend/.env
   - Ensure frontend is running on the correct port

4. **QR Code Not Scanning**
   - Allow camera permissions
   - Use HTTPS in production
   - Check browser compatibility

### Getting Help
- Check the main README.md for detailed documentation
- Review the API endpoints documentation
- Check browser console for frontend errors
- Check terminal for backend errors

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
npm run build
```

## Features Overview

### Students
- Scan QR codes to mark attendance
- View attendance dashboard and statistics
- Manage profile and settings

### Teachers
- Generate QR codes for classes
- Monitor real-time attendance
- View class analytics and reports

### Administrators
- Manage users and accounts
- Monitor system performance
- Configure system settings

## Next Steps
1. Customize the application for your needs
2. Add your own branding and styling
3. Configure email notifications
4. Set up production database
5. Deploy to your preferred platform
