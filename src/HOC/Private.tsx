import { Navigate } from 'react-router-dom';
import { RequireAuthProps } from '../types/types';
import { useAuth } from '../utils/firebase';

export const RequireAuth = ({
  children,
  redirectPath = '/welcome',
  redirect,
}: RequireAuthProps) => {
  const { user } = useAuth();

  if ((redirect && !user) || (!redirect && user)) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};
