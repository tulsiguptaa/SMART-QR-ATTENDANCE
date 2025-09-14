import React, { useState, useEffect } from 'react'
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
    Avatar,
    Divider,
    Badge,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Alert,
    AlertIcon,
    Spinner,
    Center,
    Grid,
    GridItem
} from '@chakra-ui/react'
import {
    User,
    Mail,
    Phone,
    GraduationCap,
    Calendar,
    Edit,
    Save,
    X,
    Key,
    Shield
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { format } from 'date-fns'

const Profile = () => {
    const { user, updateUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure()
    const toast = useToast()

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        reset: resetProfile,
        formState: { errors: profileErrors }
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            department: user?.department || '',
            year: user?.year || '',
            phone: user?.phone || ''
        }
    })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        formState: { errors: passwordErrors }
    } = useForm()

    useEffect(() => {
        if (user) {
            resetProfile({
                name: user.name || '',
                department: user.department || '',
                year: user.year || '',
                phone: user.phone || ''
            })
        }
    }, [user, resetProfile])

    const updateProfile = async (data) => {
        try {
            setLoading(true)
            const response = await api.put('/auth/profile', data)

            updateUser(response.data.data.user)

            toast({
                title: 'Profile Updated!',
                description: 'Your profile has been updated successfully',
                status: 'success',
                duration: 5000,
                isClosable: true
            })

            onEditClose()
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile'
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        } finally {
            setLoading(false)
        }
    }

    const changePassword = async (data) => {
        try {
            setPasswordLoading(true)
            await api.put('/auth/change-password', data)

            toast({
                title: 'Password Changed!',
                description: 'Your password has been changed successfully',
                status: 'success',
                duration: 5000,
                isClosable: true
            })

            resetPassword()
            onPasswordClose()
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to change password'
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        } finally {
            setPasswordLoading(false)
        }
    }

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'purple'
            case 'teacher': return 'blue'
            case 'student': return 'green'
            default: return 'gray'
        }
    }

    if (!user || !user.name) {
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
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.1,
                    zIndex: 1
                }}
            >
                <Center minH="400px" position="relative" zIndex={2}>
                    <VStack spacing={4}>
                        <Spinner size="xl" color="#667eea" />
                        <Text color="gray.600">Loading profile...</Text>
                        <Text color="gray.500" fontSize="sm">
                            User: {user ? 'Loaded' : 'Not loaded'} | Name: {user?.name || 'No name'}
                        </Text>
                    </VStack>
                </Center>
            </Box>
        )
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
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.1,
                zIndex: 1
            }}
        >
            <VStack spacing={6} align="stretch" position="relative" zIndex={2} p={6}>
                {/* Profile Header */}
                <Card>
                    <CardBody>
                        <HStack spacing={6}>
                            <Avatar size="2xl" name={user.name} />
                            <VStack align="start" spacing={2} flex="1">
                                <HStack spacing={4}>
                                    <Text fontSize="2xl" fontWeight="bold">
                                        {user.name}
                                    </Text>
                                    <Badge colorScheme={getRoleColor(user.role)} size="lg">
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                    </Badge>
                                </HStack>
                                <Text color="gray.600" fontSize="lg">
                                    {user.email}
                                </Text>
                                {user.studentId && (
                                    <Text color="gray.500">
                                        Student ID: {user.studentId}
                                    </Text>
                                )}
                                <HStack spacing={4} mt={2}>
                                    <Button
                                        leftIcon={<Edit size={16} />}
                                        bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                        color="white"
                                        size="sm"
                                        onClick={onEditOpen}
                                        _hover={{
                                            bg: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)"
                                        }}
                                        _active={{
                                            transform: "translateY(0)"
                                        }}
                                        boxShadow="0 4px 15px rgba(102, 126, 234, 0.3)"
                                        borderRadius="xl"
                                        fontWeight="600"
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        leftIcon={<Key size={16} />}
                                        bg="linear-gradient(135deg, #718096 0%, #4a5568 100%)"
                                        color="white"
                                        size="sm"
                                        onClick={onPasswordOpen}
                                        _hover={{
                                            bg: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 10px 25px rgba(113, 128, 150, 0.4)"
                                        }}
                                        _active={{
                                            transform: "translateY(0)"
                                        }}
                                        boxShadow="0 4px 15px rgba(113, 128, 150, 0.3)"
                                        borderRadius="xl"
                                        fontWeight="600"
                                    >
                                        Change Password
                                    </Button>
                                </HStack>
                            </VStack>
                        </HStack>
                    </CardBody>
                </Card>

                {/* Profile Information */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                    <Card>
                        <CardHeader>
                            <HStack>
                                <User size={20} />
                                <Text fontSize="lg" fontWeight="bold">
                                    Personal Information
                                </Text>
                            </HStack>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={4} align="stretch">
                                <HStack justify="space-between">
                                    <Text color="gray.600">Full Name</Text>
                                    <Text fontWeight="medium">{user.name}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text color="gray.600">Email</Text>
                                    <Text fontWeight="medium">{user.email}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text color="gray.600">Phone</Text>
                                    <Text fontWeight="medium">{user.phone || 'Not provided'}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text color="gray.600">Role</Text>
                                    <Badge colorScheme={getRoleColor(user.role)}>
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                    </Badge>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <HStack>
                                <GraduationCap size={20} />
                                <Text fontSize="lg" fontWeight="bold">
                                    Academic Information
                                </Text>
                            </HStack>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={4} align="stretch">
                                <HStack justify="space-between">
                                    <Text color="gray.600">Department</Text>
                                    <Text fontWeight="medium">{user.department || 'Not specified'}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text color="gray.600">Year</Text>
                                    <Text fontWeight="medium">{user.year || 'Not specified'}</Text>
                                </HStack>
                                {user.studentId && (
                                    <HStack justify="space-between">
                                        <Text color="gray.600">Student ID</Text>
                                        <Text fontWeight="medium" fontFamily="mono">
                                            {user.studentId}
                                        </Text>
                                    </HStack>
                                )}
                                <HStack justify="space-between">
                                    <Text color="gray.600">Account Status</Text>
                                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>
                </Grid>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <HStack>
                            <Shield size={20} />
                            <Text fontSize="lg" fontWeight="bold">
                                Account Information
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <HStack justify="space-between">
                                <Text color="gray.600">Member Since</Text>
                                <Text fontWeight="medium">
                                    {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                                        ? format(new Date(user.createdAt), 'MMMM dd, yyyy')
                                        : 'Not available'
                                    }
                                </Text>
                            </HStack>
                            {user.lastLogin && (
                                <HStack justify="space-between">
                                    <Text color="gray.600">Last Login</Text>
                                    <Text fontWeight="medium">
                                        {!isNaN(new Date(user.lastLogin).getTime())
                                            ? format(new Date(user.lastLogin), 'MMMM dd, yyyy HH:mm')
                                            : 'Not available'
                                        }
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Edit Profile Modal */}
                <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Profile</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleProfileSubmit(updateProfile)}>
                                <VStack spacing={4}>
                                    <FormControl isInvalid={profileErrors.name}>
                                        <FormLabel>Full Name</FormLabel>
                                        <Input
                                            placeholder="Enter your full name"
                                            {...registerProfile('name', {
                                                required: 'Name is required',
                                                minLength: {
                                                    value: 2,
                                                    message: 'Name must be at least 2 characters'
                                                }
                                            })}
                                        />
                                        <FormErrorMessage>
                                            {profileErrors.name && profileErrors.name.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={profileErrors.department}>
                                        <FormLabel>Department</FormLabel>
                                        <Input
                                            placeholder="Enter your department"
                                            {...registerProfile('department')}
                                        />
                                        <FormErrorMessage>
                                            {profileErrors.department && profileErrors.department.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={profileErrors.year}>
                                        <FormLabel>Year</FormLabel>
                                        <Input
                                            placeholder="e.g., 2023, 1st Year"
                                            {...registerProfile('year')}
                                        />
                                        <FormErrorMessage>
                                            {profileErrors.year && profileErrors.year.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={profileErrors.phone}>
                                        <FormLabel>Phone Number</FormLabel>
                                        <Input
                                            placeholder="Enter your phone number"
                                            {...registerProfile('phone')}
                                        />
                                        <FormErrorMessage>
                                            {profileErrors.phone && profileErrors.phone.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <HStack spacing={4} w="full">
                                        <Button
                                            type="button"
                                            bg="linear-gradient(135deg, #718096 0%, #4a5568 100%)"
                                            color="white"
                                            onClick={onEditClose}
                                            flex="1"
                                            _hover={{
                                                bg: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 10px 25px rgba(113, 128, 150, 0.4)"
                                            }}
                                            _active={{
                                                transform: "translateY(0)"
                                            }}
                                            boxShadow="0 4px 15px rgba(113, 128, 150, 0.3)"
                                            borderRadius="xl"
                                            fontWeight="600"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                            color="white"
                                            flex="1"
                                            isLoading={loading}
                                            loadingText="Updating..."
                                            _hover={{
                                                bg: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)"
                                            }}
                                            _active={{
                                                transform: "translateY(0)"
                                            }}
                                            boxShadow="0 4px 15px rgba(102, 126, 234, 0.3)"
                                            borderRadius="xl"
                                            fontWeight="600"
                                        >
                                            Update Profile
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Change Password Modal */}
                <Modal isOpen={isPasswordOpen} onClose={onPasswordClose} size="md">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Change Password</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handlePasswordSubmit(changePassword)}>
                                <VStack spacing={4}>
                                    <Alert status="info" borderRadius="md">
                                        <AlertIcon />
                                        <Text fontSize="sm">
                                            You will be logged out after changing your password.
                                        </Text>
                                    </Alert>

                                    <FormControl isInvalid={passwordErrors.currentPassword}>
                                        <FormLabel>Current Password</FormLabel>
                                        <Input
                                            type="password"
                                            placeholder="Enter current password"
                                            {...registerPassword('currentPassword', {
                                                required: 'Current password is required'
                                            })}
                                        />
                                        <FormErrorMessage>
                                            {passwordErrors.currentPassword && passwordErrors.currentPassword.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={passwordErrors.newPassword}>
                                        <FormLabel>New Password</FormLabel>
                                        <Input
                                            type="password"
                                            placeholder="Enter new password"
                                            {...registerPassword('newPassword', {
                                                required: 'New password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters'
                                                }
                                            })}
                                        />
                                        <FormErrorMessage>
                                            {passwordErrors.newPassword && passwordErrors.newPassword.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <HStack spacing={4} w="full">
                                        <Button
                                            type="button"
                                            bg="linear-gradient(135deg, #718096 0%, #4a5568 100%)"
                                            color="white"
                                            onClick={onPasswordClose}
                                            flex="1"
                                            _hover={{
                                                bg: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 10px 25px rgba(113, 128, 150, 0.4)"
                                            }}
                                            _active={{
                                                transform: "translateY(0)"
                                            }}
                                            boxShadow="0 4px 15px rgba(113, 128, 150, 0.3)"
                                            borderRadius="xl"
                                            fontWeight="600"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                            color="white"
                                            flex="1"
                                            isLoading={passwordLoading}
                                            loadingText="Changing..."
                                            _hover={{
                                                bg: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)"
                                            }}
                                            _active={{
                                                transform: "translateY(0)"
                                            }}
                                            boxShadow="0 4px 15px rgba(102, 126, 234, 0.3)"
                                            borderRadius="xl"
                                            fontWeight="600"
                                        >
                                            Change Password
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </VStack>
        </Box>
    )
}

export default Profile
