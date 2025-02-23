import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MainNav = () => {
    const { t } = useTranslation();

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
                        {t("app_name")}
                    </Typography>

                    {/* Right-aligned buttons */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button component={Link} to="/public/login" color="inherit">
                            {t("login")}
                        </Button>
                        <Button component={Link} to="/application" color="inherit">
                            {t("enter_app")}
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default MainNav;
