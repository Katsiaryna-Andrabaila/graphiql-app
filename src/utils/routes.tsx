import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import { Layout } from '../components/layout';
import { RequireAuth } from '../HOC/Private';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import RedactorPage from '../pages/RedactorPage/RedactorPage';

export const Routing = () => {
  const [user] = useAuthState(auth);

  //onAuthStateChanged(auth, async () => setIsAuth && setIsAuth(!!user));

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <RequireAuth redirect={!user}>
              <RedactorPage />
            </RequireAuth>
          }
        />
        <Route path="welcome" element={<WelcomePage />} />
        <Route
          path="login"
          element={
            <RequireAuth redirectPath="/" redirect={!!user}>
              <LoginPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
