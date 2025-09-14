import React, { useState } from 'react'
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Card,
    CardBody,
    CardHeader,
    Switch,
    FormControl,
    FormLabel,
    FormHelperText,
    useToast,
    Alert,
    AlertIcon,
    Divider,
    Select,
    Input,
    Textarea,
    Badge,
    useColorModeValue
} from '@chakra-ui/react'
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Palette,
    Save,
    RefreshCw
} from 'lucide-react'

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            attendance: true,
            qrExpiry: true
        },
        privacy: {
            profileVisibility: 'public',
            showAttendance: true,
            showLastLogin: false
        },
        appearance: {
            theme: 'light',
            language: 'en',
            compactMode: false
        },
        security: {
            twoFactor: false,
            sessionTimeout: '30',
            loginAlerts: true
        }
    })
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const cardBg = useColorModeValue('white', 'gray.800')

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }))
    }

    const saveSettings = async () => {
        try {
            setLoading(true)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // In a real app, you would save to backend
            localStorage.setItem('userSettings', JSON.stringify(settings))

            toast({
                title: 'Settings Saved!',
                description: 'Your settings have been saved successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save settings',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        } finally {
            setLoading(false)
        }
    }

    const resetSettings = () => {
        setSettings({
            notifications: {
                email: true,
                push: false,
                attendance: true,
                qrExpiry: true
            },
            privacy: {
                profileVisibility: 'public',
                showAttendance: true,
                showLastLogin: false
            },
            appearance: {
                theme: 'light',
                language: 'en',
                compactMode: false
            },
            security: {
                twoFactor: false,
                sessionTimeout: '30',
                loginAlerts: true
            }
        })

        toast({
            title: 'Settings Reset',
            description: 'Settings have been reset to default values',
            status: 'info',
            duration: 3000,
            isClosable: true
        })
    }

    return (
        <Box
            minH="100vh"
            position="relative"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                // backgroundColor: 'rgb(118, 75, 162)',
                opacity: 0.5,
                zIndex: 1
            }}
        >
            <VStack spacing={6} align="stretch" position="relative" zIndex={2} p={6}>
                {/* Header */}
                <Card bg={cardBg}>
                    <CardBody>
                        <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                                    Settings
                                </Text>
                                <Text color="gray.600">
                                    Customize your experience and manage your preferences
                                </Text>
                            </VStack>
                            <HStack spacing={3}>
                                <Button
                                    leftIcon={<RefreshCw size={16} />}
                                    variant="outline"
                                    onClick={resetSettings}
                                >
                                    Reset
                                </Button>
                                <Button
                                    leftIcon={<Save size={16} />}
                                    colorScheme="brand"
                                    onClick={saveSettings}
                                    isLoading={loading}
                                    loadingText="Saving..."
                                >
                                    Save Changes
                                </Button>
                            </HStack>
                        </HStack>
                    </CardBody>
                </Card>

                {/* Notifications Settings */}
                <Card bg={cardBg}>
                    <CardHeader>
                        <HStack>
                            <Bell size={20} />
                            <Text fontSize="lg" fontWeight="bold">
                                Notifications
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">Email Notifications</FormLabel>
                                    <FormHelperText>Receive notifications via email</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.notifications.email}
                                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">Push Notifications</FormLabel>
                                    <FormHelperText>Receive push notifications in browser</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.notifications.push}
                                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">Attendance Alerts</FormLabel>
                                    <FormHelperText>Get notified about attendance updates</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.notifications.attendance}
                                    onChange={(e) => handleSettingChange('notifications', 'attendance', e.target.checked)}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">QR Code Expiry Alerts</FormLabel>
                                    <FormHelperText>Get notified when QR codes are about to expire</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.notifications.qrExpiry}
                                    onChange={(e) => handleSettingChange('notifications', 'qrExpiry', e.target.checked)}
                                />
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Privacy Settings */}
                <Card bg={cardBg}>
                    <CardHeader>
                        <HStack>
                            <Shield size={20} />
                            <Text fontSize="lg" fontWeight="bold">
                                Privacy & Security
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel>Profile Visibility</FormLabel>
                                <Select
                                    value={settings.privacy.profileVisibility}
                                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                                >
                                    <option value="public">Public</option>
                                    <option value="friends">Friends Only</option>
                                    <option value="private">Private</option>
                                </Select>
                                <FormHelperText>Control who can see your profile information</FormHelperText>
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">Show Attendance Records</FormLabel>
                                    <FormHelperText>Allow others to see your attendance history</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.privacy.showAttendance}
                                    onChange={(e) => handleSettingChange('privacy', 'showAttendance', e.target.checked)}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">Show Last Login</FormLabel>
                                    <FormHelperText>Display when you last logged in</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.privacy.showLastLogin}
                                    onChange={(e) => handleSettingChange('privacy', 'showLastLogin', e.target.checked)}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">Login Alerts</FormLabel>
                                    <FormHelperText>Get notified of new login attempts</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.security.loginAlerts}
                                    onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Session Timeout</FormLabel>
                                <Select
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="120">2 hours</option>
                                    <option value="0">Never</option>
                                </Select>
                                <FormHelperText>Automatically log out after inactivity</FormHelperText>
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Appearance Settings */}
                <Card bg={cardBg}>
                    <CardHeader>
                        <HStack>
                            <Palette size={20} />
                            <Text fontSize="lg" fontWeight="bold">
                                Appearance
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel>Theme</FormLabel>
                                <Select
                                    value={settings.appearance.theme}
                                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto (System)</option>
                                </Select>
                                <FormHelperText>Choose your preferred color scheme</FormHelperText>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Language</FormLabel>
                                <Select
                                    value={settings.appearance.language}
                                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </Select>
                                <FormHelperText>Select your preferred language</FormHelperText>
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel mb="0">Compact Mode</FormLabel>
                                    <FormHelperText>Use smaller spacing and components</FormHelperText>
                                </Box>
                                <Switch
                                    isChecked={settings.appearance.compactMode}
                                    onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                                />
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Advanced Settings */}
                <Card bg={cardBg}>
                    <CardHeader>
                        <HStack>
                            <SettingsIcon size={20} />
                            <Text fontSize="lg" fontWeight="bold">
                                Advanced
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Alert status="info" borderRadius="md">
                                <AlertIcon />
                                <Text fontSize="sm">
                                    Advanced settings are coming soon. These will include data export,
                                    API access, and integration options.
                                </Text>
                            </Alert>

                            <HStack justify="space-between">
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="medium">Data Export</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        Download your attendance data
                                    </Text>
                                </VStack>
                                <Badge colorScheme="yellow" variant="subtle">
                                    Coming Soon
                                </Badge>
                            </HStack>

                            <Divider />

                            <HStack justify="space-between">
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="medium">API Access</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        Generate API keys for integrations
                                    </Text>
                                </VStack>
                                <Badge colorScheme="yellow" variant="subtle">
                                    Coming Soon
                                </Badge>
                            </HStack>

                            <Divider />

                            <HStack justify="space-between">
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="medium">Two-Factor Authentication</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        Add extra security to your account
                                    </Text>
                                </VStack>
                                <Badge colorScheme="yellow" variant="subtle">
                                    Coming Soon
                                </Badge>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    )
}

export default Settings
