import { Navigate } from 'react-router-dom';
import { RequireAuthProps } from '../types/types';

export const RequireAuth = ({ children, navigate, redirect }: RequireAuthProps) => {
  if (redirect) {
    return <Navigate to={navigate} replace />;
  }

  return children;
};
