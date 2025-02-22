import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { useRoutes } from "react-router-dom";
import routes from "~react-pages";

console.log("Routes Loaded:", routes);

export default function App() {
    const elements = useRoutes(routes);
    return <Layout>{elements}</Layout>;
}
