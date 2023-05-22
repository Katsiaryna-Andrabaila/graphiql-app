import { StrictMode, Suspense } from 'react';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './utils/routes';
import { AppProvider } from './HOC/Provider';
import { AppLoader } from './components/AppLoader';
import { ErrorFallback } from './components/ErrorFallback';
import { Notifications } from '@mantine/notifications';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import '../i18next';

function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
   
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <Notifications position="bottom-right" zIndex={2077} />
            <Suspense fallback={<AppLoader />}>
              <AppProvider>
                <BrowserRouter>
                  <Routing />
                </BrowserRouter>
              </AppProvider>
            </Suspense>
          </MantineProvider>
        </ColorSchemeProvider>
      </ErrorBoundary>
    
  );
}

export default App;
