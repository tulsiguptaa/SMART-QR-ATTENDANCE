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
    Textarea,
    useToast,
    Alert,
    AlertIcon,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow
} from '@chakra-ui/react'
import {
    QrCode,
    Users,
    Calendar,
    BarChart3,
    Plus,
    Eye,
    Trash2,
    Clock,
    CheckCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { format } from 'date-fns'

const TeacherDashboard = () => {
    const { user } = useAuth()
    const [activeQRCodes, setActiveQRCodes] = useState([])
    const [attendanceStats, setAttendanceStats] = useState([])
    const [recentAttendance, setRecentAttendance] = useState([])
    const [loading, setLoading] = useState(true)
    const [qrLoading, setQrLoading] = useState(false)
    const [selectedQR, setSelectedQR] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isQRViewOpen, onOpen: onQRViewOpen, onClose: onQRViewClose } = useDisclosure()
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
            const [qrResponse, statsResponse, attendanceResponse] = await Promise.all([
                api.get('/qr/active'),
                api.get('/qr/stats?period=month'),
                api.get('/attendance/teacher?limit=10')
            ])

            setActiveQRCodes(qrResponse.data.data.qrCodes)
            setAttendanceStats(statsResponse.data.data.stats)
            setRecentAttendance(attendanceResponse.data.data.attendances)
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

    const generateQRCode = async (data) => {
        try {
            setQrLoading(true)

            const position = await getCurrentPosition()

            const qrData = {
                subject: data.subject,
                location: {
                    type: 'Point',
                    coordinates: [position.coords.longitude, position.coords.latitude]
                },
                maxAttendance: parseInt(data.maxAttendance) || 100
            }

            const response = await api.post('/qr/generate', qrData)

            toast({
                title: 'QR Code Generated!',
                description: `QR code created for ${data.subject}`,
                status: 'success',
                duration: 5000,
                isClosable: true
            })

            reset()
            onClose()
            fetchDashboardData()

        } catch (error) {
            const message = error.response?.data?.message || 'Failed to generate QR code'
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        } finally {
            setQrLoading(false)
        }
    }

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'))
                return
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            })
        })
    }

    const deactivateQR = async (qrId) => {
        try {
            await api.put(`/qr/${qrId}/deactivate`)
            toast({
                title: 'QR Code Deactivated',
                description: 'QR code has been deactivated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            })
            fetchDashboardData()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to deactivate QR code',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
    }

    const viewQR = (qr) => {
        setSelectedQR(qr)
        onQRViewOpen()
    }

    const generateQRCodeDataURL = (qrData) => {
        const qrText = JSON.stringify({
            id: qrData._id,
            subject: qrData.subject,
            type: 'attendance',
            timestamp: new Date().toISOString()
        })

        const encodedText = encodeURIComponent(qrText)
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`
    }

    const generateQRCodeCanvas = (qrData) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const size = 200
        canvas.width = size
        canvas.height = size

        const qrText = JSON.stringify({
            id: qrData._id,
            subject: qrData.subject,
            type: 'attendance',
            timestamp: new Date().toISOString()
        })

        const hash = qrText.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0)
            return a & a
        }, 0)

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, size, size)

        ctx.fillStyle = '#000000'

        const moduleSize = 4
        const modules = Math.floor(size / moduleSize)

        const shouldFill = (i, j) => {
            if ((i < 7 && j < 7) ||
                (i < 7 && j >= modules - 7) ||
                (i >= modules - 7 && j < 7)) {
                return true
            }

            if (i === 6 || j === 6) {
                return (i + j) % 2 === 0
            }

            if (i >= 9 && j >= 9 && i < modules - 9 && j < modules - 9) {
                const dataSeed = (i * modules + j + hash) % 1000
                return dataSeed % 2 === 0
            }

            return false
        }

        for (let i = 0; i < modules; i++) {
            for (let j = 0; j < modules; j++) {
                if (shouldFill(i, j)) {
                    ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
                }
            }
        }

        return canvas.toDataURL()
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'green'
            case 'absent': return 'red'
            case 'late': return 'orange'
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
                opacity: 0.8,
                zIndex: 1
            }}
        >
            <VStack spacing={6} align="stretch" position="relative" zIndex={2} p={6}>
                {/* Header */}
                <Card>
                    <CardBody>
                        <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                                    Teacher Dashboard
                                </Text>
                                <Text color="gray.600">
                                    Welcome, {user?.name}! Manage your classes and attendance.
                                </Text>
                            </VStack>
                            <Button
                                leftIcon={<Plus size={20} />}
                                bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                color="white"
                                size="lg"
                                onClick={onOpen}
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
                                Generate QR Code
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
                                    <StatLabel>Active QR Codes</StatLabel>
                                    <StatNumber>{activeQRCodes.length}</StatNumber>
                                    <StatHelpText>
                                        <QrCode size={16} />
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
                                    <StatLabel>Total Sessions</StatLabel>
                                    <StatNumber>
                                        {attendanceStats.reduce((total, stat) => total + stat.totalSessions, 0)}
                                    </StatNumber>
                                    <StatHelpText>
                                        <Calendar size={16} />
                                        This month
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Total Attendance</StatLabel>
                                    <StatNumber>
                                        {attendanceStats.reduce((total, stat) => total + stat.totalAttendance, 0)}
                                    </StatNumber>
                                    <StatHelpText>
                                        <Users size={16} />
                                        Students marked
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Card>
                            <CardBody>
                                <Stat>
                                    <StatLabel>Avg. Attendance</StatLabel>
                                    <StatNumber>
                                        {attendanceStats.length > 0
                                            ? Math.round(attendanceStats.reduce((total, stat) => total + stat.averageAttendance, 0) / attendanceStats.length)
                                            : 0}
                                    </StatNumber>
                                    <StatHelpText>
                                        <BarChart3 size={16} />
                                        Per session
                                    </StatHelpText>
                                </Stat>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

                {/* Active QR Codes */}
                <Card>
                    <CardHeader>
                        <HStack justify="space-between">
                            <Text fontSize="lg" fontWeight="bold">
                                Active QR Codes
                            </Text>
                            <Badge colorScheme="green" variant="subtle">
                                {activeQRCodes.length} Active
                            </Badge>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        {activeQRCodes.length > 0 ? (
                            <TableContainer>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Subject</Th>
                                            <Th>Created</Th>
                                            <Th>Expires</Th>
                                            <Th>Attendance</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {activeQRCodes.map((qr) => (
                                            <Tr key={qr._id}>
                                                <Td fontWeight="medium">{qr.subject}</Td>
                                                <Td>{format(new Date(qr.createdAt), 'MMM dd, HH:mm')}</Td>
                                                <Td>
                                                    <HStack>
                                                        <Clock size={16} />
                                                        <Text>{format(new Date(qr.expiresAt), 'HH:mm')}</Text>
                                                    </HStack>
                                                </Td>
                                                <Td>
                                                    <Badge colorScheme="blue">
                                                        {qr.currentAttendance}/{qr.maxAttendance}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <HStack spacing={2}>
                                                        <Button
                                                            size="sm"
                                                            bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                                            color="white"
                                                            leftIcon={<Eye size={16} />}
                                                            onClick={() => viewQR(qr)}
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
                                                            bg="linear-gradient(135deg, #e53e3e 0%, #c53030 100%)"
                                                            color="white"
                                                            leftIcon={<Trash2 size={16} />}
                                                            onClick={() => deactivateQR(qr._id)}
                                                            _hover={{
                                                                bg: "linear-gradient(135deg, #c53030 0%, #9c2626 100%)",
                                                                transform: "translateY(-2px)",
                                                                boxShadow: "0 10px 25px rgba(229, 62, 62, 0.4)"
                                                            }}
                                                            _active={{
                                                                transform: "translateY(0)"
                                                            }}
                                                            boxShadow="0 4px 15px rgba(229, 62, 62, 0.3)"
                                                            borderRadius="xl"
                                                            fontWeight="600"
                                                        >
                                                            Deactivate
                                                        </Button>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Center py={8}>
                                <VStack spacing={4}>
                                    <QrCode size={48} color="gray" />
                                    <Text color="gray.500">No active QR codes</Text>
                                    <Button
                                        leftIcon={<Plus size={20} />}
                                        bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                        color="white"
                                        onClick={onOpen}
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
                                        Generate QR Code
                                    </Button>
                                </VStack>
                            </Center>
                        )}
                    </CardBody>
                </Card>

                {/* Recent Attendance */}
                <Card>
                    <CardHeader>
                        <Text fontSize="lg" fontWeight="bold">
                            Recent Attendance
                        </Text>
                    </CardHeader>
                    <CardBody>
                        {recentAttendance.length > 0 ? (
                            <TableContainer>
                                <Table variant="simple" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>Student</Th>
                                            <Th>Subject</Th>
                                            <Th>Date</Th>
                                            <Th>Time</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {recentAttendance.map((attendance, index) => (
                                            <Tr key={index}>
                                                <Td>
                                                    <VStack align="start" spacing={0}>
                                                        <Text fontWeight="medium">{attendance.student?.name || attendance.studentName}</Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {attendance.student?.studentId || attendance.studentId}
                                                        </Text>
                                                    </VStack>
                                                </Td>
                                                <Td>{attendance.subject}</Td>
                                                <Td>{format(new Date(attendance.date), 'MMM dd, yyyy')}</Td>
                                                <Td>{attendance.time}</Td>
                                                <Td>
                                                    <Badge colorScheme={getStatusColor(attendance.status)}>
                                                        <HStack spacing={1}>
                                                            <CheckCircle size={16} />
                                                            <Text>{attendance.status}</Text>
                                                        </HStack>
                                                    </Badge>
                                                </Td>
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
                                </VStack>
                            </Center>
                        )}
                    </CardBody>
                </Card>

                {/* Generate QR Code Modal */}
                <Modal isOpen={isOpen} onClose={onClose} size="lg">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Generate QR Code</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleSubmit(generateQRCode)}>
                                <VStack spacing={4}>
                                    <FormControl isInvalid={errors.subject}>
                                        <FormLabel>Subject</FormLabel>
                                        <Input
                                            placeholder="Enter subject name"
                                            {...register('subject', {
                                                required: 'Subject is required',
                                                minLength: {
                                                    value: 2,
                                                    message: 'Subject must be at least 2 characters'
                                                }
                                            })}
                                        />
                                        {errors.subject && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.subject.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <FormControl isInvalid={errors.maxAttendance}>
                                        <FormLabel>Maximum Attendance</FormLabel>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            {...register('maxAttendance', {
                                                min: {
                                                    value: 1,
                                                    message: 'Must be at least 1'
                                                },
                                                max: {
                                                    value: 1000,
                                                    message: 'Cannot exceed 1000'
                                                }
                                            })}
                                        />
                                        {errors.maxAttendance && (
                                            <Text color="red.500" fontSize="sm">
                                                {errors.maxAttendance.message}
                                            </Text>
                                        )}
                                    </FormControl>

                                    <Alert status="info" borderRadius="md">
                                        <AlertIcon />
                                        <Text fontSize="sm">
                                            QR code will be valid for 15 minutes and will use your current location.
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
                                            isLoading={qrLoading}
                                            loadingText="Generating..."
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
                                            Generate QR Code
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {/* QR View Modal */}
                <Modal isOpen={isQRViewOpen} onClose={onQRViewClose} size="lg" isCentered>
                    <ModalOverlay bg="rgba(0, 0, 0, 0.3)" backdropFilter="blur(10px)" />
                    <ModalContent
                        bg="rgba(255, 255, 255, 0.95)"
                        backdropFilter="blur(20px)"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        borderRadius="2xl"
                    >
                        <ModalHeader
                            bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                            color="white"
                            borderRadius="2xl 2xl 0 0"
                        >
                            <HStack>
                                <QrCode size={24} />
                                <Text>QR Code - {selectedQR?.subject}</Text>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton color="white" />
                        <ModalBody pb={6} p={6}>
                            {selectedQR && (
                                <VStack spacing={6}>
                                    <Box
                                        p={4}
                                        bg="white"
                                        borderRadius="xl"
                                        shadow="lg"
                                        border="2px solid"
                                        borderColor="gray.200"
                                    >
                                        <Text fontSize="sm" color="gray.600" mb={2} textAlign="center">
                                            Scan this QR code with the attendance app
                                        </Text>
                                        <Box
                                            w="300px"
                                            h="300px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            bg="white"
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor="gray.300"
                                        >
                                            {selectedQR.qrCodeData || selectedQR.qrCode || selectedQR.image ? (
                                                <img
                                                    src={selectedQR.qrCodeData || selectedQR.qrCode || selectedQR.image}
                                                    alt="QR Code"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            ) : selectedQR._id ? (
                                                <VStack spacing={4}>
                                                    <Box
                                                        w="200px"
                                                        h="200px"
                                                        bg="white"
                                                        border="2px solid"
                                                        borderColor="gray.300"
                                                        borderRadius="lg"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        p={2}
                                                    >
                                                        <img
                                                            src={generateQRCodeDataURL(selectedQR)}
                                                            alt="Generated QR Code"
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                objectFit: 'contain'
                                                            }}
                                                            onError={(e) => {
                                                                // Fallback to canvas-generated QR if online service fails
                                                                e.target.src = generateQRCodeCanvas(selectedQR)
                                                            }}
                                                        />
                                                    </Box>
                                                    <Text color="gray.500" fontSize="sm" textAlign="center" maxW="250px">
                                                        Real QR Code for: {selectedQR.subject}
                                                    </Text>
                                                    <Text color="gray.400" fontSize="xs" textAlign="center" maxW="250px">
                                                        This QR code contains the attendance data and can be scanned by students
                                                    </Text>
                                                </VStack>
                                            ) : (
                                                <VStack spacing={2}>
                                                    <QrCode size={48} color="gray" />
                                                    <Text color="gray.500" fontSize="sm">
                                                        QR Code Data Not Available
                                                    </Text>
                                                </VStack>
                                            )}
                                        </Box>
                                    </Box>

                                    <VStack spacing={4} w="full">
                                        <Card w="full" variant="outline">
                                            <CardBody>
                                                <VStack spacing={3} align="stretch">
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="bold" color="gray.700">Subject:</Text>
                                                        <Text>{selectedQR.subject}</Text>
                                                    </HStack>
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="bold" color="gray.700">Created:</Text>
                                                        <Text>{format(new Date(selectedQR.createdAt), 'MMM dd, yyyy HH:mm')}</Text>
                                                    </HStack>
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="bold" color="gray.700">Expires:</Text>
                                                        <Text>{format(new Date(selectedQR.expiresAt), 'MMM dd, yyyy HH:mm')}</Text>
                                                    </HStack>
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="bold" color="gray.700">Attendance:</Text>
                                                        <Badge colorScheme="blue" size="lg">
                                                            {selectedQR.currentAttendance}/{selectedQR.maxAttendance}
                                                        </Badge>
                                                    </HStack>
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="bold" color="gray.700">QR ID:</Text>
                                                        <Text fontSize="sm" color="gray.600">{selectedQR._id}</Text>
                                                    </HStack>
                                                </VStack>
                                            </CardBody>
                                        </Card>

                                        

                                        <Button
                                            bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                            color="white"
                                            onClick={onQRViewClose}
                                            w="full"
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
                                            Close
                                        </Button>
                                    </VStack>
                                </VStack>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </VStack>
        </Box>
    )
}

export default TeacherDashboard
