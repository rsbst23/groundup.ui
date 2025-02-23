import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { usePage } from "../../contexts/PageContext"; // Read breadcrumb config from context

const Breadcrumbs = () => {
    const { pageConfig } = usePage();

    // Ensure breadcrumb is an array, fallback to empty array
    const breadcrumbArray = Array.isArray(pageConfig?.breadcrumb) ? pageConfig.breadcrumb : [];

    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {/* Always show Home as a link */}
            {/*<Link component={RouterLink} to="/">*/}
            {/*    Home*/}
            {/*</Link>*/}

            {breadcrumbArray.map((item, index) => {
                if (!item || typeof item !== "object" || !item.label || !item.path) {
                    console.error("Invalid breadcrumb item detected:", item);
                    return null; // Skip invalid items
                }

                const isLast = index === breadcrumbArray.length - 1;
                const labelText = String(item.label); // Ensure label is always a string

                return isLast ? (
                    <Typography key={index} color="text.primary">
                        {labelText} {/* Ensure rendering only a string */}
                    </Typography>
                ) : (
                    <Link key={index} component={RouterLink} to={String(item.path)}>
                        {labelText} {/* Ensure rendering only a string */}
                    </Link>
                );
            })}
        </MUIBreadcrumbs>
    );
};

export default Breadcrumbs;
