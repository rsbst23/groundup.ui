import { createTheme } from "@mui/material/styles";

// Define the theme
const theme = createTheme({
    palette: {
        primary: {
            main: "#3a856a",
        },
        secondary: {
            main: "#ff9800",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
            sidebar: "#ffffff", // Sidebar background
            sidebarHover: "rgba(0, 0, 0, 0.05)", // Hover effect
            sidebarSelected: "rgba(0, 0, 0, 0.1)", // Selected item background
        },
        text: {
            primary: "#333333",
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
                    backgroundColor: "#3a856a",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#1f7456",
                        color: "#ffffff",
                    },
                }
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                        color: "#1f7456",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    width: "100%",
                    boxShadow: 2,
                    height: "64px", // Force fixed height
                    minHeight: "64px",
                    maxHeight: "64px",
                    backgroundColor: "#3a856a",
                    color: "#ffffff",
                    "&:hover": {
                        color: "#ffffff",
                    },
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    height: "64px", // Fix height to avoid expansion
                    minHeight: "64px",
                    maxHeight: "64px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#ffffff",
                    borderRight: "1px solid #ddd",
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    cursor: "pointer",
                    borderRadius: "4px",
                    "&.selected": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        fontWeight: "bold",
                    },
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                },
            },
        },
    },
});

export default theme;
