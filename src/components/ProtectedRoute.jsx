import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ requiredPermission }) => {
    const { user, loading, hasPermission } = useAuth();
    const outletContext = useOutletContext(); // Get the context from parent

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Pass the context to children
    return <Outlet context={outletContext} />;
};

export default ProtectedRoute;