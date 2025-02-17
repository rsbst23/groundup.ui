import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const DashboardHome = () => {
    return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h3" gutterBottom>
                Welcome to GroundUp
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Manage your books and more with ease.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button component={Link} to="/application/books" variant="contained">
                    View Books
                </Button>
                <Button component={Link} to="/application/settings" variant="outlined">
                    Settings
                </Button>
            </Box>
        </Box>
    );
};

export default DashboardHome;
