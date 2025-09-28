export const testNetworkConnectivity = async () => {
    const results = {
        frontend: window.location.href,
        hostname: window.location.hostname,
        apiUrl: null,
        backendReachable: false,
        error: null
    };

    try {
        const getApiUrl = () => {
            if (import.meta.env.VITE_API_URL) {
                return import.meta.env.VITE_API_URL;
            }
            
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return 'http://localhost:5000/api';
            }
            
            return `http://${window.location.hostname}:5000/api`;
        };

        results.apiUrl = getApiUrl();

        const response = await fetch(`${results.apiUrl.replace('/api', '')}/health`, {
            method: 'GET',
            timeout: 5000
        });

        if (response.ok) {
            results.backendReachable = true;
        } else {
            results.error = Backend `responded with status: ${response.status}`;
        }
    } catch (error) {
        results.error = error.message;
    }

    return results;
};

export const logNetworkInfo = () => {
    const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        currentUrl: window.location.href,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        port: window.location.port
    };

    console.log('Network Info:', info);
    return info;
};