import { Navigate } from 'react-router-dom';
import { RequireAuthProps } from '../types/types';
export const RequireAuth = ({
  children,
  redirectPath = '/welcome',
  redirect,
}: RequireAuthProps) => {
  if (redirect) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};
