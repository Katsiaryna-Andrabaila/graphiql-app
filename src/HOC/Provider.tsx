import { createContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { endSession } from '../utils/storage';
import { TypeAppContext } from '../types/types';
import { useLocalStorage } from '@mantine/hooks';

const initialContext = { isAuth: false, isLogin: false, lang: 'en', history: [] };
export const AppContext = createContext<TypeAppContext>(initialContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const hasToken = localStorage.getItem('authToken') ? true : false;
  const [isAuth, setIsAuth] = useState(hasToken);
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

  const handleClickLogout = (cb: Function) => {
    endSession();
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
