import { Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RedactorPage from '../pages/RedactorPage';
import WelcomePage from '../pages/WelcomePage';
import { Layout } from '../components/layout';
import { RequireAuth } from '../HOC/Private';
import { AppContext } from '../HOC/Provider';
import { useContext } from 'react';

export const Routing = () => {
  const { isAuth } = useContext(AppContext);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <RequireAuth navigate="/about" redirect={!isAuth}>
              <RedactorPage />
            </RequireAuth>
          }
        />
        <Route path="about" element={<WelcomePage />} />
        <Route
          path="login"
          element={
            <RequireAuth navigate="/" redirect={isAuth}>
              <LoginPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
