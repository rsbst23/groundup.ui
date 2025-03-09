import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component that intercepts API errors and handles authentication issues
 * This doesn't render anything visible but sets up global error handlers
 */
const ApiErrorInterceptor = () => {
    const { handleUnauthorized } = useAuth();

    useEffect(() => {
        // Global event for API errors from our apiService
        const handleApiError = (event) => {
            const error = event.detail;
            console.log('API error intercepted:', error);

            if (error?.statusCode === 401) {
                handleUnauthorized();
            }
        };

        // Register the event listener
        window.addEventListener('api-error', handleApiError);

        // Clean up
        return () => {
            window.removeEventListener('api-error', handleApiError);
        };
    }, [handleUnauthorized]);

    // This component doesn't render anything
    return null;
};

export default ApiErrorInterceptor;