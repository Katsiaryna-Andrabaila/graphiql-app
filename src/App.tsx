import './App.css';
import WelcomePage from './pages/WelcomePage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './data/en.json';
import ru from './data/ru.json';


import HeaderResponsive from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ru: {
      translation: ru,
    },
  },
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

function App() {
  return (
    <>
      <HeaderResponsive
        links={[
          { link: '/', label: 'Home' },
          { link: '/redactor', label: 'Redactor' },
        ]}
      />
      <WelcomePage />
      <Footer />
    </>
  );
}

export default App;
