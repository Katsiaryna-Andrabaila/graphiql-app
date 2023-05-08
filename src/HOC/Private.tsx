import { Navigate } from 'react-router-dom';
import { RequireAuthProps } from '../types/types';

export const RequireAuth = ({ children, redirectPath = "/about", redirect }: RequireAuthProps) => {
  console.log(redirect)
  if (redirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
