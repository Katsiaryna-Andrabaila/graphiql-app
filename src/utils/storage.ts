import { User, getAuth, onIdTokenChanged } from 'firebase/auth';
import { logOut } from './firebase';

export const startSession = async (user: User) => {
  if (user.email) {
    const token = await user.getIdToken();
    localStorage.setItem('email', user.email);
    localStorage.setItem('authToken', token);
  }
};

export const getSession = () => {
  return {
    email: localStorage.getItem('email'),
    authToken: localStorage.getItem('authToken'),
  };
};

export const endSession = async () => {
  await logOut();
  localStorage.removeItem('authToken');
};

export const isLoggedIn = () => {
  let token = localStorage.getItem('authToken');
  const auth = getAuth();
  const { currentUser } = auth;
  onIdTokenChanged(auth, async (currentUser) => {
    if (currentUser && currentUser.email) {
      token = await currentUser.getIdToken(true);
      localStorage.setItem('email', currentUser.email);
      localStorage.setItem('authToken', token);
    } else {
      endSession();
    }
  });
  return token !== null;
};
