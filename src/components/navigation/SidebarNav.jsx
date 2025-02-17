import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const SidebarNav = () => {
    return (
        <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
            <List>
                <ListItem component={Link} to="/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem component={Link} to="/books">
                    <ListItemText primary="Books" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default SidebarNav;
