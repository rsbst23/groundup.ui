import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const drawerWidth = 240;
const topBarHeight = 64;

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
                    top: `${topBarHeight}px`, // Moves below TopBar
                    height: `calc(100vh - ${topBarHeight}px)`, // Fills remaining height
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
