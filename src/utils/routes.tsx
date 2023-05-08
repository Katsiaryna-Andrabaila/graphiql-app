import { Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import { Layout } from '../components/layout';
import { RequireAuth } from '../HOC/Private';
import { AppContext } from '../HOC/Provider';
import { useContext } from 'react';
import { lazy } from 'react';
import { lazy } from 'react';
const RedactorPage = lazy(() => import('../pages/RedactorPage'));


export const Routing = () => {
  const { isAuth } = useContext(AppContext);
  console.log(isAuth)
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <RequireAuth redirect={!isAuth}>
              <RedactorPage />
            </RequireAuth>
          }
        />
        <Route path="about" element={<WelcomePage />} />
        <Route
          path="login"
          element={
            <RequireAuth redirectPath="/" redirect={isAuth}>
              <LoginPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
