import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import getNavigationConfig from "../../config/navigationConfig"; // Use function to get translated config
import { useTranslation } from "react-i18next";

const drawerWidth = 240;
const topBarHeight = 64; // TopBar height

const Sidebar = () => {
    const { t } = useTranslation(); // Localization hook
    const location = useLocation();
    const navigationConfig = getNavigationConfig(t); // Pass t() to get translated labels

    // Sort paths by length (longest first) to ensure the most specific match is selected
    const activeMainSection = Object.values(navigationConfig)
        .sort((a, b) => b.path.length - a.path.length)
        .find((section) => {
            const dynamicPathMatch = section.path.replace(/:\w+/g, "[^/]+"); // Convert :id to regex pattern
            const regex = new RegExp(`^${dynamicPathMatch}`);
            return regex.test(location.pathname);
        });

    const sidebarItems = activeMainSection?.sidebar || [];

    // ** Determine the single active item (deepest match wins) **
    let activeItemPath = null;
    sidebarItems.forEach((item) => {
        item.highlightOn.forEach((path) => {
            const dynamicMatch = path.replace(/:\w+/g, "[^/]+");
            const regex = new RegExp(`^${dynamicMatch}`);
            if (regex.test(location.pathname)) {
                if (!activeItemPath || path.length > activeItemPath.length) {
                    activeItemPath = path; // Select the deepest matching path
                }
            }
        });
    });

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
                {sidebarItems.map((item) => {
                    const isSelected = item.highlightOn.includes(activeItemPath); // Now only one item is selected

                    return (
                        <ListItem
                            key={item.path}
                            component={RouterLink}
                            to={item.path.replace(":id", "39")} // Replace with sample ID
                            className={`sidebar-item ${isSelected ? "selected" : ""}`}
                        >
                            <ListItemText primary={t(item.label)} />
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default Sidebar;
