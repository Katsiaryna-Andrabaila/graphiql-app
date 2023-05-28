import { Routes, Route } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WelcomePage';
import { Layout } from '../components/layout';
import { RequireAuth } from '../HOC/Private';
import { AppContext } from '../HOC/Provider';
import { useContext } from 'react';
import RedactorPage from '../pages/RedactorPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const Routing = () => {
  const { setIsAuth } = useContext(AppContext);
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  onAuthStateChanged(auth, async () => {
    if (!user) {
      setIsAuth && setIsAuth(false);
    } else {
      setIsAuth && setIsAuth(true);
    }
  });

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
