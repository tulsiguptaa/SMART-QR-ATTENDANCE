import axios from 'axios'

// Get API URL from environment or use current host
const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // If running on localhost, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    
    // For network access, use the same host but port 5000
    return `http://${window.location.hostname}:5000/api`;
};

const API_BASE_URL = getApiUrl();

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Log error details for debugging
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            baseURL: error.config?.baseURL
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default api