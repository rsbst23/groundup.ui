import { Box, Typography, Breadcrumbs, Link, Container, Paper } from "@mui/material";
import { usePage } from "../contexts/PageContext";

const actionBarHeight = 64;

const ActionBar = () => {
    const { pageConfig } = usePage();

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100vw",
                height: `${actionBarHeight}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                backgroundColor: "#ffffff",
                borderRadius: 0,
                boxShadow: 0,
                zIndex: 10,
                position: "fixed",
                top: 64, // Ensures it sits below the TopBar
                left: 0,
            //    borderBottom: "1px solid #ccc",
            }}
        >
            <Box>
                <Typography variant="h6">{pageConfig.title}</Typography>
                <Breadcrumbs>
                    <Link color="inherit">Home</Link>
                    <Typography color="text.primary">{pageConfig.title}</Typography>
                </Breadcrumbs>
            </Box>
            <Box>{pageConfig.actions}</Box>
        </Paper>
    );
};

export default ActionBar;
