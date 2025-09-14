import React, { useState, useEffect } from 'react'
import {
    Box,
    Grid,
    GridItem,
    Card,
    CardBody,
    CardHeader,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
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
    useColorModeValue
} from '@chakra-ui/react'
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    QrCode,
    Scan
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { format } from 'date-fns'

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [recentAttendance, setRecentAttendance] = useState([])
    const [loading, setLoading] = useState(true)
    const cardBg = useColorModeValue('white', 'gray.800')

    // Debug logging
    console.log('Dashboard component rendered')
    console.log('User:', user)
    console.log('Loading:', loading)
    console.log('Stats:', stats)
    console.log('Recent Attendance:', recentAttendance)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const [statsResponse, recentResponse] = await Promise.all([
                api.get('/attendance/stats?period=month'),
                api.get('/attendance/recent?limit=5')
            ])

            setStats(statsResponse.data.data?.stats || [])
            setRecentAttendance(recentResponse.data.data?.attendances || [])
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            // Set default values to prevent blank page
            setStats([])
            setRecentAttendance([])
        } finally {
            setLoading(false)
        }
    }

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <Center minH="400px">
                <VStack spacing={4}>
                    <Spinner size="xl" color="brand.500" />
                    <Text color="gray.600">Loading dashboard...</Text>
                </VStack>
            </Center>
        )
    }

    // Show error state if user is not available
    if (!user) {
        return (
            <Center minH="400px">
                <VStack spacing={4}>
                    <Text color="red.500" fontSize="lg">Error: User not found</Text>
                    <Button onClick={() => navigate('/')} colorScheme="brand">
                        Go to Login
                    </Button>
                </VStack>
            </Center>
        )
    }

    const getAttendancePercentage = (subjectStats) => {
        if (!subjectStats || subjectStats.totalClasses === 0) return 0
        return Math.round((subjectStats.present / subjectStats.totalClasses) * 100)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'green'
            case 'absent': return 'red'
            case 'late': return 'orange'
            default: return 'gray'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <CheckCircle size={16} />
            case 'absent': return <XCircle size={16} />
            case 'late': return <Clock size={16} />
            default: return <Clock size={16} />
        }
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
  opacity: 0.5,
                zIndex: 1
            }}
        >
            <VStack spacing={6} align="stretch" position="relative" zIndex={2} p={6}>
                {/* Welcome Header */}
                <Card bg={cardBg}>
                    <CardBody>
                        <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                                    Welcome back, {user?.name}!
                                </Text>
                                <Text color="gray.600">
                                    Here's your attendance overview for this month
                                </Text>
                            </VStack>
                            <Button
                                leftIcon={<QrCode size={20} />}
                                bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                color="white"
                                size="lg"
                                onClick={() => navigate('/scan')}
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
                                Scan QR Code
                            </Button>
                        </HStack>
                    </CardBody>
                </Card>

                {/* Stats Grid */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                    <GridItem>
                        <Card bg={cardBg}>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Total Classes</StatLabel>
                                    <StatNumber>
                                        {stats?.reduce((total, stat) => total + stat.totalClasses, 0) || 0}
                                    </StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="increase" />
                                        This month
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card bg={cardBg}>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Present</StatLabel>
                                    <StatNumber color="green.500">
                                        {stats?.reduce((total, stat) => total + stat.present, 0) || 0}
                                    </StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="increase" />
                                        Attendance
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card bg={cardBg}>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Absent</StatLabel>
                                    <StatNumber color="red.500">
                                        {stats?.reduce((total, stat) => total + stat.absent, 0) || 0}
                                    </StatNumber>
                                    <StatHelpText>
                                        <StatArrow type="decrease" />
                                        Missed classes
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card bg={cardBg}>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Overall %</StatLabel>
                                    <StatNumber color="brand.500">
                                        {stats && stats.length > 0
                                            ? Math.round(
                                                stats.reduce((total, stat) => total + getAttendancePercentage(stat), 0) / stats.length
                                            )
                                            : 0}%
                                    </StatNumber>
                                    <StatHelpText>
                                        <TrendingUp size={16} />
                                        Average
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

                {/* Subject-wise Stats */}
                {stats && stats.length > 0 && (
                    <Card bg={cardBg}>
                        <CardHeader>
                            <Text fontSize="lg" fontWeight="bold">
                                Subject-wise Attendance
                            </Text>
                        </CardHeader>
                        <CardBody>
                            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                                {stats.map((stat, index) => (
                                    <GridItem key={index}>
                                        <Card variant="outline">
                                            <CardBody>
                                                <VStack spacing={2}>
                                                    <Text fontWeight="bold" fontSize="sm">
                                                        {stat._id.subject}
                                                    </Text>
                                                    <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                                                        {getAttendancePercentage(stat)}%
                                                    </Text>
                                                    <HStack spacing={4} fontSize="sm" color="gray.600">
                                                        <Text>{stat.present}/{stat.totalClasses}</Text>
                                                        <Badge colorScheme="green" size="sm">
                                                            Present
                                                        </Badge>
                                                    </HStack>
                                                </VStack>
                                            </CardBody>
                                        </Card>
                                    </GridItem>
                                ))}
                            </Grid>
                        </CardBody>
                    </Card>
                )}

                {/* Recent Attendance */}
                <Card bg={cardBg}>
                    <CardHeader>
                        <HStack justify="space-between">
                            <Text fontSize="lg" fontWeight="bold">
                                Recent Attendance
                            </Text>
                            <Button
                                bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                color="white"
                                size="sm"
                                onClick={() => navigate('/attendance')}
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
                                View All
                            </Button>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        {recentAttendance.length > 0 ? (
                            <TableContainer>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Date</Th>
                                            <Th>Subject</Th>
                                            <Th>Teacher</Th>
                                            <Th>Status</Th>
                                            <Th>Time</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {recentAttendance.map((attendance, index) => (
                                            <Tr key={index}>
                                                <Td>{format(new Date(attendance.date), 'MMM dd, yyyy')}</Td>
                                                <Td>{attendance.subject}</Td>
                                                <Td>{attendance.teacher?.name || attendance.teacherName}</Td>
                                                <Td>
                                                    <Badge colorScheme={getStatusColor(attendance.status)}>
                                                        <HStack spacing={1}>
                                                            {getStatusIcon(attendance.status)}
                                                            <Text>{attendance.status}</Text>
                                                        </HStack>
                                                    </Badge>
                                                </Td>
                                                <Td>{attendance.time}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Center py={8}>
                                <VStack spacing={4}>
                                    <Calendar size={48} color="gray" />
                                    <Text color="gray.500">No attendance records found</Text>
                                    <Button
                                        leftIcon={<Scan size={20} />}
                                        bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                        color="white"
                                        onClick={() => navigate('/scan')}
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
                                        Mark Attendance
                                    </Button>
                                </VStack>
                            </Center>
                        )}
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    )
}

export default Dashboard