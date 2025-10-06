import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ requiredPermission }) => {
  const { user, loading, isAuthenticated, initialized, hasPermission } =
    useAuth();
  const outletContext = useOutletContext(); // Get the context from parent

  // TEMPORARY: Bypass authentication for development
  // Comment out this return statement when you want to re-enable auth
  return <Outlet context={outletContext} />;

  // Show loading indicator while Keycloak is initializing
  if (loading || !initialized) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific permission is required and user doesn't have it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Pass the context to children
  return <Outlet context={outletContext} />;
};

export default ProtectedRoute;
