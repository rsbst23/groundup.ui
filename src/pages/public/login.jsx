import { useEffect } from "react";

const Login = () => {
    useEffect(() => {
        console.log(" Login Page Mounted!");
    }, []);

    return <h1>Welcome to Login page</h1>;
};

export default Login;
