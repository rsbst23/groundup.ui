import { useRoutes } from "react-router-dom";
import generatedRoutes from "~react-pages";
import PublicLayout from "./components/layouts/PublicLayout";
import ApplicationLayout from "./components/layouts/ApplicationLayout";
import PageLayout from "./components/layouts/PageLayout";


const publicRoutes = generatedRoutes.filter(route => !route.path?.startsWith("application"));

const applicationRoutes = generatedRoutes.filter((route) => route.path.startsWith("application"));

const routesWithLayout = [
    // Public Pages (Wrapped in PublicLayout)
    {
        element: <PublicLayout />,
        children: publicRoutes,
    },

    // Application Pages (Wrapped in ApplicationLayout)
    {
        element: <ApplicationLayout />,
        children: [
            {
                element: <PageLayout />,
                children: applicationRoutes, // All application pages go here
            },
        ],
    },
];

export default function Router() {
    return useRoutes(routesWithLayout);
}
