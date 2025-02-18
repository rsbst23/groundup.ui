import { createTheme } from "@mui/material/styles";

// Define the theme
const theme = createTheme({
    palette: {
        primary: {
            main: "#408800", // Primary color remains green
        },
        secondary: {
            main: "#ff9800",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
        text: {
            primary: "#333333", // Normal text remains dark
            secondary: "#666666",
        },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
        h1: { fontSize: "2rem", fontWeight: 700 },
        h2: { fontSize: "1.75rem", fontWeight: 600 },
        h3: { fontSize: "1.5rem", fontWeight: 500 },
        body1: { fontSize: "1rem" },
        body2: { fontSize: "0.875rem", color: "text.secondary" },
        button: { textTransform: "none" },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    textTransform: "none",
                    backgroundColor: "#408800", // Default green button
                    color: "#ffffff", // Default text color
                    "&:hover": {
                        backgroundColor: "#2f6600", // Darker green on hover
                        color: "#ffffff", // Ensure text stays white on hover
                    },
                }
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: "none",
                    color: "inherit", // Inherit color (avoids browser default blue links)
                    "&:hover": {
                        color: "#408800",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    width: "100%",
                    boxShadow: 2,
                    backgroundColor: "#408800", // Keep navbar green
                    color: "#ffffff", // Ensure text is white in navbar
                    "&:hover": {
                        color: "#ffffff", // Keeps color unchanged on hover
                    },
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                },
            },
        },
    },
});

export default theme;
