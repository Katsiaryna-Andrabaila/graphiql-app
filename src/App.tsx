import { StrictMode, Suspense } from 'react';
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
import { AppLoader } from './components/AppLoader';

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
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsAuth(true);
    }
  }, []);

  const router = createBrowserRouter(routes);

  return (
    <StrictMode>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Suspense fallback={<AppLoader />}>
            <AppContext.Provider value={{ isAuth, setIsAuth, isLogin, setIsLogin, lang, setLang }}>
              <RouterProvider router={router} />
            </AppContext.Provider>
          </Suspense>
        </MantineProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

export default App;
