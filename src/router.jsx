import { useRoutes } from "react-router-dom";
import generatedRoutes from "~react-pages";
import PublicLayout from "./components/layouts/PublicLayout";
import ApplicationLayout from "./components/layouts/ApplicationLayout";

const publicRoutes = generatedRoutes.filter(route => !route.path?.startsWith("application"));

const applicationRoutes = generatedRoutes.filter((route) => route.path.startsWith("application"));

const routesWithLayout = [
    {
        element: <PublicLayout />,
        children: publicRoutes,
    },
    {
        element: <ApplicationLayout />,
        children: applicationRoutes,
    },
];

export default function Router() {
    return useRoutes(routesWithLayout);
}
