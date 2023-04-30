import 'i18next';
import en from './src/data/en.json';
import ru from './src/data/ru.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en';
    resources: {
      en: typeof en;
      ru: typeof ru;
    };
  }
}
