import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";

const MainNav = () => {
    return (
        <AppBar position="static" sx={{ color: "#ffffff", bgcolor: "primary.main" }}>
            <Container maxWidth="xl">
                <Toolbar>
                    {/* Left-aligned logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ textDecoration: "none", color: "#ffffff", fontWeight: "bold", "&:hover": { color: "white", textDecoration: "underline" } }}
                    >
                        Ground Up
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
