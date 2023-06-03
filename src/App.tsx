import { StrictMode } from 'react';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './utils/routes';
import { AppProvider } from './HOC/Provider';
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
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            theme={{
              colorScheme,
              fontSizes: {
                xs: '0.7rem',
                sm: '0.9rem',
                md: '1.1rem',
                lg: '1.3rem',
                xl: '1.5rem',
              },
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Notifications position="bottom-right" zIndex={10} />
            <AppProvider>
              <BrowserRouter>
                <Routing />
              </BrowserRouter>
            </AppProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

export default App;
