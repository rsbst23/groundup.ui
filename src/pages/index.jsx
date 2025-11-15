import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h3" gutterBottom>
        {t("welcome_message")} {/* Translated text */}
      </Typography>
      <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
        {t("manage_books")} {/* Translated text */}
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button component={Link} to="/login" variant="contained">
          {t("login")} {/* Translated text */}
        </Button>
        <Button component={Link} to="/application" variant="outlined">
          {t("enter_app")} {/* Translated text */}
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
