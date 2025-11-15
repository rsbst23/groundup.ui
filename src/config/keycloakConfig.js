// src/config/keycloakConfig.js
// Configuration for Keycloak client

// These values should match your Keycloak server settings
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080/",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "groundup",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "groundup-ui",

  // Use check-sso but without iframe
  onLoad: "check-sso",
  silentCheckSsoFallback: false, // Disable fallback to iframe
  checkLoginIframe: false, // Explicitly disable iframe
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
};

export default keycloakConfig;
