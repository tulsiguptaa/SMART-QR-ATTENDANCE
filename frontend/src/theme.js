import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: true,
    },
    colors: {
        brand: {
            50: '#e6f3ff',
            100: '#b3d9ff',
            200: '#80bfff',
            300: '#4da6ff',
            400: '#1a8cff',
            500: '#0066cc',
            600: '#0052a3',
            700: '#003d7a',
            800: '#002952',
            900: '#001429',
        },
        gray: {
            50: '#f7fafc',
            100: '#edf2f7',
            200: '#e2e8f0',
            300: '#cbd5e0',
            400: '#a0aec0',
            500: '#718096',
            600: '#4a5568',
            700: '#2d3748',
            800: '#1a202c',
            900: '#171923',
        }
    },
    fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
                color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            },
        }),
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'brand',
            },
            variants: {
                solid: {
                    bg: 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: 'brand.600',
                    },
                },
            },
        },
        Card: {
            baseStyle: (props) => ({
                container: {
                    bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
                    borderRadius: 'xl',
                    boxShadow: 'sm',
                    border: '1px solid',
                    borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
                },
            }),
        },
    },
})

export default theme