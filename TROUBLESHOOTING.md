# Troubleshooting Guide

## Common Issues and Solutions

### 1. Import Errors

#### Error: `The requested module does not provide an export named 'ViewOffIcon'`

**Solution:**
```bash
# Run the fix script
fix-imports.bat

# Or manually fix by replacing in Login.jsx and Register.jsx:
# Change from:
import { ViewIcon, ViewOffIcon, QrCode } from 'lucide-react'

# To:
import { QrCode } from 'lucide-react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
```

#### Error: `Module not found: Can't resolve 'lucide-react'`

**Solution:**
```bash
cd frontend
npm install lucide-react
```

### 2. MongoDB Connection Issues

#### Error: `MongoDB connection error`

**Solutions:**
1. **Start MongoDB service:**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

2. **Check MongoDB URI in backend/.env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart-qr-attendance
   ```

3. **Install MongoDB if not installed:**
   - Download from: https://www.mongodb.com/try/download/community

### 3. Port Already in Use

#### Error: `Port 3000 is already in use`

**Solutions:**
1. **Kill process using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

2. **Change port in frontend/.env:**
   ```env
   VITE_PORT=3001
   ```

### 4. CORS Errors

#### Error: `Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
Check `FRONTEND_URL` in `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

### 5. QR Code Scanning Issues

#### Camera not working

**Solutions:**
1. **Allow camera permissions** in browser
2. **Use HTTPS** in production (required for camera access)
3. **Check browser compatibility:**
   - Chrome: ✅ Supported
   - Firefox: ✅ Supported
   - Safari: ⚠️ Limited support
   - Edge: ✅ Supported

#### QR Code not detected

**Solutions:**
1. **Ensure good lighting**
2. **Hold camera steady**
3. **Try manual QR input** as fallback
4. **Check QR code is not expired** (15-minute limit)

### 6. Authentication Issues

#### Error: `Token is not valid`

**Solutions:**
1. **Clear browser storage:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Check JWT_SECRET in backend/.env:**
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

3. **Restart backend server**

### 7. Build Issues

#### Error: `Module not found` during build

**Solutions:**
1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check all imports are correct**
3. **Ensure all dependencies are installed**

### 8. Performance Issues

#### Slow loading or high memory usage

**Solutions:**
1. **Close unnecessary browser tabs**
2. **Restart the development servers**
3. **Check system resources**
4. **Clear browser cache**

### 9. Database Issues

#### Error: `Database connection failed`

**Solutions:**
1. **Check MongoDB is running:**
   ```bash
   mongosh
   ```

2. **Verify connection string:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart-qr-attendance
   ```

3. **Check MongoDB logs for errors**

### 10. Environment Variables

#### Error: `Environment variable not found`

**Solutions:**
1. **Create .env files:**
   ```bash
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   ```

2. **Fill in required values:**
   - `JWT_SECRET`: Generate a secure random string
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Your frontend URL

## Getting Help

### 1. Check Logs
- **Backend logs:** Check terminal where backend is running
- **Frontend logs:** Check browser console (F12)
- **MongoDB logs:** Check MongoDB log files

### 2. Common Commands
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run start:dev

# Start only backend
npm run backend:dev

# Start only frontend
npm run frontend:dev

# Build for production
npm run build
```

### 3. Reset Everything
```bash
# Stop all servers (Ctrl+C)
# Then run:
rm -rf node_modules package-lock.json
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json
cd ..
npm run install:all
npm run start:dev
```

### 4. Contact Support
- Check the main README.md for detailed documentation
- Create an issue in the repository
- Check browser console for detailed error messages

## System Requirements

### Minimum Requirements
- **Node.js:** v16 or higher
- **MongoDB:** v4.4 or higher
- **RAM:** 4GB minimum
- **Storage:** 1GB free space

### Recommended Requirements
- **Node.js:** v18 or higher
- **MongoDB:** v6.0 or higher
- **RAM:** 8GB or more
- **Storage:** 2GB free space

### Browser Compatibility
- **Chrome:** 90+ ✅
- **Firefox:** 88+ ✅
- **Safari:** 14+ ⚠️
- **Edge:** 90+ ✅

