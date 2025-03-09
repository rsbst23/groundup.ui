import "./i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import theme from "./styles/theme";
import "./styles/index.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AuthProvider } from "./contexts/AuthContext";
import ApiErrorInterceptor from "./components/ApiErrorInterceptor"; // Add this import

createRoot(document.getElementById("root")).render(
    /*<StrictMode>*/
    <Provider store={store}>
        <BrowserRouter>
            <AuthProvider>
                <ApiErrorInterceptor /> {/* Add the interceptor here */}
                <ThemeProvider theme={theme}>
                    <CssBaseline /> {/* Reset browser styles */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Router />
                    </LocalizationProvider>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </Provider>
    /*</StrictMode>*/
);