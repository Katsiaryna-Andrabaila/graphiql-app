import { User } from 'firebase/auth';
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
