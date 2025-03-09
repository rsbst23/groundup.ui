import { useRoutes } from "react-router-dom";
import generatedRoutes from "~react-pages";
import PublicLayout from "./components/layouts/PublicLayout";
import ApplicationLayout from "./components/layouts/ApplicationLayout";
import PageLayout from "./components/layouts/PageLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Filter routes
const publicRoutes = generatedRoutes.filter(route => !route.path?.startsWith("application"));
const applicationRoutes = generatedRoutes.filter((route) => route.path?.startsWith("application"));

const routesWithLayout = [
    // Public Pages (Wrapped in PublicLayout)
    {
        element: <PublicLayout />,
        children: publicRoutes,
    },

    // Application Pages (Wrapped in ApplicationLayout with ProtectedRoute)
    {
        element: <ApplicationLayout />,
        children: [
            {
                element: <ProtectedRoute />, // Add protection at this level for all app routes
                children: [
                    {
                        element: <PageLayout />,
                        children: applicationRoutes,
                    },
                ],
            },
        ],
    },
];

export default function Router() {
    return useRoutes(routesWithLayout);
}