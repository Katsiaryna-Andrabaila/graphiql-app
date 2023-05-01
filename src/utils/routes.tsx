import App from '../App';
import { Navigate } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RedactorPage from '../pages/RedactorPage';

export const routes = [
  {
    path: '/',
    element: <App />,
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
