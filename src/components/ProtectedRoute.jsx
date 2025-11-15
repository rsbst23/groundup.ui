import {
  Navigate,
  Outlet,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ requiredPermission }) => {
  const {
    user,
    loading,
    isAuthenticated,
    initialized,
    hasPermission,
    tenantRequired,
    tenantSelected,
  } = useAuth();
  const outletContext = useOutletContext(); // Get the context from parent
  const location = useLocation();

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

  // If not authenticated with Keycloak, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If tenant selection is required (multi-tenant user), redirect to tenant selection
  // Pass along where they were trying to go
  if (tenantRequired) {
    return <Navigate to="/select-tenant" state={{ from: location }} replace />;
  }

  // If tenant is not selected yet (custom token not obtained), redirect to tenant selection
  if (!tenantSelected) {
    return <Navigate to="/select-tenant" state={{ from: location }} replace />;
  }

  // If a specific permission is required and user doesn't have it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Pass the context to children
  return <Outlet context={outletContext} />;
};

export default ProtectedRoute;
