import React, { useState, useRef, useEffect } from 'react'
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Card,
    CardBody,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
    Center,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Badge,
    Divider
} from '@chakra-ui/react'
import { QrCode, Camera, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const QRScanner = () => {
    const { user } = useAuth()
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const startScanning = async () => {
        try {
            setError(null)
            setIsScanning(true)

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })

            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            setError('Camera access denied. Please allow camera access and try again.')
            setIsScanning(false)
        }
    }

    const stopScanning = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setIsScanning(false)
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }

    const handleQRCodeDetected = async (qrData) => {
        try {
            setLoading(true)
            setError(null)

            // Get user's current location
            const position = await getCurrentPosition()

            const attendanceData = {
                qrData,
                location: {
                    type: 'Point',
                    coordinates: [position.coords.longitude, position.coords.latitude]
                },
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    browser: getBrowserName()
                }
            }

            const response = await api.post('/attendance/mark', attendanceData)

            setScanResult({
                success: true,
                data: response.data.data.attendance
            })

            toast({
                title: 'Attendance Marked Successfully!',
                description: `You have been marked present for ${response.data.data.attendance.subject}`,
                status: 'success',
                duration: 5000,
                isClosable: true
            })

            onOpen()
            stopScanning()

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to mark attendance'
            setError(message)

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

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'))
                return
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            })
        })
    }

    const getBrowserName = () => {
        const userAgent = navigator.userAgent
        if (userAgent.includes('Chrome')) return 'Chrome'
        if (userAgent.includes('Firefox')) return 'Firefox'
        if (userAgent.includes('Safari')) return 'Safari'
        if (userAgent.includes('Edge')) return 'Edge'
        return 'Unknown'
    }

    const handleScan = (event) => {
        const qrData = event.target.value
        if (qrData) {
            handleQRCodeDetected(qrData)
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
                // backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
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
                        <VStack spacing={4}>
                            <Box p={4} bg="brand.500" borderRadius="full">
                                <QrCode size={48} color="white" />
                            </Box>
                            <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                                QR Code Scanner
                            </Text>
                            <Text color="gray.600" textAlign="center">
                                Scan the QR code displayed by your teacher to mark your attendance
                            </Text>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Instructions */}
                <Card>
                    <CardBody>
                        <VStack spacing={4} align="start">
                            <Text fontWeight="bold" color="brand.500">
                                How to use:
                            </Text>
                            <VStack spacing={2} align="start">
                                <HStack>
                                    <Text>1.</Text>
                                    <Text>Click "Start Scanning" to activate your camera</Text>
                                </HStack>
                                <HStack>
                                    <Text>2.</Text>
                                    <Text>Point your camera at the QR code displayed by your teacher</Text>
                                </HStack>
                                <HStack>
                                    <Text>3.</Text>
                                    <Text>Wait for the QR code to be detected automatically</Text>
                                </HStack>
                                <HStack>
                                    <Text>4.</Text>
                                    <Text>Your attendance will be marked automatically</Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Scanner */}
                <Card>
                    <CardBody>
                        <VStack spacing={4}>
                            {!isScanning ? (
                                <VStack spacing={4}>
                                    <Box
                                        w="300px"
                                        h="300px"
                                        border="2px dashed"
                                        borderColor="gray.300"
                                        borderRadius="lg"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bg="gray.50"
                                    >
                                        <VStack spacing={2}>
                                            <Camera size={48} color="gray" />
                                            <Text color="gray.500">Camera not active</Text>
                                        </VStack>
                                    </Box>
                                    <Button
                                        leftIcon={<Camera size={20} />}
                                        bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                        color="white"
                                        size="lg"
                                        onClick={startScanning}
                                        isLoading={loading}
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
                                        Start Scanning
                                    </Button>
                                </VStack>
                            ) : (
                                <VStack spacing={4}>
                                    <Box position="relative">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            style={{
                                                width: '300px',
                                                height: '300px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Box
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            transform="translate(-50%, -50%)"
                                            w="200px"
                                            h="200px"
                                            border="2px solid"
                                            borderColor="brand.500"
                                            borderRadius="lg"
                                            pointerEvents="none"
                                        />
                                    </Box>
                                    <HStack spacing={4}>
                                        <Button
                                            leftIcon={<XCircle size={20} />}
                                            bg="linear-gradient(135deg, #e53e3e 0%, #c53030 100%)"
                                            color="white"
                                            onClick={stopScanning}
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
                                            Stop Scanning
                                        </Button>
                                    </HStack>
                                </VStack>
                            )}

                            {/* Manual QR Input */}
                            <Divider />
                            <VStack spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                    Or enter QR code manually:
                                </Text>
                                <input
                                    type="text"
                                    placeholder="Paste QR code data here"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleQRCodeDetected(e.target.value)
                                        }
                                    }}
                                />
                            </VStack>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Error Display */}
                {error && (
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Box>
                    </Alert>
                )}

                {/* Success Modal */}
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <HStack>
                                <CheckCircle size={24} color="green" />
                                <Text>Attendance Marked Successfully!</Text>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            {scanResult && (
                                <VStack spacing={4} align="stretch">
                                    <Card>
                                        <CardBody>
                                            <VStack spacing={2}>
                                                <Text fontWeight="bold">Subject: {scanResult.data.subject}</Text>
                                                <Text>Teacher: {scanResult.data.teacherName}</Text>
                                                <Text>Date: {new Date(scanResult.data.date).toLocaleDateString()}</Text>
                                                <Text>Time: {scanResult.data.time}</Text>
                                                <Badge colorScheme="green" size="lg">
                                                    Present
                                                </Badge>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                    <Button
                                        bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                        color="white"
                                        onClick={onClose}
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
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </VStack>
        </Box>
    )
}

export default QRScanner
