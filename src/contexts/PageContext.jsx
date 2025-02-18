import { createContext, useContext, useState } from "react";

// Create PageContext
const PageContext = createContext();

// Hook to use the Page Context
export const usePage = () => useContext(PageContext);

// PageProvider Component
export const PageProvider = ({ children }) => {
    const [pageConfig, setPageConfig] = useState({
        title: "",
        actions: null,
    });

    return (
        <PageContext.Provider value={{ pageConfig, setPageConfig }}>
            {children}
        </PageContext.Provider>
    );
};
