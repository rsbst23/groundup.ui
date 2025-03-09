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
                    // Add focus state styling to fix outline issues
                    "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                    },
                    "&.Mui-focusVisible": {
                        outline: "none",
                        boxShadow: "none",
                    },
                    // Style for cancel buttons
                    "&.cancel-button": {
                        backgroundColor: "transparent",
                        color: "#3a856a",
                        borderColor: "#3a856a",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        "&:hover": {
                            backgroundColor: "rgba(58, 133, 106, 0.1)",
                            color: "#3a856a",
                            borderColor: "#3a856a",
                        }
                    }
                },
                // Add a variant for transparent buttons (like in navigation)
                text: {
                    backgroundColor: "transparent",
                    color: "inherit",
                    boxShadow: "none",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        boxShadow: "none",
                    },
                    "&:focus": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        outline: "none",
                        boxShadow: "none",
                        border: "none",
                    },
                    // Style for cancel buttons with text variant
                    "&.cancel-button": {
                        color: "#3a856a",
                        "&:hover": {
                            backgroundColor: "rgba(58, 133, 106, 0.1)",
                            color: "#3a856a",
                        }
                    }
                },
                // Add specific styling for outlined variant
                outlined: {
                    backgroundColor: "transparent",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    "&.cancel-button": {
                        color: "#3a856a",
                        borderColor: "#3a856a",
                        "&:hover": {
                            backgroundColor: "rgba(58, 133, 106, 0.1)",
                            color: "#3a856a",
                            borderColor: "#3a856a",
                        }
                    }
                }
            },
            variants: [
                {
                    props: { color: "inherit", variant: "text" },
                    style: {
                        backgroundColor: "transparent",
                        color: "inherit",
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            boxShadow: "none",
                        },
                        "&:focus": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            outline: "none",
                            boxShadow: "none",
                            border: "none",
                        },
                    }
                }
            ]
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
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: "4px",
                    minWidth: "150px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)"
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: "rgba(58, 133, 106, 0.1)"
                    },
                    "&.Mui-selected:hover": {
                        backgroundColor: "rgba(58, 133, 106, 0.2)"
                    }
                }
            }
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