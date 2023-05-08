import React from 'react';
import './App.css';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './data/en.json';
import ru from './data/ru.json';
import { ErrorBoundary } from 'react-error-boundary';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './utils/routes';
import { AppProvider } from './HOC/Provider';

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
    <React.StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppProvider>
            <BrowserRouter>
              <Routing />
            </BrowserRouter>
          </AppProvider>
        </MantineProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
