import React, { useState } from 'react'
import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    Divider,
    Link,
    useColorModeValue,
    Card,
    CardBody,
    Alert,
    AlertIcon,
    Select,
    Image,
    Flex,
    Grid,
    GridItem,
    Heading
} from '@chakra-ui/react'
import { QrCode } from 'lucide-react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import mimit from '../assets/mimit.webp';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { register: registerUser, loading, error } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm()

    const password = watch('password')

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data
        await registerUser(userData)
    }

    const cardBg = useColorModeValue('white', 'gray.800')

    return (
        <Box
            minH="100vh"
            position="relative"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundSize: 'cover',
                backgroundImage: `url(${mimit})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.1,
                zIndex: 1
            }}
        >
            {/* Overlay */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0, 0, 0, 0.3)"
                zIndex={2}
            />

            <Container maxW="7xl" position="relative" zIndex={3} h="100vh" py={8}>
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} h="full">
                    {/* Left Side - Branding & Visual */}
                    <GridItem display={{ base: 'none', lg: 'flex' }}>
                        <VStack
                            spacing={8}
                            justify="center"
                            align="center"
                            h="full"
                            textAlign="center"
                            px={8}
                        >
                            <VStack spacing={6}>
                                <Box
                                    p={6}
                                    bg="rgba(255, 255, 255, 0.9)"
                                    borderRadius="full"
                                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                                    backdropFilter="blur(10px)"
                                >
                                    <QrCode size={64} color="#667eea" />
                                </Box>

                                <VStack spacing={4}>
                                    <Heading
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        color="white"
                                        textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                                    >
                                        Smart QR Attendance
                                    </Heading>
                                    <Text
                                        color="rgba(255, 255, 255, 0.9)"
                                        fontSize="xl"
                                        textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                                        maxW="400px"
                                    >
                                        Join thousands of students and teachers using our innovative QR-based attendance system
                                    </Text>
                                </VStack>

                                <VStack spacing={4} align="stretch" w="full" maxW="400px">
                                    <HStack spacing={4} p={4} bg="rgba(255, 255, 255, 0.1)" borderRadius="lg" backdropFilter="blur(10px)">
                                        <Box p={2} bg="rgba(255, 255, 255, 0.2)" borderRadius="md">
                                            <QrCode size={20} color="white" />
                                        </Box>
                                        <VStack align="start" spacing={1}>
                                            <Text color="white" fontWeight="600" fontSize="sm">Quick & Easy</Text>
                                            <Text color="rgba(255, 255, 255, 0.8)" fontSize="xs">Scan QR codes for instant attendance</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack spacing={4} p={4} bg="rgba(255, 255, 255, 0.1)" borderRadius="lg" backdropFilter="blur(10px)">
                                        <Box p={2} bg="rgba(255, 255, 255, 0.2)" borderRadius="md">
                                            <QrCode size={20} color="white" />
                                        </Box>
                                        <VStack align="start" spacing={1}>
                                            <Text color="white" fontWeight="600" fontSize="sm">Real-time Tracking</Text>
                                            <Text color="rgba(255, 255, 255, 0.8)" fontSize="xs">Monitor attendance in real-time</Text>
                                        </VStack>
                                    </HStack>

                                    <HStack spacing={4} p={4} bg="rgba(255, 255, 255, 0.1)" borderRadius="lg" backdropFilter="blur(10px)">
                                        <Box p={2} bg="rgba(255, 255, 255, 0.2)" borderRadius="md">
                                            <QrCode size={20} color="white" />
                                        </Box>
                                        <VStack align="start" spacing={1}>
                                            <Text color="white" fontWeight="600" fontSize="sm">Secure & Reliable</Text>
                                            <Text color="rgba(255, 255, 255, 0.8)" fontSize="xs">Enterprise-grade security</Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </VStack>
                    </GridItem>

                    {/* Right Side - Registration Form */}
                    <GridItem>
                        <VStack
                            justify="center"
                            h="full"
                            px={{ base: 4, md: 8 }}
                        >
                            <Card
                                w="full"
                                maxW="500px"
                                bg="rgba(255, 255, 255, 0.95)"
                                shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                borderRadius="2xl"
                                backdropFilter="blur(20px)"
                                border="1px solid rgba(255, 255, 255, 0.2)"
                            >
                                <CardBody p={8}>
                                    <VStack spacing={6}>
                                        {/* Mobile Header */}
                                        <VStack spacing={4} textAlign="center" display={{ base: 'flex', lg: 'none' }}>
                                            <Box
                                                p={4}
                                                bg="rgba(102, 126, 234, 0.1)"
                                                borderRadius="full"
                                                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                                                backdropFilter="blur(10px)"
                                            >
                                                <QrCode size={48} color="#667eea" />
                                            </Box>
                                            <Heading
                                                fontSize="2xl"
                                                fontWeight="bold"
                                                color="gray.700"
                                            >
                                                Create Account
                                            </Heading>
                                            <Text color="gray.600">
                                                Join Smart QR Attendance today
                                            </Text>
                                        </VStack>

                                        {/* Desktop Header */}
                                        <VStack spacing={2} textAlign="center" display={{ base: 'none', lg: 'flex' }}>
                                            <Heading
                                                fontSize="2xl"
                                                fontWeight="bold"
                                                color="gray.700"
                                            >
                                                Create Account
                                            </Heading>
                                            <Text color="gray.600">
                                                Fill in your details to get started
                                            </Text>
                                        </VStack>

                                        {error && (
                                            <Alert status="error" borderRadius="md">
                                                <AlertIcon />
                                                {error}
                                            </Alert>
                                        )}

                                        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                                            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                                                <GridItem colSpan={{ base: 1, md: 2 }}>
                                                    <FormControl isInvalid={errors.name}>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter your full name"
                                                            {...register('name', {
                                                                required: 'Name is required',
                                                                minLength: {
                                                                    value: 2,
                                                                    message: 'Name must be at least 2 characters'
                                                                }
                                                            })}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.name && errors.name.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem colSpan={{ base: 1, md: 2 }}>
                                                    <FormControl isInvalid={errors.email}>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <Input
                                                            type="email"
                                                            placeholder="Enter your email"
                                                            {...register('email', {
                                                                required: 'Email is required',
                                                                pattern: {
                                                                    value: /^\S+@\S+$/i,
                                                                    message: 'Invalid email address'
                                                                }
                                                            })}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.email && errors.email.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem>
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
                                                        <FormErrorMessage>
                                                            {errors.role && errors.role.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem>
                                                    <FormControl isInvalid={errors.department}>
                                                        <FormLabel>Department</FormLabel>
                                                        <Input
                                                            type="text"
                                                            placeholder="Department"
                                                            {...register('department')}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.department && errors.department.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem>
                                                    <FormControl isInvalid={errors.year}>
                                                        <FormLabel>Year</FormLabel>
                                                        <Input
                                                            type="text"
                                                            placeholder="e.g., 2023, 1st Year"
                                                            {...register('year')}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.year && errors.year.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem>
                                                    <FormControl isInvalid={errors.phone}>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <Input
                                                            type="tel"
                                                            placeholder="Phone number"
                                                            {...register('phone')}
                                                        />
                                                        <FormErrorMessage>
                                                            {errors.phone && errors.phone.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem>
                                                    <FormControl isInvalid={errors.password}>
                                                        <FormLabel>Password</FormLabel>
                                                        <InputGroup>
                                                            <Input
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="Password"
                                                                {...register('password', {
                                                                    required: 'Password is required',
                                                                    minLength: {
                                                                        value: 6,
                                                                        message: 'Password must be at least 6 characters'
                                                                    }
                                                                })}
                                                            />
                                                            <InputRightElement>
                                                                <IconButton
                                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                />
                                                            </InputRightElement>
                                                        </InputGroup>
                                                        <FormErrorMessage>
                                                            {errors.password && errors.password.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem>
                                                    <FormControl isInvalid={errors.confirmPassword}>
                                                        <FormLabel>Confirm Password</FormLabel>
                                                        <InputGroup>
                                                            <Input
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                placeholder="Confirm password"
                                                                {...register('confirmPassword', {
                                                                    required: 'Please confirm your password',
                                                                    validate: value =>
                                                                        value === password || 'Passwords do not match'
                                                                })}
                                                            />
                                                            <InputRightElement>
                                                                <IconButton
                                                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                />
                                                            </InputRightElement>
                                                        </InputGroup>
                                                        <FormErrorMessage>
                                                            {errors.confirmPassword && errors.confirmPassword.message}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>
                                            </Grid>

                                            <Button
                                                type="submit"
                                                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                color="white"
                                                size="lg"
                                                w="full"
                                                mt={6}
                                                isLoading={loading}
                                                loadingText="Creating account..."
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
                                                Create Account
                                            </Button>
                                        </form>

                                        <Divider />

                                        <HStack spacing={2}>
                                            <Text color="gray.600">Already have an account?</Text>
                                            <Link
                                                as={RouterLink}
                                                to="/"
                                                color="#667eea"
                                                fontWeight="600"
                                                _hover={{
                                                    color: "#5a6fd8",
                                                    textDecoration: "underline"
                                                }}
                                            >
                                                Sign in
                                            </Link>
                                        </HStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </VStack>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    )
}

export default Register
