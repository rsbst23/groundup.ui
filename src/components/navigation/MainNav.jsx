import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";

const MainNav = () => {
    return (
        <AppBar position="static" sx={{ width: "100%", boxShadow: 2, bgcolor: "primary.main" }}>
            {/* Constrains content inside a full-width AppBar */}
            <Container maxWidth="xl">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Left-aligned logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ textDecoration: "none", color: "inherit" }}
                    >
                        Ground Up App
                    </Typography>

                    {/* Right-aligned buttons */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button component={Link} to="/public/login" color="inherit">
                            Login
                        </Button>
                        <Button component={Link} to="/application" color="inherit">
                            Enter App
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default MainNav;
