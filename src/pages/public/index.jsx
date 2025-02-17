import { useEffect } from "react";

const Home = () => {
    useEffect(() => {
        console.log(" Home Page Mounted!");
    }, []);

    return <h1>Welcome to GroundUp App</h1>;
};

export default Home;
