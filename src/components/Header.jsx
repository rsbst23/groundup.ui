import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };

    return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
