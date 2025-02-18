import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 240;
const topBarHeight = 64; // TopBar height

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    top: `${topBarHeight}px`, // Start under TopBar
                    height: `calc(100vh - ${topBarHeight}px)`, // Fill rest of viewport
                    backgroundColor: "background.default",
                    borderRight: "1px solid #ddd",
                },
            }}
        >
            <List>
                <ListItemButton component={RouterLink} to="/application">
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/application/books">
                    <ListItemText primary="Books" />
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default Sidebar;
