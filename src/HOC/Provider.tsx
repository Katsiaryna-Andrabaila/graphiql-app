import { createContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { endSession, isLoggedIn } from '../utils/storage';
import { TypeAppContext } from '../types/types';
import { useLocalStorage } from '@mantine/hooks';
import { getIdToken, getAuth, onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from '../utils/firebase';

const initialContext = { isAuth: false, isLogin: false, lang: 'en', history: [] };
export const AppContext = createContext<TypeAppContext>(initialContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const auth = getAuth(app);
  const { currentUser } = auth;
  const [user] = useAuthState(auth);
  const authStatus = localStorage.getItem('authToken') ? true : false;
  const token = useRef<string | undefined>();
  const [isAuth, setIsAuth] = useState(authStatus);

  useEffect(() => {
    onIdTokenChanged(auth, async () => {
      token.current = await user?.getIdToken(true);
      setIsAuth(token.current ? true : false);
    });
  }, [isAuth]);

  /* useCallback(() => {
    setIsAuth(token.current ? true : false);
  }, [isAuth]); */

  useEffect(() => {
    console.log(isAuth);
  }, [isAuth]);

  const [isLogin, setIsLogin] = useState(true);
  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage({
    key: 'language',
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });
  const [history, setHistory] = useLocalStorage({
    key: 'history',
    defaultValue: [],
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const handleClickLogin = (cb: Function) => {
    setIsLogin && setIsLogin(true);
    cb();
  };

  const handleClickRegister = (cb: Function) => {
    setIsLogin && setIsLogin(false);
    cb();
  };

  const handleClickLogout = async (cb: Function) => {
    await endSession();
    setIsAuth && setIsAuth(false);
    setIsLogin && setIsLogin(true);
    cb();
  };

  const handleChangeLanguage = () => {
    if (lang === 'en') {
      setLang && setLang('ru');
    } else {
      setLang && setLang('en');
    }
  };

  const value = {
    isAuth,
    setIsAuth,
    isLogin,
    lang,
    history,
    setHistory,
    handleChangeLanguage,
    handleClickLogout,
    handleClickRegister,
    handleClickLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
