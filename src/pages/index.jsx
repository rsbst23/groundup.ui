import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const Home = () => {
    return (
        <Container
            maxWidth="xl"
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}
        >
            <Typography variant="h3" gutterBottom>
                Welcome to the GroundUp App
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
                Manage your books and more with ease.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button component={Link} to="/login" variant="contained">
                    Login
                </Button>
                <Button component={Link} to="/application" variant="outlined">
                    Enter App
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
