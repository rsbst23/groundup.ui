import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const TopBar = () => {
    return (
        <AppBar position="sticky" sx={{ zIndex: 1201 }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/" // Link to the home page
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { textDecoration: "underline" }
                    }}
                >
                    GroundUp Application
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
