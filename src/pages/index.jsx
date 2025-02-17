import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const Home = () => {
  return (
    <Container
      sx={{
        textAlign: "center",
        paddingTop: "2rem",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the GroundUp Library 📚
      </Typography>
      <Typography variant="body1" paragraph>
        Manage your books easily with our CRUD system.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/books"
        sx={{ marginTop: "1rem" }}
      >
        View Books
      </Button>
    </Container>
  );
};

export default Home;
