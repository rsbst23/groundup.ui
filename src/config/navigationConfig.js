import i18next from "i18next";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

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
            { label: i18next.t("inventory_categories"), path: "/application/administration/inventorycategories", highlightOn: ["/application/administration/inventorycategories", "/application/administration/inventorycategories/edit"], icon: CategoryIcon },
            { label: i18next.t("roles"), path: "/application/administration/roles", highlightOn: ["/application/administration/roles", "/application/administration/roles/edit"], icon: AssignmentIndIcon }
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
