import { Link, AppBar, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const TopBar = () => {
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/" // Link to the home page
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { color: "white", textDecoration: "underline" }
                    }}
                >
                    Ground Up
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
