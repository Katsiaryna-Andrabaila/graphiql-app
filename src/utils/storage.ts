import { User } from '../types/types';

export const startSession = (user: User) => {
  localStorage.setItem('email', user.email);
  localStorage.setItem('authToken', user.token);
};

export const getSession = () => {
  return {
    email: sessionStorage.getItem('email'),
    authToken: sessionStorage.getItem('authToken'),
  };
};

export const endSession = () => {
  localStorage.removeItem('authToken');
};

export const isLoggedIn = () => {
  return getSession().authToken;
};
