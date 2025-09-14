import React, { useState, useEffect } from 'react'
import {
    Box,
    Grid,
    GridItem,
    Card,
    CardBody,
    CardHeader,
    Text,
    VStack,
    HStack,
    Button,
    Spinner,
    Center,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
    Alert,
    AlertIcon,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider
} from '@chakra-ui/react'
import {
    Users,
    UserPlus,
    BarChart3,
    Calendar,
    Settings,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { format } from 'date-fns'

const AdminDashboard = () => {
    const { user } = useAuth()
    const [users, setUsers] = useState([])
    const [attendanceStats, setAttendanceStats] = useState([])
    const [systemStats, setSystemStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [userLoading, setUserLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const mockUsers = [
                {
                    _id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'student',
                    studentId: 'STU2023001',
                    department: 'Computer Science',
                    year: '2023',
                    isActive: true,
                    createdAt: new Date('2023-01-15')
                },
                {
                    _id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: 'teacher',
                    department: 'Mathematics',
                    isActive: true,
                    createdAt: new Date('2023-01-10')
                }
            ]

            setUsers(mockUsers)
            setSystemStats({
                totalUsers: mockUsers.length,
                activeUsers: mockUsers.filter(u => u.isActive).length,
                students: mockUsers.filter(u => u.role === 'student').length,
                teachers: mockUsers.filter(u => u.role === 'teacher').length
            })
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch dashboard data',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        } finally {
            setLoading(false)
        }
    }

    const createUser = async (data) => {
        try {
            setUserLoading(true)
            const newUser = {
                _id: Date.now().toString(),
                ...data,
                isActive: true,
                createdAt: new Date()
            }

            setUsers(prev => [...prev, newUser])

            toast({
                title: 'User Created!',
                description: `${data.role} account created successfully`,
                status: 'success',
                duration: 5000,
                isClosable: true
            })

            reset()
            onClose()

        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create user'
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        } finally {
            setUserLoading(false)
        }
    }

    const toggleUserStatus = async (userId) => {
        try {

            setUsers(prev => prev.map(user =>
                user._id === userId
                    ? { ...user, isActive: !user.isActive }
                    : user
            ))

            toast({
                title: 'User Status Updated',
                description: 'User status has been updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user status',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
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

    if (loading) {
        return (
            <Center minH="400px">
                <Spinner size="xl" color="brand.500" />
            </Center>
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
                {/* Header */}
                <Card>
                    <CardBody>
                        <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                                    Admin Dashboard
                                </Text>
                                <Text color="gray.600">
                                    Manage users, monitor system performance, and oversee attendance.
                                </Text>
                            </VStack>
                            <Button
                                leftIcon={<UserPlus size={20} />}
                                colorScheme="brand"
                                size="lg"
                                onClick={onOpen}
                            >
                                Add User
                            </Button>
                        </HStack>
                    </CardBody>
                </Card>

                {/* Stats Grid */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Total Users</StatLabel>
                                    <StatNumber>{systemStats.totalUsers || 0}</StatNumber>
                                    <StatHelpText>
                                        <Users size={16} />
                                        Registered users
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Active Users</StatLabel>
                                    <StatNumber color="green.500">
                                        {systemStats.activeUsers || 0}
                                    </StatNumber>
                                    <StatHelpText>
                                        <CheckCircle size={16} />
                                        Currently active
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Students</StatLabel>
                                    <StatNumber color="blue.500">
                                        {systemStats.students || 0}
                                    </StatNumber>
                                    <StatHelpText>
                                        <Users size={16} />
                                        Student accounts
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Teachers</StatLabel>
                                    <StatNumber color="purple.500">
                                        {systemStats.teachers || 0}
                                    </StatNumber>
                                    <StatHelpText>
                                        <Users size={16} />
                                        Teacher accounts
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

                {/* Main Content Tabs */}
                <Card>
                    <Tabs>
                        <TabList>
                            <Tab>Users</Tab>
                            <Tab>Attendance Overview</Tab>
                            <Tab>System Settings</Tab>
                        </TabList>

                        <TabPanels>
                            {/* Users Tab */}
                            <TabPanel>
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between">
                                        <Text fontSize="lg" fontWeight="bold">
                                            User Management
                                        </Text>
                                        <Badge colorScheme="blue" variant="subtle">
                                            {users.length} Users
                                        </Badge>
                                    </HStack>

                                    <TableContainer>
                                        <Table variant="simple" size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th>Name</Th>
                                                    <Th>Email</Th>
                                                    <Th>Role</Th>
                                                    <Th>Department</Th>
                                                    <Th>Status</Th>
                                                    <Th>Created</Th>
                                                    <Th>Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {users.map((user) => (
                                                    <Tr key={user._id}>
                                                        <Td>
                                                            <VStack align="start" spacing={0}>
                                                                <Text fontWeight="medium">{user.name}</Text>
                                                                {user.studentId && (
                                                                    <Text fontSize="sm" color="gray.500">
                                                                        {user.studentId}
                                                                    </Text>
                                                                )}
                                                            </VStack>
                                                        </Td>
                                                        <Td>{user.email}</Td>
                                                        <Td>
                                                            <Badge colorScheme={getRoleColor(user.role)}>
                                                                {user.role}
                                                            </Badge>
                                                        </Td>
                                                        <Td>{user.department || '-'}</Td>
                                                        <Td>
                                                            <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                                                                {user.isActive ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </Td>
                                                        <Td>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</Td>
                                                        <Td>
                                                            <HStack spacing={2}>
                                                                <Button
                                                                    size="sm"
                                                                    bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                                                    color="white"
                                                                    leftIcon={<Eye size={16} />}
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
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    bg="linear-gradient(135deg, #38a169 0%, #2f855a 100%)"
                                                                    color="white"
                                                                    leftIcon={<Edit size={16} />}
                                                                    _hover={{
                                                                        bg: "linear-gradient(135deg, #2f855a 0%, #276749 100%)",
                                                                        transform: "translateY(-2px)",
                                                                        boxShadow: "0 10px 25px rgba(56, 161, 105, 0.4)"
                                                                    }}
                                                                    _active={{
                                                                        transform: "translateY(0)"
                                                                    }}
                                                                    boxShadow="0 4px 15px rgba(56, 161, 105, 0.3)"
                                                                    borderRadius="xl"
                                                                    fontWeight="600"
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    bg={user.isActive ? "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)" : "linear-gradient(135deg, #38a169 0%, #2f855a 100%)"}
                                                                    color="white"
                                                                    onClick={() => toggleUserStatus(user._id)}
                                                                    _hover={{
                                                                        bg: user.isActive ? "linear-gradient(135deg, #c53030 0%, #9c2626 100%)" : "linear-gradient(135deg, #2f855a 0%, #276749 100%)",
                                                                        transform: "translateY(-2px)",
                                                                        boxShadow: user.isActive ? "0 10px 25px rgba(229, 62, 62, 0.4)" : "0 10px 25px rgba(56, 161, 105, 0.4)"
                                                                    }}
                                                                    _active={{
                                                                        transform: "translateY(0)"
                                                                    }}
                                                                    boxShadow={user.isActive ? "0 4px 15px rgba(229, 62, 62, 0.3)" : "0 4px 15px rgba(56, 161, 105, 0.3)"}
                                                                    borderRadius="xl"
                                                                    fontWeight="600"
                                                                >
                                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                                </Button>
                                                            </HStack>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </VStack>
                            </TabPanel>

                            {/* Attendance Overview Tab */}
                            <TabPanel>
                                <VStack spacing={4} align="stretch">
                                    <Text fontSize="lg" fontWeight="bold">
                                        Attendance Overview
                                    </Text>
                                    <Center py={8}>
                                        <VStack spacing={4}>
                                            <BarChart3 size={48} color="gray" />
                                            <Text color="gray.500">Attendance analytics coming soon</Text>
                                        </VStack>
                                    </Center>
                                </VStack>
                            </TabPanel>

                            {/* System Settings Tab */}
                            <TabPanel>
                                <VStack spacing={4} align="stretch">
                                    <Text fontSize="lg" fontWeight="bold">
                                        System Settings
                                    </Text>
                                    <Center py={8}>
                                        <VStack spacing={4}>
                                            <Settings size={48} color="gray" />
                                            <Text color="gray.500">System settings coming soon</Text>
                                        </VStack>
                                    </Center>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Card>

                {/* Add User Modal */}
                <Modal isOpen={isOpen} onClose={onClose} size="lg">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add New User</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleSubmit(createUser)}>
                                <VStack spacing={4}>
                                    <FormControl isInvalid={errors.name}>
                                        <FormLabel>Full Name</FormLabel>
                                        <Input
                                            placeholder="Enter full name"
                                            {...register('name', {
                                                required: 'Name is required',
                                                minLength: {
                                                    value: 2,
                                                    message: 'Name must be at least 2 characters'
                                                }
                                            })}
                                        />
                                        {errors.name && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.name.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={errors.email}>
                                        <FormLabel>Email Address</FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^\S+@\S+$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                        />
                                        {errors.email && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.email.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={errors.role}>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            placeholder="Select role"
                                            {...register('role', {
                                                required: 'Role is required'
                                            })}
                                        >
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="admin">Admin</option>
                                        </Select>
                                        {errors.role && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.role.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={errors.department}>
                                        <FormLabel>Department</FormLabel>
                                        <Input
                                            placeholder="Enter department"
                                            {...register('department')}
                                        />
                                        {errors.department && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.department.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={errors.year}>
                                        <FormLabel>Year (for students)</FormLabel>
                                        <Input
                                            placeholder="e.g., 2023, 1st Year"
                                            {...register('year')}
                                        />
                                        {errors.year && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.year.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={errors.password}>
                                        <FormLabel>Temporary Password</FormLabel>
                                        <Input
                                            type="password"
                                            placeholder="Enter temporary password"
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters'
                                                }
                                            })}
                                        />
                                        {errors.password && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.password.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <Alert status="info" borderRadius="md">
                                        <AlertIcon />
                                        <Text fontSize="sm">
                                            User will be required to change password on first login.
                                        </Text>
                                    </Alert>

                                    <HStack spacing={4} w="full">
                                        <Button
                                            type="button"
                                            bg="linear-gradient(135deg, #718096 0%, #4a5568 100%)"
                                            color="white"
                                            onClick={onClose}
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
                                            isLoading={userLoading}
                                            loadingText="Creating..."
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
                                            Create User
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

export default AdminDashboard
