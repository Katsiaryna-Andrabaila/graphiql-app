import { Navigate } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import { lazy } from 'react';

const RedactorPage = lazy(() => import('../pages/RedactorPage'));

export const routes = [
  {
    path: '/',
    element: <WelcomePage />,
    errorElement: <Navigate to="/404" replace />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/redactor',
    element: <RedactorPage />,
  },
];
