import React from 'react'
import {
    Box,
    Flex,
    Spacer,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
    useBreakpointValue,
    VStack,
    HStack,
    Divider
} from '@chakra-ui/react'
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Home,
    User,
    Settings,
    LogOut,
    QrCode,
    BarChart3,
    Users,
    Calendar,
    Scan
} from 'lucide-react'

const Layout = ({ children }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const isMobile = useBreakpointValue({ base: true, md: false })

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard', roles: ['student'] },
        { name: 'Teacher Dashboard', icon: BarChart3, path: '/teacher', roles: ['teacher', 'admin'] },
        { name: 'Admin Panel', icon: Users, path: '/admin', roles: ['admin'] },
        { name: 'QR Scanner', icon: Scan, path: '/scan', roles: ['student'] },
        { name: 'Generate QR', icon: QrCode, path: '/generate-qr', roles: ['teacher', 'admin'] },
        { name: 'Attendance', icon: Calendar, path: '/attendance', roles: ['student', 'teacher', 'admin'] },
        { name: 'Profile', icon: User, path: '/profile', roles: ['student', 'teacher', 'admin'] },
        { name: 'Settings', icon: Settings, path: '/settings', roles: ['student', 'teacher', 'admin'] }
    ]

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.role)
    )

    const handleLogout = () => {
        logout()
    }

    const SidebarContent = () => (
        <VStack spacing={4} align="stretch" p={4}>
            <Box>
                <Text fontSize="xl" fontWeight="bold" color="#667eea">
                    Smart QR Attendance
                </Text>
                <Text fontSize="sm" color="gray.600">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal
                </Text>
            </Box>

            <Divider />

            <VStack spacing={2} align="stretch">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path

                    return (
                        <Button
                            key={item.name}
                            leftIcon={<Icon size={20} />}
                            bg={isActive ? "linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)" : "transparent"}
                            color={isActive ? "white" : "gray.700"}
                            justifyContent="flex-start"
                            onClick={() => {
                                navigate(item.path)
                                onClose()
                            }}
                            size="md"
                            _hover={{
                                bg: isActive ? "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                                transform: "translateY(-2px)",
                                boxShadow: isActive ? "0 10px 25px rgba(102, 126, 234, 0.4)" : "0 4px 15px rgba(102, 126, 234, 0.2)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            boxShadow={isActive ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "none"}
                            borderRadius="xl"
                            fontWeight="600"
                            transition="all 0.2s"
                        >
                            {item.name}
                        </Button>
                    )
                })}
            </VStack>
        </VStack>
    )

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, #764ba2 100%)"
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
            {/* Header */}
            <Box
                bg="rgba(247, 247, 247, 0.83)"
                shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                borderBottom="1px"
                borderColor="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(20px)"
                position="relative"
                zIndex={10}
            >
                <Flex align="center" justify="space-between" p={4}>
                    <HStack spacing={4}>
                        {isMobile && (
                            <IconButton
                                icon={<HamburgerIcon />}
                                variant="ghost"
                                onClick={onOpen}
                                aria-label="Open menu"
                            />
                        )}
                        <Box
                            p={1}
                            bg="rgba(255, 255, 255, 0.9)"
                            borderRadius="full"
                            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                            backdropFilter="blur(10px)"
                        >
                            <QrCode size={32} color="#667eea" />
                        </Box>
                    </HStack>

                    <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)"
                            color="white"
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
                            <HStack spacing={2}>
                                <Avatar size="sm" name={user?.name} />
                                <Text display={{ base: 'none', md: 'block' }}>{user?.name}</Text>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            zIndex={9999}
                            bg="rgba(255, 255, 255, 0.95)"
                            backdropFilter="blur(20px)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            borderRadius="xl"
                        >
                            <MenuItem
                                icon={<User size={16} />}
                                onClick={() => navigate('/profile')}
                                _hover={{ bg: "rgba(102, 126, 234, 0.1)" }}
                                borderRadius="md"
                            >
                                Profile
                            </MenuItem>
                            <MenuItem
                                icon={<Settings size={16} />}
                                onClick={() => navigate('/settings')}
                                _hover={{ bg: "rgba(102, 126, 234, 0.1)" }}
                                borderRadius="md"
                            >
                                Settings
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                                icon={<LogOut size={16} />}
                                onClick={handleLogout}
                                color="red.500"
                                _hover={{ bg: "rgba(229, 62, 62, 0.1)" }}
                                borderRadius="md"
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Box>

            <Flex position="relative" zIndex={2}>
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <Box
                        w="250px"
                        bg="rgba(255, 255, 255, 0.95)"
                        minH="calc(100vh - 73px)"
                        borderRight="1px"
                        borderColor="rgba(255, 255, 255, 0.2)"
                        backdropFilter="blur(20px)"
                        shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    >
                        <SidebarContent />
                    </Box>
                )}

                {/* Mobile Drawer */}
                <Drawer isOpen={isOpen} onClose={onClose} placement="left">
                    <DrawerOverlay bg="rgba(0, 0, 0, 0.3)" backdropFilter="blur(10px)" />
                    <DrawerContent bg="rgba(255, 255, 255, 0.95)" backdropFilter="blur(20px)">
                        <DrawerCloseButton />
                        <DrawerHeader bg="linear-gradient(135deg, #667eea 0%,rgb(118, 75, 162) 100%)" color="white">
                            <Text fontSize="lg" fontWeight="bold">Menu</Text>
                        </DrawerHeader>
                        <DrawerBody p={0}>
                            <SidebarContent />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Main Content */}
                <Box flex="1" p={6} position="relative" zIndex={2}>
                    {children}
                </Box>
            </Flex>
        </Box>
    )
}

export default Layout
