import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import QRScanner from './pages/QRScanner'
import Attendance from './pages/Attendance'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/scan"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <Layout>
                                <QRScanner />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Teacher Routes */}
                <Route
                    path="/teacher"
                    element={
                        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                            <Layout>
                                <TeacherDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/generate-qr"
                    element={
                        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                            <Layout>
                                <TeacherDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Layout>
                                <AdminDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Common Routes */}
                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                            <Layout>
                                <Attendance />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                            <Layout>
                                <Profile />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                            <Layout>
                                <Settings />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Redirect to appropriate dashboard based on role */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
