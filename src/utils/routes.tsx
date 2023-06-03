import { Routes, Route, Navigate } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import { Layout } from '../components/layout';
import { RequireAuth } from '../HOC/Private';
import { useAuth } from './firebase';
import RedactorPage from '../pages/RedactorPage/RedactorPage';
import { AppLoader } from '../components/AppLoader';

export const Routing = () => {
  const { loading } = useAuth();

  if (loading) return <AppLoader />;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <RequireAuth redirect={true}>
              <RedactorPage />
            </RequireAuth>
          }
        />
        <Route path="welcome" element={<WelcomePage />} />
        <Route
          path="login"
          element={
            <RequireAuth redirectPath="/" redirect={false}>
              <LoginPage />
            </RequireAuth>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};
