import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Language resources
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import arTranslation from './locales/ar.json';

const resources = {
  en: {
    translation: enTranslation
  },
  fr: {
    translation: frTranslation
  },
  ar: {
    translation: arTranslation
  }
};

const detectionOptions = {
  order: ['navigator', 'localStorage', 'htmlTag', 'path', 'subdomain'],
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  lookupLocalStorage: 'i18nextLng',
  checkWhitelist: true
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    whitelist: ['en', 'fr', 'ar'],
    detection: detectionOptions,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false
    },
    
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;