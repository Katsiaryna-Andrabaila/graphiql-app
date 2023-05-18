import en from './src//data/en.json';
import ru from './src//data/ru.json';
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ru: {
      translation: ru,
    },
  },
  lng: 'en',
  fallbackLng: 'ru',

  interpolation: {
    escapeValue: false,
  },
});