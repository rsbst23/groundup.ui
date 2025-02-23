const navigationConfig = {
    home: {
        label: "Dashboard",
        path: "/application",
        sidebar: [
            { label: "Dashboard", path: "/application", highlightOn: ["/application"] }
        ],
    },
    administration: {
        label: "Administration",
        path: "/application/administration",
        sidebar: [
            { label: "Administration", path: "/application/administration", highlightOn: ["/application/administration"] },
            { label: "Inventory Categories", path: "/application/administration/inventorycategories", highlightOn: ["/application/administration/inventorycategories", "/application/administration/inventorycategories/edit"] }
        ],
    },
    inventoryCategoryEdit: {
        label: "Properties",
        path: "/application/administration/inventorycategories/:id/edit",
        sidebar: [
            { label: "Properties", path: "/application/administration/inventorycategories/:id/edit", highlightOn: ["/application/administration/inventorycategories"] }
        ]
    },
    inventoryCategoryAdd: {
        label: "Properties",
        path: "/application/administration/inventorycategories/add",
        sidebar: [
            { label: "Administration", path: "/application/administration", highlightOn: ["/application/administration"] },
            { label: "Inventory Categories", path: "/application/administration/inventorycategories", highlightOn: ["/application/administration/inventorycategories", "/application/administration/inventorycategories/edit"] }
        ],
    }
};

export default navigationConfig;