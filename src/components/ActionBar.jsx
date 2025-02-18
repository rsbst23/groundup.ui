import { Box, Typography, Breadcrumbs, Link, Paper } from "@mui/material";

const ActionBar = ({ title, breadcrumb, actions }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                pl: 2,
                pr: 2,
                backgroundColor: "#ffffff",
                borderRadius: 1,
                boxShadow: 1,
                mb: 3, // Ensures spacing between ActionBar and content
            }}
        >
            <Box>
                <Typography variant="h6">{title}</Typography>
                <Breadcrumbs>
                    <Link color="inherit">Home</Link>
                    <Typography color="text.primary">{breadcrumb}</Typography>
                </Breadcrumbs>
            </Box>
            <Box>{actions}</Box>
        </Paper>
    );
};

export default ActionBar;
