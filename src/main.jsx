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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Reset browser styles */}
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
  </StrictMode>
);
