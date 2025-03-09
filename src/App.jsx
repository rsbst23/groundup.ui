import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { useRoutes } from "react-router-dom";
import routes from "~react-pages";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
    const elements = useRoutes(routes);

    // Determine if we should show detailed errors based on environment
    const showDetailedErrors = process.env.NODE_ENV !== 'production';

    return (
        <ErrorBoundary showDetailedErrors={showDetailedErrors}>
            <Layout>{elements}</Layout>
        </ErrorBoundary>
    );
}