import i18next from "i18next";

const getNavigationConfig = () => ({
    home: {
        label: i18next.t("dashboard"),
        path: "/application",
        sidebar: [
            { label: i18next.t("dashboard"), path: "/application", highlightOn: ["/application"] }
        ],
    },
    administration: {
        label: i18next.t("administration"),
        path: "/application/administration",
        sidebar: [
            { label: i18next.t("administration"), path: "/application/administration", highlightOn: ["/application/administration"] },
            { label: i18next.t("inventory_categories"), path: "/application/administration/inventorycategories", highlightOn: ["/application/administration/inventorycategories", "/application/administration/inventorycategories/edit"] }
        ],
    },
    inventoryCategoryAdd: {
        label: i18next.t("properties"),
        path: "/application/administration/inventorycategories/add",
        sidebar: [
            { label: i18next.t("administration"), path: "/application/administration", highlightOn: ["/application/administration"] },
            { label: i18next.t("inventory_categories"), path: "/application/administration/inventorycategories", highlightOn: ["/application/administration/inventorycategories", "/application/administration/inventorycategories/edit"] }
        ],
    },
    inventoryCategoryEdit: {
        label: i18next.t("properties"),
        path: "/application/administration/inventorycategories/:id/edit",
        sidebar: [
            { label: i18next.t("properties"), path: "/application/administration/inventorycategories/:id/edit", highlightOn: ["/application/administration/inventorycategories"] }
        ]
    }
});

export default getNavigationConfig;
