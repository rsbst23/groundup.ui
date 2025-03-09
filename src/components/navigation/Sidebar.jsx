import { useState } from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Tooltip } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import getNavigationConfig from "../../config/navigationConfig";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { LAYOUT, ANIMATION } from "../../constants/ui";

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [collapsed, setCollapsed] = useState(false);
    const [showCollapseButton, setShowCollapseButton] = useState(false);

    const navigationConfig = getNavigationConfig(t);

    const activeMainSection = Object.values(navigationConfig)
        .sort((a, b) => b.path.length - a.path.length)
        .find((section) => {
            const dynamicPathMatch = section.path.replace(/:\w+/g, "[^/]+");
            const regex = new RegExp(`^${dynamicPathMatch}`);
            return regex.test(location.pathname);
        });

    const sidebarItems = activeMainSection?.sidebar || [];

    let activeItemPath = null;
    sidebarItems.forEach((item) => {
        item.highlightOn.forEach((path) => {
            const dynamicMatch = path.replace(/:\w+/g, "[^/]+");
            const regex = new RegExp(`^${dynamicMatch}`);
            if (regex.test(location.pathname)) {
                if (!activeItemPath || path.length > activeItemPath.length) {
                    activeItemPath = path;
                }
            }
        });
    });

    const handleCollapseToggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={onDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                width: collapsed ? LAYOUT.SIDEBAR_COLLAPSED_WIDTH : LAYOUT.SIDEBAR_WIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: collapsed ? LAYOUT.SIDEBAR_COLLAPSED_WIDTH : LAYOUT.SIDEBAR_WIDTH,
                    boxSizing: "border-box",
                    top: `${LAYOUT.TOP_BAR_HEIGHT}px`,
                    height: `calc(100vh - ${LAYOUT.TOP_BAR_HEIGHT}px)`,
                    backgroundColor: "background.default",
                    borderRight: "1px solid #ddd",
                    overflowX: "hidden",
                    transition: `width ${ANIMATION.TRANSITION_DURATION} ease-in-out`,
                },
            }}
            onMouseEnter={() => setShowCollapseButton(true)}
            onMouseLeave={() => setShowCollapseButton(false)}
        >
            {/* Collapse Button (only on large screens) */}
            {!isMobile && showCollapseButton && (
                <IconButton
                    onClick={handleCollapseToggle}
                    sx={{
                        position: "absolute",
                        right: "-16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        zIndex: 1,
                        transition: `opacity ${ANIMATION.TRANSITION_DURATION} ease-in-out`,
                        "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                >
                    {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            )}

            <List>
                {sidebarItems.map((item) => {
                    const isSelected = item.highlightOn.includes(activeItemPath);
                    const IconComponent = item.icon;

                    return (
                        <Tooltip title={collapsed ? t(item.label) : ""} placement="right" arrow key={item.path}>
                            <ListItem
                                component={RouterLink}
                                to={item.path.replace(":id", "39")}
                                className={`sidebar-item ${isSelected ? "selected" : ""}`}
                                onClick={isMobile ? onDrawerToggle : undefined}
                                sx={{
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    paddingLeft: collapsed ? 2 : 3,
                                }}
                            >
                                {IconComponent && (
                                    <ListItemIcon sx={{ minWidth: collapsed ? "unset" : 40 }}>
                                        <IconComponent fontSize="medium" />
                                    </ListItemIcon>
                                )}
                                {!collapsed && <ListItemText primary={item.label} />}
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default Sidebar;