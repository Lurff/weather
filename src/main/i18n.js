import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import English from "../locales/en-US/translation.json";
import Turkish from "../locales/tr-TR/translation.json";

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en-US",
		interpolation: {
			escapeValue: false,
		},
		resources: { en: { translation: English }, tr: { translation: Turkish } },
	});

export default i18n;
