import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { SETTINGSKEY } from "@helpers/settings";

import en from "./en/translation.json";
import fr from "./fr/translation.json";

const settings = window.localStorage.getItem(SETTINGSKEY);

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // lng: settings ? JSON.parse(settings).locale : undefined,
        lng: "fr",
        detection: {
            caches: [],
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en,
            fr,
        },
    });
