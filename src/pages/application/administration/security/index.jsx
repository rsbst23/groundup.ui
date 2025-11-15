import React, { useEffect } from "react";
import { Box, Card, CardActionArea, CardContent, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePage } from "../../../../contexts/PageContext";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PolicyIcon from "@mui/icons-material/Policy";
import LockIcon from "@mui/icons-material/Lock";

const SecurityDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setPageConfig } = usePage();

  useEffect(() => {
    setPageConfig({
      title: t("security_dashboard"),
      breadcrumb: [
        { label: t("administration"), path: "/application/administration" },
        { label: t("security_dashboard"), path: "/application/administration/security" },
      ],
    });
  }, [setPageConfig, t]);

  const securityCards = [
    {
      title: t("users"),
      icon: <PeopleIcon sx={{ fontSize: 48, color: "#1976d2" }} />,
      path: "/application/administration/security/users",
      backgroundColor: "#e3f2fd",
    },
    {
      title: t("roles"),
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 48, color: "#2e7d32" }} />,
      path: "/application/administration/security/roles",
      backgroundColor: "#e8f5e9",
    },
    {
      title: t("policies"),
      icon: <PolicyIcon sx={{ fontSize: 48, color: "#7b1fa2" }} />,
      path: "/application/administration/security/policies",
      backgroundColor: "#f3e5f5",
    },
    {
      title: t("permissions"),
      icon: <LockIcon sx={{ fontSize: 48, color: "#f57c00" }} />,
      path: "/application/administration/security/permissions",
      backgroundColor: "#fff3e0",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("security_dashboard")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t("security_dashboard_description")}
      </Typography>

      <Grid container spacing={3}>
        {securityCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card 
              sx={{ 
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(card.path)}
                sx={{ height: "100%", p: 2 }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      backgroundColor: card.backgroundColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SecurityDashboard;
