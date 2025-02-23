import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend"; // Loads translations from JSON files

i18n.use(Backend) // Load translations from JSON files
    .use(LanguageDetector) // Detect user's browser language
    .use(initReactI18next) // React bindings
    .init({
        lng: "en", // Default language
        fallbackLng: "en", // Fallback if language file is missing
        debug: true, // Debug mode in console

        interpolation: {
            escapeValue: false, // React already escapes values
        },

        backend: {
            loadPath: "/locales/{{lng}}.json" // Location of JSON files
        }
    });

export default i18n;
