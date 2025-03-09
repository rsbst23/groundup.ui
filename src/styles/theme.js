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
                    // Add visible border by default
                    border: "1px solid #2d6953",
                    "&:hover": {
                        backgroundColor: "#1f7456",
                        color: "#ffffff",
                        // Maintain visible border on hover
                        borderColor: "#1a5f45",
                    },
                    // Add focus state styling to fix outline issues
                    "&:focus": {
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(58, 133, 106, 0.3)",
                    },
                    "&.Mui-focusVisible": {
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(58, 133, 106, 0.3)",
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
                    },
                    // Disabled state
                    "&.Mui-disabled": {
                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                        color: "rgba(0, 0, 0, 0.26)",
                        borderColor: "rgba(0, 0, 0, 0.12)",
                    }
                },
                // Add a variant for transparent buttons (like in navigation)
                text: {
                    backgroundColor: "transparent",
                    color: "inherit",
                    boxShadow: "none",
                    // Add visible border even for text variant
                    border: "1px solid rgba(255, 255, 255, 0.23)",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        boxShadow: "none",
                        // Ensure text remains visible on hover
                        color: "#ffffff",
                        borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&:focus": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                    },
                    // Style for cancel buttons with text variant
                    "&.cancel-button": {
                        color: "#3a856a",
                        borderColor: "rgba(58, 133, 106, 0.5)",
                        "&:hover": {
                            backgroundColor: "rgba(58, 133, 106, 0.1)",
                            color: "#3a856a",
                            borderColor: "#3a856a",
                        }
                    }
                },
                // Add specific styling for outlined variant
                outlined: {
                    backgroundColor: "transparent",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#3a856a", // Ensure border is always visible
                    color: "#3a856a",
                    "&:hover": {
                        backgroundColor: "rgba(58, 133, 106, 0.1)",
                        borderColor: "#3a856a",
                        // Ensure text remains visible on hover
                        color: "#3a856a",
                    },
                    "&.cancel-button": {
                        color: "#3a856a",
                        borderColor: "#3a856a",
                        "&:hover": {
                            backgroundColor: "rgba(58, 133, 106, 0.1)",
                            color: "#3a856a",
                            borderColor: "#3a856a",
                        }
                    }
                },
                // Add specific styling for contained variant
                contained: {
                    border: "1px solid #2d6953",
                    "&:hover": {
                        borderColor: "#1a5f45",
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
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            boxShadow: "none",
                            borderColor: "rgba(0, 0, 0, 0.5)",
                            // Ensure text color remains visible on hover
                            color: "inherit",
                        },
                        "&:focus": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            outline: "none",
                            boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(0, 0, 0, 0.5)",
                        },
                    }
                },
                {
                    props: { color: "primary", variant: "contained" },
                    style: {
                        border: "1px solid #2d6953",
                        "&:hover": {
                            borderColor: "#1a5f45",
                        }
                    }
                },
                {
                    props: { color: "secondary", variant: "contained" },
                    style: {
                        border: "1px solid #b36800",
                        "&:hover": {
                            borderColor: "#804a00",
                        }
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