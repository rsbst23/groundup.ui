import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

const SelectTenant = () => {
  const { availableTenants, selectTenant, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, or default to /application
  const from = location.state?.from?.pathname || "/application";

  const handleTenantSelect = async (tenantId) => {
    try {
      setLoading(true);
      setError(null);
      await selectTenant(tenantId);
      // Redirect to where user was trying to go, or application home
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Failed to select tenant:", err);
      setError(err.message || "Failed to select tenant. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Container maxWidth="sm">
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
      </Container>
    );
  }

  if (!availableTenants || availableTenants.length === 0) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 2 }}>
          <Alert severity="warning">
            No tenants available for your account. Please contact your
            administrator.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Select Your Organization
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          You have access to multiple organizations. Please select one to
          continue:
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <List>
          {availableTenants.map((tenant) => (
            <ListItem key={tenant.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleTenantSelect(tenant.id)}
                disabled={loading}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemText
                  primary={tenant.name}
                  secondary={tenant.description || "No description available"}
                  primaryTypographyProps={{
                    variant: "h6",
                    fontWeight: "medium",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Setting up your workspace...
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SelectTenant;
