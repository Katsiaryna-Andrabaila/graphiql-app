import { createContext, useState, ReactNode, useEffect } from 'react';
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
  //let token: string | undefined | null = localStorage.getItem('authToken');
  const [isAuth, setIsAuth] = useState(authStatus);

  useEffect(() => {
    onIdTokenChanged(auth, async () => {
      const token = await user?.getIdToken(true);
      if (token) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        //localStorage.removeItem('authToken');
      }
    });
  }, [isAuth]);

  useEffect(() => {
    console.log(isAuth);
  });

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
