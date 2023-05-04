import React from 'react';
import './App.css';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './data/en.json';
import ru from './data/ru.json';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MantineProvider } from '@mantine/core';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './utils/routes';
import { AppContext } from './utils/context';

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
  const [isAuth, setIsAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsAuth(true);
    }
  }, []);

  const router = createBrowserRouter(routes);

  return (
    <React.StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppContext.Provider value={{ isAuth, setIsAuth, isLogin, setIsLogin }}>
            <RouterProvider router={router} />
          </AppContext.Provider>
        </MantineProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
