import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null
            }
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null
            }
        case 'UPDATE_USER':
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)
    const navigate = useNavigate()

    useEffect(() => {
        if (state.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        } else {
            delete api.defaults.headers.common['Authorization']
        }
    }, [state.token])

    useEffect(() => {
        const checkAuth = async () => {
            if (state.token) {
                try {
                    const response = await api.get('/auth/me')
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user: response.data.data.user,
                            token: state.token
                        }
                    })
                } catch (error) {
                    localStorage.removeItem('token')
                    dispatch({ type: 'LOGOUT' })
                }
            }
        }
        checkAuth()
    }, [])

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            const response = await api.post('/auth/login', { email, password })
            const { user, token } = response.data.data

            localStorage.setItem('token', token)
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token }
            })

            toast.success('Login successful!')

            if (user.role === 'admin') {
                navigate('/admin')
            } else if (user.role === 'teacher') {
                navigate('/teacher')
            } else {
                navigate('/dashboard')
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed'
            dispatch({ type: 'LOGIN_FAILURE', payload: message })
            toast.error(message)
        }
    }

    const register = async (userData) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            console.log('Attempting registration with data:', userData)
            console.log('API Base URL:', api.defaults.baseURL)
            
            const response = await api.post('/auth/register', userData)
            const { user, token } = response.data.data

            localStorage.setItem('token', token)
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token }
            })

            toast.success('Registration successful!')

            if (user.role === 'admin') {
                navigate('/admin')
            } else if (user.role === 'teacher') {
                navigate('/teacher')
            } else {
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Registration error:', error)
            const message = error.response?.data?.message || error.message || 'Registration failed'
            dispatch({ type: 'LOGIN_FAILURE', payload: message })
            toast.error(message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        dispatch({ type: 'LOGOUT' })
        navigate('/')
        toast.success('Logged out successfully!')
    }

    const updateUser = (userData) => {
        dispatch({ type: 'UPDATE_USER', payload: userData })
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    const value = {
        ...state,
        login,
        register,
        logout,
        updateUser,
        clearError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}