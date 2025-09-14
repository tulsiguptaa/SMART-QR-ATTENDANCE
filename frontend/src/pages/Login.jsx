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
    Spinner,
    Image,
    Flex
} from '@chakra-ui/react'
import { QrCode } from 'lucide-react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import mimit from '../assets/mimit.webp';
const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { login, loading, error } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data) => {
        await login(data.email, data.password)
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
                opacity: 0.18,
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

            <Container maxW="md" position="relative" zIndex={3} py={12}>
                <VStack spacing={8}>
                    {/* Header */}
                    <VStack spacing={4} textAlign="center">
                        <Box
                            p={4}
                            bg="rgba(255, 255, 255, 0.9)"
                            borderRadius="full"
                            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                            backdropFilter="blur(10px)"
                        >
                            <QrCode size={48} color="#667eea" />
                        </Box>
                        <Text
                            fontSize="3xl"
                            fontWeight="bold"
                            color="white"
                            textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                        >
                            Smart QR Attendance
                        </Text>
                        <Text
                            color="rgba(255, 255, 255, 0.9)"
                            fontSize="lg"
                            textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                        >
                            Sign in to your account to continue
                        </Text>
                    </VStack>

                    {/* Login Form */}
                    <Card
                        w="full"
                        bg="rgba(255, 255, 255, 0.95)"
                        shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        borderRadius="2xl"
                        backdropFilter="blur(20px)"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                    >
                        <CardBody p={8}>
                            <VStack spacing={6}>
                                {error && (
                                    <Alert status="error" borderRadius="md">
                                        <AlertIcon />
                                        {error}
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                                    <VStack spacing={4}>
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

                                        <FormControl isInvalid={errors.password}>
                                            <FormLabel>Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter your password"
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

                                        <Button
                                            type="submit"
                                            bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                                            color="white"
                                            size="lg"
                                            w="full"
                                            isLoading={loading}
                                            loadingText="Signing in..."
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
                                            Sign In
                                        </Button>
                                    </VStack>
                                </form>

                                <Divider />

                                <HStack spacing={2}>
                                    <Text color="gray.600">Don't have an account?</Text>
                                    <Link
                                        as={RouterLink}
                                        to="/register"
                                        color="#667eea"
                                        fontWeight="600"
                                        _hover={{
                                            color: "#5a6fd8",
                                            textDecoration: "underline"
                                        }}
                                    >
                                        Sign up
                                    </Link>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Demo Accounts */}
                    {/* <Card w="full" bg={cardBg} shadow="sm">
                        <CardBody p={6}>
                            <VStack spacing={4}>
                                <Text fontSize="sm" color="gray.600" textAlign="center">
                                    Demo Accounts
                                </Text>
                                <VStack spacing={2} w="full">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        w="full"
                                        onClick={() => login('admin@demo.com', 'password123')}
                                        isLoading={loading}
                                    >
                                        Admin Demo
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        w="full"
                                        onClick={() => login('teacher@demo.com', 'password123')}
                                        isLoading={loading}
                                    >
                                        Teacher Demo
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        w="full"
                                        onClick={() => login('student@demo.com', 'password123')}
                                        isLoading={loading}
                                    >
                                        Student Demo
                                    </Button>
                                </VStack>
                            </VStack>
                        </CardBody>
                    </Card> */}
                </VStack>
            </Container>
        </Box>

    )
}

export default Login
