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
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    useToast,
    Alert,
    AlertIcon,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Grid,
    GridItem,
    Divider
} from '@chakra-ui/react'
import {
    Search,
    Filter,
    Download,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    BarChart3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { format, subDays, subWeeks, subMonths } from 'date-fns'

const Attendance = () => {
    const { user } = useAuth()
    const [attendances, setAttendances] = useState([])
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        subject: '',
        startDate: '',
        endDate: '',
        period: 'month'
    })
    const [pagination, setPagination] = useState({
        current: 1,
        total: 0,
        pages: 0
    })
    const toast = useToast()

    useEffect(() => {
        fetchAttendanceData()
    }, [filters])

    const fetchAttendanceData = async () => {
        try {
            setLoading(true)

            const endpoint = user?.role === 'student' ? '/attendance/student' : '/attendance/teacher'
            const params = new URLSearchParams({
                page: pagination.current.toString(),
                limit: '20',
                ...filters
            })

            const [attendanceResponse, statsResponse] = await Promise.all([
                api.get(`${endpoint}?${params}`),
                api.get('/attendance/stats?period=' + filters.period)
            ])

            setAttendances(attendanceResponse.data.data.attendances)
            setPagination(attendanceResponse.data.data.pagination)
            setStats(statsResponse.data.data.stats)
        } catch (error) {
            console.error('Error fetching attendance data:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch attendance data',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPagination(prev => ({ ...prev, current: 1 }))
    }

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current: page }))
    }

    const exportAttendance = () => {
        // This would implement CSV export functionality
        toast({
            title: 'Export Feature',
            description: 'CSV export functionality coming soon',
            status: 'info',
            duration: 3000,
            isClosable: true
        })
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

    const getAttendancePercentage = (subjectStats) => {
        if (!subjectStats || subjectStats.totalClasses === 0) return 0
        return Math.round((subjectStats.present / subjectStats.totalClasses) * 100)
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
                // backgroundColor: 'rgb(118, 75, 162)',
                backgroundRepeat: 'no-repeat',
                opacity: 0.5,
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
                                    Attendance Records
                                </Text>
                                <Text color="gray.600">
                                    {user?.role === 'student'
                                        ? 'View your attendance history and statistics'
                                        : 'Monitor class attendance and student records'
                                    }
                                </Text>
                            </VStack>
                            <Button
                                leftIcon={<Download size={20} />}
                                colorScheme="brand"
                                variant="outline"
                                onClick={exportAttendance}
                            >
                                Export
                            </Button>
                        </HStack>
                    </CardBody>
                </Card>

                {/* Stats Overview */}
                {stats && stats.length > 0 && (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                        <GridItem>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Total Classes</StatLabel>
                                        <StatNumber>
                                            {stats.reduce((total, stat) => total + stat.totalClasses, 0)}
                                        </StatNumber>
                                        <StatHelpText>
                                            <Calendar size={16} />
                                            This {filters.period}
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Present</StatLabel>
                                        <StatNumber color="green.500">
                                            {stats.reduce((total, stat) => total + stat.present, 0)}
                                        </StatNumber>
                                        <StatHelpText>
                                            <CheckCircle size={16} />
                                            Attendance
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Absent</StatLabel>
                                        <StatNumber color="red.500">
                                            {stats.reduce((total, stat) => total + stat.absent, 0)}
                                        </StatNumber>
                                        <StatHelpText>
                                            <XCircle size={16} />
                                            Missed
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem>
                            <Card>
                                <CardBody>
                                    <Stat>
                                        <StatLabel>Overall %</StatLabel>
                                        <StatNumber color="brand.500">
                                            {stats.length > 0
                                                ? Math.round(
                                                    stats.reduce((total, stat) => total + getAttendancePercentage(stat), 0) / stats.length
                                                )
                                                : 0}%
                                        </StatNumber>
                                        <StatHelpText>
                                            <BarChart3 size={16} />
                                            Average
                                        </StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </Grid>
                )}

                {/* Filters */}
                <Card>
                    <CardBody>
                        <VStack spacing={4}>
                            <HStack w="full" spacing={4}>
                                <InputGroup flex="1">
                                    <InputLeftElement>
                                        <Search size={16} />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search by subject..."
                                        value={filters.subject}
                                        onChange={(e) => handleFilterChange('subject', e.target.value)}
                                    />
                                </InputGroup>

                                <Select
                                    w="200px"
                                    value={filters.period}
                                    onChange={(e) => handleFilterChange('period', e.target.value)}
                                >
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="year">This Year</option>
                                </Select>
                            </HStack>

                            <HStack w="full" spacing={4}>
                                <Input
                                    type="date"
                                    placeholder="Start Date"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    w="200px"
                                />
                                <Input
                                    type="date"
                                    placeholder="End Date"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    w="200px"
                                />
                                <Button
                                    leftIcon={<Filter size={16} />}
                                    bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                    color="white"
                                    onClick={fetchAttendanceData}
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
                                    Apply Filters
                                </Button>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Subject-wise Stats */}
                {stats && stats.length > 0 && (
                    <Card>
                        <CardHeader>
                            <Text fontSize="lg" fontWeight="bold">
                                Subject-wise Performance
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

                {/* Attendance Table */}
                <Card>
                    <CardHeader>
                        <HStack justify="space-between">
                            <Text fontSize="lg" fontWeight="bold">
                                Attendance Records
                            </Text>
                            <Badge colorScheme="blue" variant="subtle">
                                {pagination.total} Records
                            </Badge>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        {attendances.length > 0 ? (
                            <TableContainer>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            {user?.role === 'teacher' && <Th>Student</Th>}
                                            <Th>Subject</Th>
                                            <Th>Date</Th>
                                            <Th>Time</Th>
                                            <Th>Status</Th>
                                            {user?.role === 'teacher' && <Th>Student ID</Th>}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {attendances.map((attendance, index) => (
                                            <Tr key={index}>
                                                {user?.role === 'teacher' && (
                                                    <Td>
                                                        <VStack align="start" spacing={0}>
                                                            <Text fontWeight="medium">
                                                                {attendance.student?.name || attendance.studentName}
                                                            </Text>
                                                            <Text fontSize="sm" color="gray.500">
                                                                {attendance.student?.email || ''}
                                                            </Text>
                                                        </VStack>
                                                    </Td>
                                                )}
                                                <Td fontWeight="medium">{attendance.subject}</Td>
                                                <Td>{format(new Date(attendance.date), 'MMM dd, yyyy')}</Td>
                                                <Td>{attendance.time}</Td>
                                                <Td>
                                                    <Badge colorScheme={getStatusColor(attendance.status)}>
                                                        <HStack spacing={1}>
                                                            {getStatusIcon(attendance.status)}
                                                            <Text>{attendance.status}</Text>
                                                        </HStack>
                                                    </Badge>
                                                </Td>
                                                {user?.role === 'teacher' && (
                                                    <Td>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {attendance.student?.studentId || attendance.studentId}
                                                        </Text>
                                                    </Td>
                                                )}
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
                                    <Text fontSize="sm" color="gray.400">
                                        Try adjusting your filters or check back later
                                    </Text>
                                </VStack>
                            </Center>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <HStack justify="center" mt={6} spacing={2}>
                                <Button
                                    size="sm"
                                    bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                    color="white"
                                    isDisabled={pagination.current === 1}
                                    onClick={() => handlePageChange(pagination.current - 1)}
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
                                    _disabled={{
                                        bg: "gray.300",
                                        color: "gray.500",
                                        cursor: "not-allowed",
                                        transform: "none",
                                        boxShadow: "none"
                                    }}
                                >
                                    Previous
                                </Button>
                                <Text fontSize="sm" color="gray.600">
                                    Page {pagination.current} of {pagination.pages}
                                </Text>
                                <Button
                                    size="sm"
                                    bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                    color="white"
                                    isDisabled={pagination.current === pagination.pages}
                                    onClick={() => handlePageChange(pagination.current + 1)}
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
                                    _disabled={{
                                        bg: "gray.300",
                                        color: "gray.500",
                                        cursor: "not-allowed",
                                        transform: "none",
                                        boxShadow: "none"
                                    }}
                                >
                                    Next
                                </Button>
                            </HStack>
                        )}
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    )
}

export default Attendance
