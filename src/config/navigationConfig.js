import i18next from "i18next";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityIcon from "@mui/icons-material/Security";

const getNavigationConfig = () => ({
    home: {
        label: i18next.t("dashboard"),
        path: "/application",
        sidebar: [
            { label: i18next.t("dashboard"), path: "/application", highlightOn: ["/application"], icon: DashboardIcon }
        ],
    },
    administration: {
        label: i18next.t("administration"),
        path: "/application/administration",
        sidebar: [
            { label: i18next.t("administration"), path: "/application/administration", highlightOn: ["/application/administration"], icon: AdminPanelSettingsIcon },
            { label: i18next.t("security"), path: "/application/administration/security", highlightOn: ["/application/administration/security"], icon: SecurityIcon },
            { label: i18next.t("inventory_categories"), path: "/application/administration/inventorycategories", highlightOn: ["/application/administration/inventorycategories", "/application/administration/inventorycategories/edit"], icon: CategoryIcon }
        ],
    },
    inventoryCategoryAdd: {
        label: i18next.t("properties"),
        path: "/application/administration/inventorycategories/add",
        sidebar: [
            { label: i18next.t("administration"), path: "/application/administration", highlightOn: ["/application/administration"], icon: AdminPanelSettingsIcon },
            { label: i18next.t("inventory_categories"), path: "/application/administration/inventorycategories", highlightOn: ["/application/administration/inventorycategories", "/application/administration/inventorycategories/edit"], icon: CategoryIcon }
        ],
    },
    inventoryCategoryEdit: {
        label: i18next.t("properties"),
        path: "/application/administration/inventorycategories/:id/edit",
        sidebar: [
            { label: i18next.t("properties"), path: "/application/administration/inventorycategories/:id/edit", highlightOn: ["/application/administration/inventorycategories"], icon: EditIcon }
        ]
    }
});

export default getNavigationConfig;
