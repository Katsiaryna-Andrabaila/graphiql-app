import { Navigate } from 'react-router-dom';
import { RequireAuthProps } from '../types/types';

export const RequireAuth = ({ children, redirectPath = "/about", redirect }: RequireAuthProps) => {
  if (redirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
